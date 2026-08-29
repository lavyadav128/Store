// policyService.js
import AgentPolicy from '../schema/AgentPolicy.model.js';

export async function getPolicy() {
  let policy = await AgentPolicy.findOne({ key: 'default' });
  if (!policy) {
    policy = await AgentPolicy.create({ key: 'default' });
  } else {
    // Ensure all 5-track actions are in allowedActions for existing records
    const required = ['schedule_mandate', 'chase_invoice'];
    let needsSave = false;
    for (const act of required) {
      if (!policy.allowedActions.includes(act)) {
        policy.allowedActions.push(act);
        needsSave = true;
      }
    }
    if (needsSave) await policy.save();
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