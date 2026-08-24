import cron from "node-cron";
import { fetchAuthorisedLeads, logClientActivity } from "./clientAgent.service.js";
let started = false;
export function startClientAgentScheduler() {
  if (started) return;
  started = true;
  cron.schedule("17 */6 * * *", () => fetchAuthorisedLeads().catch((error) => logClientActivity("lead_source_error", error.message)), { timezone: "Asia/Kolkata" });
}
