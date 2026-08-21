// orchestrator.js
import FailedPayment from '../schema/FailedPayment.model.js';
import AgentAction from '../schema/AgentAction.model.js';
import { reasonAboutSignal } from './reasoningService.js';
import { evaluateGate } from './gateService.js';
import { executeAction } from './actionService.js';
import { getPolicy } from './policyService.js';

export async function processSignal(failedPaymentId, options = {}) {
  const failedPayment = await FailedPayment.findById(failedPaymentId);
  if (!failedPayment) throw new Error('FailedPayment not found');

  const signalSnapshot = failedPayment.toObject();

  const reasoning = await reasonAboutSignal(failedPayment);

  const gate = await evaluateGate(failedPayment, reasoning.proposedAction);

  const actionLog = new AgentAction({
    failedPaymentId: failedPayment._id,
    signalSnapshot,
    reasoning: {
      rootCause: reasoning.rootCause,
      explanation: reasoning.explanation,
      confidence: reasoning.confidence,
      model: reasoning.model,
      rawResponse: reasoning.rawResponse,
    },
    proposedAction: reasoning.proposedAction,
    gate,
    simulatedFailure: !!options.simulateFailure,
  });

  if (gate.decision === 'approved') {
    const execResult = await executeAction(failedPayment, reasoning.proposedAction, options);

    actionLog.execution = {
      attempted: true,
      success: execResult.success,
      error: execResult.error || null,
      result: execResult.result || {},
    };

    if (execResult.success) {
      applySuccessStatus(failedPayment, reasoning.proposedAction);
    } else {
      failedPayment.status = 'recovering';
    }

    if (['retry_now', 'retry_later'].includes(reasoning.proposedAction.type)) {
      failedPayment.attempts += 1;
    }
  } else if (gate.decision === 'pending_approval') {
    failedPayment.status = 'escalated';
  }

  await failedPayment.save();
  await actionLog.save();

  return { failedPayment, actionLog };
}

function applySuccessStatus(failedPayment, action) {
  switch (action.type) {
    case 'escalate_human':
      failedPayment.status = 'escalated';
      break;
    case 'give_up':
      failedPayment.status = 'lost';
      break;
    default:
      failedPayment.status = 'recovering';
  }
}