// reasoningService.js
// ─────────────────────────────────────────────────────────────
// THE "WHY". Calls an LLM via OpenRouter (OpenAI-compatible API),
// forces structured JSON, and returns a PROPOSAL only — this file
// never touches Razorpay, Twilio, or the database write for
// execution. It only proposes. gateService.js decides if the
// proposal is allowed to run.
// ─────────────────────────────────────────────────────────────

import OpenAI from 'openai';

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

// You can swap this for any model OpenRouter offers. Claude via
// OpenRouter keeps the "Claude reasons about the agent's decisions"
// story for your video even though billing goes through OpenRouter.
const MODEL = process.env.OPENROUTER_MODEL;

const VALID_ACTIONS = ['retry_now', 'retry_later', 'nudge_customer', 'offer_discount', 'escalate_human', 'give_up'];

/**
 * @param {Object} failedPayment - plain object snapshot of the signal
 * @returns {Object} { rootCause, explanation, confidence, proposedAction: { type, params }, model, rawResponse }
 */
export async function reasonAboutSignal(failedPayment) {
  const prompt = buildPrompt(failedPayment);

  const response = await openrouter.chat.completions.create({
    model: MODEL,
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.choices?.[0]?.message?.content || '{}';
  const parsed = safeParseJSON(text);

  // Guard rails on the LLM's own output — never trust it blindly,
  // even before it reaches the gate.
  const actionType = VALID_ACTIONS.includes(parsed.action) ? parsed.action : 'escalate_human';

  return {
    rootCause: parsed.root_cause || 'unknown',
    explanation: parsed.explanation || 'No explanation returned by model.',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.3,
    proposedAction: {
      type: actionType,
      params: parsed.params || {},
    },
    model: MODEL,
    rawResponse: parsed,
  };
}

function buildPrompt(fp) {
  return `You are the reasoning layer of a revenue-recovery agent for an Indian payments platform.
You NEVER execute anything — you only diagnose and propose. A separate policy gate decides if your
proposal is allowed to run. Because of that, be honest and conservative: if unsure, propose
"escalate_human" rather than guessing.

SIGNAL:
- source: ${fp.source}
- amount (paise): ${fp.amount}
- failureReason: ${fp.failureReason}
- attempts so far: ${fp.attempts}
- customer has a promise-to-pay on file: ${fp.promiseToPay?.promised || false}

Respond with ONLY a JSON object, no prose, no markdown fences:
{
  "root_cause": "short machine-readable cause, e.g. insufficient_funds | card_expired | network_error | customer_abandoned | genuinely_disputed | overdue_no_contact",
  "explanation": "one or two plain-English sentences a non-technical reviewer could read",
  "confidence": 0.0-1.0,
  "action": "one of: retry_now | retry_later | nudge_customer | offer_discount | escalate_human | give_up",
  "params": { "delayMinutes": number (optional, for retry_later), "discountPercent": number (optional, for offer_discount) }
}`;
}

function safeParseJSON(text) {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return {};
  }
}