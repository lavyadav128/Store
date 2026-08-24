import fetch from "node-fetch";
import ClientAgentConfig from "../schema/ClientAgentConfig.model.js";
import ClientLead from "../schema/ClientLead.model.js";
import ClientAgentActivity from "../schema/ClientAgentActivity.model.js";

export async function getClientAgentConfig() {
  let config = await ClientAgentConfig.findOne({ key: "default" });
  if (!config) config = await ClientAgentConfig.create({ key: "default" });
  return config;
}

export const logClientActivity = (type, message, metadata = {}) => ClientAgentActivity.create({ type, message, metadata });

export function scoreLead(lead, config) {
  const text = `${lead.clientType || ""} ${lead.requirement || ""}`.toLowerCase();
  const typeMatch = (config.clientTypes || []).some((item) => text.includes(String(item).toLowerCase()));
  const serviceMatch = (config.services || []).some((item) => text.includes(String(item).toLowerCase().split(" ")[0]));
  const budgetMatch = Number.isFinite(Number(lead.budget)) && Number(lead.budget) >= Number(config.minimumBudget || 0);
  return Math.min(100, 25 + (typeMatch ? 35 : 0) + (serviceMatch ? 20 : 0) + (budgetMatch ? 20 : 0));
}

export async function analyseLead(lead, config) {
  const score = scoreLead(lead, config);
  const budget = lead.budget ? `Budget reported: ₹${lead.budget}.` : "Budget has not been reported.";
  return { score, analysis: `${budget} Fit score ${score}/100 based on the admin-selected client types, services, and minimum budget. Admin approval is required before any commitment or work begins.` };
}

// Reads only from a source explicitly authorised and configured by the admin.
// It does not scrape marketplaces or send unsolicited messages.
export async function fetchAuthorisedLeads() {
  const config = await getClientAgentConfig();
  if (!config.running || !process.env.CLIENT_LEAD_SOURCE_URL) return [];
  const response = await fetch(process.env.CLIENT_LEAD_SOURCE_URL, {
    headers: process.env.CLIENT_LEAD_SOURCE_API_KEY ? { Authorization: `Bearer ${process.env.CLIENT_LEAD_SOURCE_API_KEY}` } : {},
  });
  if (!response.ok) throw new Error(`Authorised lead source returned ${response.status}`);
  const payload = await response.json();
  const records = Array.isArray(payload) ? payload : (payload.leads || []);
  const imported = [];
  for (const item of records.slice(0, 30)) {
    if (!item.businessName || !item.requirement) continue;
    const duplicate = await ClientLead.findOne({ source: "authorised_source", sourceUrl: String(item.sourceUrl || ""), email: String(item.email || "") });
    if (duplicate) continue;
    const lead = new ClientLead({ ...item, source: "authorised_source", requirement: String(item.requirement).slice(0, 12000) });
    const analysis = await analyseLead(lead, config);
    lead.fitScore = analysis.score; lead.analysis = analysis.analysis;
    await lead.save(); imported.push(lead);
  }
  if (imported.length) await logClientActivity("leads_imported", `Imported ${imported.length} leads from the authorised source.`);
  return imported;
}
