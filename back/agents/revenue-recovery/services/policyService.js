// policyService.js
import AgentPolicy from '../schema/AgentPolicy.model.js';

export async function getPolicy() {
  let policy = await AgentPolicy.findOne({ key: 'default' });
  if (!policy) {
    policy = await AgentPolicy.create({ key: 'default' });
  }
  return policy;
}

export async function updatePolicy(updates) {
  const allowedFields = [
    'maxRetries',
    'retryCooldownMinutes',
    'maxDiscountPercent',
    'autoApproveMaxAmount',
    'allowedActions',
    'maxConsecutiveFailuresBeforeEscalation',
  ];

  const safeUpdates = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) safeUpdates[field] = updates[field];
  }

  const policy = await AgentPolicy.findOneAndUpdate(
    { key: 'default' },
    { $set: safeUpdates },
    { new: true, upsert: true }
  );
  return policy;
}