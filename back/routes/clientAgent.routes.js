import crypto from "crypto";
import express from "express";
import Razorpay from "razorpay";
import auth from "../controller/authh.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { rateLimiter } from "../middleware/rateLimit.js";
import ClientLead from "../schema/ClientLead.model.js";
import ClientProject from "../schema/ClientProject.model.js";
import ClientAgentActivity from "../schema/ClientAgentActivity.model.js";
import { analyseLead, fetchAuthorisedLeads, getClientAgentConfig, logClientActivity } from "../services/clientAgent.service.js";

const router = express.Router();
const publicRouter = express.Router();
const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });
const allowedConfig = ["clientTypes", "minimumBudget", "services", "businessName", "contactEmail", "enquirySlug"];

publicRouter.get("/enquiry/:slug", async (req, res) => {
  const config = await getClientAgentConfig();
  if (req.params.slug !== config.enquirySlug) return res.sendStatus(404);
  res.json({ businessName: config.businessName || "Project Studio", enquirySlug: config.enquirySlug, services: config.services });
});

publicRouter.post("/enquiry/:slug", rateLimiter({ requests: 5, window: "1 h", prefix: "client-enquiry" }), async (req, res) => {
  try {
    const config = await getClientAgentConfig();
    if (req.params.slug !== config.enquirySlug) return res.sendStatus(404);
    const { businessName, contactName = "", email = "", phone = "", website = "", clientType = "", requirement, budget, deadline } = req.body;
    if (!businessName || !requirement || (!email && !phone)) return res.status(400).json({ error: "Business name, project requirement, and one contact method are required." });
    const lead = new ClientLead({ source: "enquiry_form", businessName, contactName, email, phone, website, clientType, requirement, budget: budget === "" ? null : Number(budget), deadline: deadline || null });
    const analysis = await analyseLead(lead, config);
    lead.fitScore = analysis.score; lead.analysis = analysis.analysis;
    await lead.save();
    await logClientActivity("enquiry_received", "A client submitted a project enquiry.", { leadId: String(lead._id) });
    res.status(201).json({ success: true, message: "Thanks. Our agent will ask the admin to review your requirements before confirming any work." });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

publicRouter.get("/payment/:code", async (req, res) => {
  const project = await ClientProject.findOne({ projectCode: req.params.code, status: { $in: ["payment_requested", "paid", "delivered"] } }).lean();
  if (!project) return res.sendStatus(404);
  res.json({ projectCode: project.projectCode, title: project.title, amount: project.proposedAmount, status: project.status, deliveryUrl: ["paid", "delivered"].includes(project.status) ? project.deliveryUrl : "" });
});

publicRouter.post("/payment/:code/create-order", rateLimiter({ requests: 8, window: "1 h", prefix: "client-payment" }), async (req, res) => {
  const project = await ClientProject.findOne({ projectCode: req.params.code, status: "payment_requested" });
  if (!project) return res.status(409).json({ error: "This project is not ready for payment." });
  const order = await razorpay.orders.create({ amount: Math.round(project.proposedAmount * 100), currency: "INR", receipt: `client_${project.projectCode}_${Date.now()}`, payment_capture: 1 });
  project.paymentOrderId = order.id; await project.save();
  res.json({ ...order, key: process.env.RAZORPAY_KEY_ID, title: project.title, amount: project.proposedAmount });
});

publicRouter.post("/payment/:code/verify", rateLimiter({ requests: 8, window: "1 h", prefix: "client-payment-verify" }), async (req, res) => {
  const project = await ClientProject.findOne({ projectCode: req.params.code, status: "payment_requested" });
  if (!project) return res.status(409).json({ error: "Payment is not available for this project." });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || razorpay_order_id !== project.paymentOrderId) return res.status(400).json({ error: "Order does not match." });
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(razorpay_signature || "");
  if (expectedBuffer.length !== suppliedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)) return res.status(400).json({ error: "Payment verification failed." });
  project.paymentId = razorpay_payment_id; project.status = "paid"; await project.save();
  await logClientActivity("project_paid", "Client payment was signature-verified.", { projectCode: project.projectCode });
  res.json({ success: true, deliveryUrl: project.deliveryUrl || "", message: "Payment verified. Your approved delivery is available." });
});

router.use(auth, requireAdmin);
router.get("/overview", async (_req, res) => {
  const [config, leads, projects, activities] = await Promise.all([getClientAgentConfig(), ClientLead.find().sort({ createdAt: -1 }).limit(40), ClientProject.find().sort({ createdAt: -1 }).limit(30), ClientAgentActivity.find().sort({ createdAt: -1 }).limit(30)]);
  res.json({ config, leads, projects, activities, enquiryPath: `/project-enquiry/${config.enquirySlug}` });
});
router.put("/config", async (req, res) => {
  const config = await getClientAgentConfig();
  for (const key of allowedConfig) if (req.body[key] !== undefined) config[key] = req.body[key];
  config.minimumBudget = Math.max(0, Number(config.minimumBudget) || 0);
  config.enquirySlug = String(config.enquirySlug || "project-enquiry").toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 60);
  await config.save(); await logClientActivity("config_updated", "Client Agent configuration updated."); res.json(config);
});
router.post("/start", async (_req, res) => { const config = await getClientAgentConfig(); config.running = true; config.lastStartedAt = new Date(); await config.save(); try { await fetchAuthorisedLeads(); } catch (error) { await logClientActivity("lead_source_error", error.message); } await logClientActivity("agent_started", "Client Agent started. It will only read configured authorised sources."); res.json(config); });
router.post("/stop", async (_req, res) => { const config = await getClientAgentConfig(); config.running = false; config.lastStoppedAt = new Date(); await config.save(); await logClientActivity("agent_stopped", "Client Agent stopped."); res.json(config); });
router.post("/leads/import", async (req, res) => { const config = await getClientAgentConfig(); const lead = new ClientLead({ ...req.body, source: "admin" }); const analysis = await analyseLead(lead, config); lead.fitScore = analysis.score; lead.analysis = analysis.analysis; await lead.save(); await logClientActivity("lead_added", "Admin added a client lead.", { leadId: String(lead._id) }); res.status(201).json(lead); });
router.patch("/leads/:id", async (req, res) => { const lead = await ClientLead.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status, adminNote: String(req.body.adminNote || "").slice(0, 3000) } }, { new: true }); if (!lead) return res.sendStatus(404); res.json(lead); });
router.post("/leads/:id/propose", async (req, res) => { const lead = await ClientLead.findById(req.params.id); if (!lead) return res.sendStatus(404); const amount = Number(req.body.proposedAmount); if (!amount || !req.body.title || !req.body.scope) return res.status(400).json({ error: "Title, scope, and proposed amount are required." }); const code = `PRJ-${Date.now().toString(36).toUpperCase()}`; const project = await ClientProject.create({ leadId: lead._id, projectCode: code, title: req.body.title, scope: req.body.scope, proposedAmount: amount, deadline: req.body.deadline || lead.deadline, developmentBrief: `Client: ${lead.businessName}\nRequirements: ${lead.requirement}\nApproved scope: ${req.body.scope}`, codexTask: `Build the approved project exactly to this brief. Include tests, a README, setup steps, and a verification report. Do not deploy, message the client, or expose secrets.\n\n${req.body.scope}` }); lead.status = "reviewing"; await lead.save(); await logClientActivity("project_pending_approval", "Project proposal awaits admin approval.", { projectCode: code }); res.status(201).json(project); });
router.patch("/projects/:id/approve", async (req, res) => { const project = await ClientProject.findById(req.params.id); if (!project) return res.sendStatus(404); if (!["approved", "declined"].includes(req.body.decision)) return res.status(400).json({ error: "Decision must be approved or declined." }); project.status = req.body.decision === "approved" ? "in_progress" : "declined"; project.adminNote = String(req.body.adminNote || "").slice(0, 3000); await project.save(); await logClientActivity("project_reviewed", `Project ${req.body.decision} by admin.`, { projectCode: project.projectCode }); res.json(project); });
router.patch("/projects/:id/delivery", async (req, res) => { const project = await ClientProject.findById(req.params.id); if (!project) return res.sendStatus(404); if (project.status !== "in_progress") return res.status(409).json({ error: "Only an in-progress project can be submitted for delivery review." }); Object.assign(project, { repositoryUrl: String(req.body.repositoryUrl || ""), deliveryUrl: String(req.body.deliveryUrl || ""), testSummary: String(req.body.testSummary || ""), status: "awaiting_delivery_review" }); await project.save(); await logClientActivity("delivery_review_requested", "Project delivery awaits admin review.", { projectCode: project.projectCode }); res.json(project); });
router.patch("/projects/:id/delivery-review", async (req, res) => { const project = await ClientProject.findById(req.params.id); if (!project) return res.sendStatus(404); if (!["approved", "changes_requested"].includes(req.body.decision)) return res.status(400).json({ error: "Invalid decision." }); project.status = req.body.decision === "approved" ? "delivery_approved" : "in_progress"; project.adminNote = String(req.body.adminNote || "").slice(0, 3000); await project.save(); await logClientActivity("delivery_reviewed", `Delivery ${req.body.decision} by admin.`, { projectCode: project.projectCode }); res.json(project); });
router.post("/projects/:id/request-payment", async (req, res) => { const project = await ClientProject.findById(req.params.id); if (!project) return res.sendStatus(404); if (project.status !== "delivery_approved") return res.status(409).json({ error: "Admin must approve the delivery before payment can be requested." }); project.status = "payment_requested"; project.paymentLink = `${String(process.env.FRONTEND_ORIGIN || "http://localhost:3000").replace(/\/$/, "")}/project-payment/${project.projectCode}`; await project.save(); await logClientActivity("payment_requested", "Admin approved a client payment request.", { projectCode: project.projectCode }); res.json(project); });

export { publicRouter as clientAgentPublicRouter };
export default router;
