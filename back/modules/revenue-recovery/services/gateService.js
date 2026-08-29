// gateService.js
import { getPolicy } from './policyService.js';
import AgentAction from '../schema/AgentAction.model.js';

export async function evaluateGate(failedPayment, proposedAction) {
  const policy = await getPolicy();

  // Every real student payment failure is intentionally human-approved before
  // any recovery discount/offer is issued, regardless of amount.
  // if (failedPayment.source === 'payment_failure') {
  //   return {
  //     decision: 'pending_approval',
  //     ruleTriggered: 'payment_failure_requires_admin_approval',
  //     explanation: 'Every payment-failure recovery offer requires explicit admin approval before the student is notified or a discounted checkout is created.',
  //   };
  // }

  if (!policy.allowedActions.includes(proposedAction.type)) {
    return block('action_not_allowed', `"${proposedAction.type}" is not in the allowed action list.`);
  }

  if (
    (proposedAction.type === 'retry_now' || proposedAction.type === 'retry_later') &&
    failedPayment.attempts >= policy.maxRetries
  ) {
    return block('max_retries_reached', `Signal has already been retried ${failedPayment.attempts} times (limit: ${policy.maxRetries}). Must escalate instead.`);
  }

  if (proposedAction.type === 'retry_now') {
    const lastAction = await AgentAction.findOne({
      failedPaymentId: failedPayment._id,
      'proposedAction.type': { $in: ['retry_now', 'retry_later'] },
      'gate.decision': 'approved',
    }).sort({ createdAt: -1 });

    if (lastAction) {
      const minutesSince = (Date.now() - lastAction.createdAt.getTime()) / 60000;
      if (minutesSince < policy.retryCooldownMinutes) {
        return block('retry_cooldown', `Last retry was ${Math.round(minutesSince)} min ago; cooldown is ${policy.retryCooldownMinutes} min.`);
      }
    }
  }

  if (proposedAction.type === 'offer_discount') {
    const pct = proposedAction.params?.discountPercent ?? 0;
    if (pct > policy.maxDiscountPercent) {
      return block('max_discount_exceeded', `Proposed ${pct}% exceeds the ${policy.maxDiscountPercent}% cap.`);
    }
  }

  if (failedPayment.amount > policy.autoApproveMaxAmount) {
    return {
      decision: 'pending_approval',
      ruleTriggered: 'amount_above_auto_approve_ceiling',
      explanation: `Amount ₹${(failedPayment.amount / 100).toFixed(2)} exceeds auto-approve ceiling of ₹${(policy.autoApproveMaxAmount / 100).toFixed(2)}. Routed to human approval queue.`,
    };
  }

  const recentFailures = await AgentAction.countDocuments({
    failedPaymentId: failedPayment._id,
    'execution.attempted': true,
    'execution.success': false,
  });
  if (recentFailures >= policy.maxConsecutiveFailuresBeforeEscalation && proposedAction.type !== 'escalate_human') {
    return block('circuit_breaker', `${recentFailures} consecutive execution failures — forcing escalation instead of another attempt.`);
  }

  return {
    decision: 'approved',
    ruleTriggered: '',
    explanation: 'Within all policy bounds.',
  };
}

function block(rule, explanation) {
  return { decision: 'blocked', ruleTriggered: rule, explanation };
}
