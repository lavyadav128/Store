// revenueRecoveryScheduler.js
// ─────────────────────────────────────────────────────────────
// Real background worker scheduler for scheduled retries and
// optimal mandate debit windows (8:30 - 10:30 AM IST / salary cycle days).
// ─────────────────────────────────────────────────────────────

import FailedPayment from '../schema/FailedPayment.model.js';
import AgentAction from '../schema/AgentAction.model.js';
import { executeAction } from './actionService.js';

let isRunning = false;

export async function processScheduledRetries() {
  if (isRunning) return;
  isRunning = true;

  try {
    const now = new Date();

    // Find signals that are in recovering status and past their scheduled retry time
    const dueSignals = await FailedPayment.find({
      status: 'recovering',
      $or: [
        { 'mandateDetails.nextScheduledRetry': { $lte: now } },
        { scheduledFor: { $lte: now } },
      ],
    }).limit(10);

    for (const signal of dueSignals) {
      console.log(`[Scheduler] Executing scheduled retry for signal ${signal._id} (${signal.customerName})`);

      const action = {
        type: signal.source === 'mandate_failure' ? 'schedule_mandate' : 'retry_now',
        params: { channel: 'whatsapp', scheduledRetry: true },
      };

      const result = await executeAction(signal, action);

      await AgentAction.create({
        failedPaymentId: signal._id,
        signalSnapshot: signal.toObject(),
        reasoning: {
          rootCause: signal.failureReason || 'scheduled_retry_due',
          explanation: `Automated scheduler triggered execution at scheduled time (${now.toLocaleString('en-IN')}).`,
          confidence: 1.0,
          model: 'scheduler-engine',
          rawResponse: { scheduledTime: now },
        },
        proposedAction: action,
        gate: {
          decision: 'approved',
          ruleTriggered: 'scheduled_execution_due',
          explanation: 'Executed automatically by background scheduler.',
        },
        execution: {
          attempted: true,
          success: result.success,
          error: result.error || null,
          result,
        },
      });

      // Clear scheduled time so it doesn't re-trigger continuously
      if (signal.mandateDetails) signal.mandateDetails.nextScheduledRetry = null;
      signal.scheduledFor = null;
      if (result.success) signal.status = 'recovering';
      await signal.save();
    }
  } catch (err) {
    console.error('[Scheduler] Error processing scheduled retries:', err.message);
  } finally {
    isRunning = false;
  }
}

export function startRevenueRecoveryScheduler(intervalMs = 30000) {
  console.log('⏱️ Revenue Recovery Background Scheduler started (checking every 30s)');
  setInterval(processScheduledRetries, intervalMs);
}
