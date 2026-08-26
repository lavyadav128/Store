// reasoningService.js
// ─────────────────────────────────────────────────────────────
// The "WHY" layer. Analyzes failed payment signals, diagnoses root causes,
// and proposes optimal recovery strategies using Groq/OpenRouter with
// deterministic rule fallback across all Razorpay Buildathon directions.
// ─────────────────────────────────────────────────────────────

import Groq from 'groq-sdk';
import fetch from 'node-fetch';
import { generateVoiceScript } from './whatsappRecovery.js';

const VALID_ACTIONS = [
  'retry_now',
  'retry_later',
  'nudge_customer',
  'offer_discount',
  'schedule_mandate',
  'chase_invoice',
  'escalate_human',
  'give_up',
];

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
  const source = fp.source || 'payment_failure';
  const reason = String(fp.failureReason || '').toLowerCase();

  // Direction 4: B2B Receivables / Overdue Invoice Chaser
  if (source === 'overdue_receivable') {
    const days = fp.invoiceDetails?.daysOverdue || 14;
    return {
      rootCause: 'b2b_invoice_overdue',
      explanation: `Corporate invoice is ${days} days past due. Engaging automated B2B receivables sequence.`,
      confidence: 0.95,
      proposedAction: {
        type: days > 30 ? 'escalate_human' : 'chase_invoice',
        params: { channel: 'whatsapp_and_email', daysOverdue: days },
      },
    };
  }

  // Direction 5: Mandate Retry Sequencer (UPI Autopay / e-Mandate)
  if (source === 'mandate_failure') {
    return {
      rootCause: 'mandate_debit_declined',
      explanation: 'UPI Autopay mandate failed. Calculated next optimal banking window (08:30 AM - 10:30 AM IST).',
      confidence: 0.95,
      proposedAction: {
        type: 'schedule_mandate',
        params: { window: '08:30 AM - 10:30 AM IST', nextAttemptHours: 18 },
      },
    };
  }

  // Direction 3: Failed Subscription Recovery
  if (source === 'subscription_failure') {
    return {
      rootCause: 'subscription_recurring_decline',
      explanation: 'Recurring subscription debit failed. Initiating dunning sequence with smart retry.',
      confidence: 0.92,
      proposedAction: {
        type: 'nudge_customer',
        params: { channel: 'whatsapp', includeCardUpdateLink: true },
      },
    };
  }

  // Direction 2: Checkout Drop-Off Recovery
  if (source === 'checkout_dropoff' || /cancelled|drop|closed|dismissed|abandoned/i.test(reason)) {
    return {
      rootCause: 'checkout_abandoned',
      explanation: 'Customer viewed checkout but dropped off before completing payment.',
      confidence: 0.9,
      proposedAction: {
        type: 'offer_discount',
        params: { discountPercent: 10, channel: 'whatsapp' },
      },
    };
  }

  // Direction 1: Payment Degradation Root Cause Analysis
  if (/insufficient|balance|low_funds/i.test(reason)) {
    return {
      rootCause: 'insufficient_funds',
      explanation: 'The bank declined the transaction due to insufficient account balance. Scheduled smart retry.',
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
      confidence: 0.92,
      proposedAction: { type: 'nudge_customer', params: { channel: 'whatsapp' } },
    };
  }

  return {
    rootCause: 'gateway_declined',
    explanation: `Transaction was declined by payment gateway: ${fp.failureReason}`,
    confidence: 0.8,
    proposedAction: { type: 'nudge_customer', params: { channel: 'whatsapp' } },
  };
}

/**
 * @param {Object} failedPayment - plain object snapshot of the signal
 * @returns {Object} { rootCause, explanation, confidence, proposedAction: { type, params }, model, rawResponse }
 */
export async function reasonAboutSignal(failedPayment) {
  const voiceScript = generateVoiceScript(failedPayment);

  const prompt = `You are the reasoning layer of an advanced AI Revenue Recovery Agent for Razorpay payments.
You analyze failed payment events across 5 directions:
1. payment_failure (payment degradation, OTP timeout, bank downtime)
2. checkout_dropoff (cart / intent abandoned)
3. subscription_failure (recurring billing failed)
4. overdue_receivable (B2B overdue invoice)
5. mandate_failure (UPI Autopay mandate failure)

SIGNAL:
- source: ${failedPayment.source}
- amount (paise): ${failedPayment.amount} (₹${((failedPayment.amount || 0) / 100).toLocaleString('en-IN')})
- failureReason: ${failedPayment.failureReason}
- attempts so far: ${failedPayment.attempts}
- customerName: ${failedPayment.customerName || 'N/A'}
- has promise-to-pay: ${failedPayment.promiseToPay?.promised || false}

Respond with ONLY a JSON object:
{
  "root_cause": "short machine-readable cause, e.g. insufficient_funds | card_expired | bank_otp_timeout | checkout_abandoned | b2b_invoice_overdue | mandate_debit_declined | gateway_declined",
  "explanation": "concise 1-2 sentence diagnostic explanation",
  "confidence": 0.0-1.0,
  "action": "one of: retry_now | retry_later | nudge_customer | offer_discount | schedule_mandate | chase_invoice | escalate_human | give_up",
  "params": { "delayMinutes": number, "discountPercent": number, "channel": "whatsapp" }
}`;

  let parsed = null;
  let modelUsed = 'rule_engine';

  // 1. Try Groq
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_')) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }],
      });
      parsed = cleanLlmJson(completion.choices?.[0]?.message?.content);
      if (parsed?.root_cause) modelUsed = 'groq:llama-3.3-70b';
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
      voiceScript,
      model: 'expert_rule_engine',
      rawResponse: fallback,
    };
  }

  const actionType = VALID_ACTIONS.includes(parsed.action) ? parsed.action : 'escalate_human';

  return {
    rootCause: parsed.root_cause || 'unknown',
    explanation: parsed.explanation || 'Analyzed failure event.',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
    proposedAction: {
      type: actionType,
      params: parsed.params || {},
    },
    voiceScript,
    model: modelUsed,
    rawResponse: parsed,
  };
}