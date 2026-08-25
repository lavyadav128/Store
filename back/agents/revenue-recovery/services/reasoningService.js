// reasoningService.js
// ─────────────────────────────────────────────────────────────
// The "WHY" layer. Analyzes failed payment signals, diagnoses root causes,
// and proposes optimal recovery strategies using Groq/OpenRouter with
// deterministic rule fallback.
// ─────────────────────────────────────────────────────────────

import Groq from 'groq-sdk';
import fetch from 'node-fetch';

const VALID_ACTIONS = ['retry_now', 'retry_later', 'nudge_customer', 'offer_discount', 'escalate_human', 'give_up'];

function cleanLlmJson(rawText = '') {
  if (!rawText) return null;
  let text = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

/**
 * Deterministic expert diagnosis fallback if LLM is unavailable.
 */
function deterministicDiagnosis(fp) {
  const reason = String(fp.failureReason || '').toLowerCase();

  if (/insufficient|balance|low_funds/i.test(reason)) {
    return {
      rootCause: 'insufficient_funds',
      explanation: 'The bank declined the transaction due to insufficient account balance.',
      confidence: 0.95,
      proposedAction: { type: 'retry_later', params: { delayMinutes: 120 } },
    };
  }

  if (/expired|card_expired/i.test(reason)) {
    return {
      rootCause: 'card_expired',
      explanation: 'The payment card has expired or invalid validity dates were entered.',
      confidence: 0.95,
      proposedAction: { type: 'nudge_customer', params: { channel: 'whatsapp' } },
    };
  }

  if (/otp|timeout|bank_auth|declined_by_bank|authentication_failed/i.test(reason)) {
    return {
      rootCause: 'bank_otp_timeout',
      explanation: 'Customer faced a 3D Secure OTP verification timeout with the issuing bank.',
      confidence: 0.9,
      proposedAction: { type: 'nudge_customer', params: { channel: 'whatsapp' } },
    };
  }

  if (/cancelled|drop|closed|dismissed|abandoned/i.test(reason)) {
    return {
      rootCause: 'customer_abandoned',
      explanation: 'Customer exited the payment gateway before completing the transaction.',
      confidence: 0.85,
      proposedAction: { type: 'offer_discount', params: { discountPercent: 10 } },
    };
  }

  return {
    rootCause: 'gateway_declined',
    explanation: `Transaction was declined by payment gateway: ${fp.failureReason}`,
    confidence: 0.75,
    proposedAction: { type: 'nudge_customer', params: { channel: 'whatsapp' } },
  };
}

/**
 * @param {Object} failedPayment - plain object snapshot of the signal
 * @returns {Object} { rootCause, explanation, confidence, proposedAction: { type, params }, model, rawResponse }
 */
export async function reasonAboutSignal(failedPayment) {
  const prompt = `You are the reasoning layer of a revenue-recovery agent for an Indian payments platform.
You NEVER execute anything — you only diagnose and propose. A separate policy gate decides if your
proposal is allowed to run.

SIGNAL:
- source: ${failedPayment.source}
- amount (paise): ${failedPayment.amount} (₹${((failedPayment.amount || 0) / 100).toLocaleString()})
- failureReason: ${failedPayment.failureReason}
- attempts so far: ${failedPayment.attempts}
- customerName: ${failedPayment.customerName || 'N/A'}
- customer has a promise-to-pay on file: ${failedPayment.promiseToPay?.promised || false}

Respond with ONLY a JSON object, no prose, no markdown fences:
{
  "root_cause": "short machine-readable cause, e.g. insufficient_funds | card_expired | network_error | customer_abandoned | bank_otp_timeout | gateway_declined",
  "explanation": "one or two plain-English sentences a non-technical reviewer could read explaining the exact failure reason",
  "confidence": 0.0-1.0,
  "action": "one of: retry_now | retry_later | nudge_customer | offer_discount | escalate_human | give_up",
  "params": { "delayMinutes": number, "discountPercent": number }
}`;

  let parsed = null;
  let modelUsed = 'rule_engine';

  // 1. Try Groq (Ultra-Fast)
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_')) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'qwen/qwen3.6-27b',
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }],
      });
      parsed = cleanLlmJson(completion.choices?.[0]?.message?.content);
      if (parsed?.root_cause) modelUsed = 'groq:qwen3.6-27b';
    } catch (err) {
      console.warn('Groq reasoning exception:', err.message);
    }
  }

  // 2. Try OpenRouter Fallback
  if (!parsed && process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes('your_')) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'Revenue Recovery Reasoning',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-nano-9b-v2:free',
          temperature: 0.2,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        parsed = cleanLlmJson(data.choices?.[0]?.message?.content);
        if (parsed?.root_cause) modelUsed = 'openrouter:nemotron';
      }
    } catch (err) {
      console.warn('OpenRouter reasoning exception:', err.message);
    }
  }

  // 3. Fallback to expert deterministic diagnosis
  if (!parsed || !parsed.root_cause) {
    const fallback = deterministicDiagnosis(failedPayment);
    return {
      ...fallback,
      model: 'expert_rule_engine',
      rawResponse: fallback,
    };
  }

  const actionType = VALID_ACTIONS.includes(parsed.action) ? parsed.action : 'escalate_human';

  return {
    rootCause: parsed.root_cause || 'unknown',
    explanation: parsed.explanation || 'Analyzed failure event.',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85,
    proposedAction: {
      type: actionType,
      params: parsed.params || {},
    },
    model: modelUsed,
    rawResponse: parsed,
  };
}