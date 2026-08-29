import crypto from "crypto";
import express from "express";
import { createRequire } from "module";
import Razorpay from "razorpay";
import auth from "../../auth/authh.js";
import requireAdmin from "../../../shared/middleware/requireAdmin.js";

const require = createRequire(import.meta.url);
const archiver = require("archiver");
import { rateLimiter } from "../../../shared/middleware/rateLimit.js";
import ClientLead from "../schema/ClientLead.model.js";
import ClientProject from "../schema/ClientProject.model.js";
import ClientAgentActivity from "../schema/ClientAgentActivity.model.js";
import {
  analyseLead,
  buildProjectCodebaseWithAi,
  fetchAuthorisedLeads,
  generateAiProposalAndCodexTask,
  getClientAgentConfig,
  logClientActivity,
} from "../services/clientAgent.service.js";
import {
  sendClientPaymentEmail,
  sendClientDeliveryEmail,
} from "../../../shared/services/emailService.js";
import {
  sendClientPaymentWhatsApp,
  sendClientDeliveryWhatsApp,
} from "../../../shared/services/twilioservice.js";

const router = express.Router();
const publicRouter = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const allowedConfig = ["clientTypes", "minimumBudget", "services", "businessName", "contactEmail", "enquirySlug"];

function getFrontendBaseUrl(req) {
  if (req?.headers?.origin && !req.headers.origin.includes("localhost:3000")) {
    return req.headers.origin.replace(/\/$/, "");
  }
  if (req?.headers?.referer) {
    try {
      const parsed = new URL(req.headers.referer);
      if (!parsed.host.includes("localhost:3000")) {
        return `${parsed.protocol}//${parsed.host}`;
      }
    } catch (_) {}
  }
  if (process.env.FRONTEND_ORIGIN) {
    return process.env.FRONTEND_ORIGIN.replace(/\/$/, "");
  }
  return "https://note-vevp.onrender.com";
}

/* ═════════════════════════════════════════════════════════════
   PUBLIC CLIENT PORTAL & ENQUIRY ROUTES
═════════════════════════════════════════════════════════════ */

publicRouter.get(["/enquiry", "/enquiry/:slug"], async (req, res) => {
  const config = await getClientAgentConfig();
  const validSlug = config.enquirySlug || "project-enquiry";
  res.json({
    businessName: config.businessName || "Project Studio",
    enquirySlug: validSlug,
    services: config.services || ["Websites", "Web apps", "AI automation"],
  });
});

publicRouter.post(
  ["/enquiry", "/enquiry/:slug"],
  rateLimiter({ requests: 10, window: "1 h", prefix: "client-enquiry" }),
  async (req, res) => {
    try {
      const config = await getClientAgentConfig();
      const validSlug = config.enquirySlug || "project-enquiry";
      const {
        businessName,
        contactName = "",
        email = "",
        phone = "",
        website = "",
        clientType = "",
        requirement,
        budget,
        deadline,
      } = req.body;

      if (!businessName || !requirement || (!email && !phone)) {
        return res.status(400).json({
          error: "Business name, project requirement, and one contact method (email or phone) are required.",
        });
      }

      const lead = new ClientLead({
        source: "enquiry_form",
        businessName,
        contactName,
        email,
        phone,
        website,
        clientType,
        requirement,
        budget: budget === "" ? null : Number(budget),
        deadline: deadline || null,
      });

      const analysis = await analyseLead(lead, config);
      lead.fitScore = analysis.score;
      lead.analysis = analysis.analysis;
      await lead.save();

      await logClientActivity("enquiry_received", "A client submitted a project enquiry.", {
        leadId: String(lead._id),
        businessName: lead.businessName,
      });

      res.status(201).json({
        success: true,
        message: "Thanks! Our agent has recorded your requirements. The team will review and share a proposal shortly.",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Public Project Portal (View Project Details / Delivery)
publicRouter.get("/payment/:code", async (req, res) => {
  const project = await ClientProject.findOne({
    projectCode: req.params.code,
    status: { $in: ["payment_requested", "paid", "delivered"] },
  })
    .populate("leadId", "businessName contactName email phone")
    .lean();

  if (!project) return res.status(404).json({ error: "Project payment link is unavailable or invalid." });

  res.json({
    projectCode: project.projectCode,
    title: project.title,
    scope: project.scope,
    amount: project.proposedAmount,
    status: project.status,
    deliveryUrl: ["paid", "delivered"].includes(project.status) ? project.deliveryUrl : "",
    repositoryUrl: ["paid", "delivered"].includes(project.status) ? project.repositoryUrl : "",
    livePreviewUrl: ["paid", "delivered"].includes(project.status) ? project.livePreviewUrl : "",
    zipDownloadUrl: ["paid", "delivered"].includes(project.status) ? project.zipDownloadUrl : "",
    testSummary: ["paid", "delivered"].includes(project.status) ? project.testSummary : "",
    clientName: project.leadId?.contactName || project.leadId?.businessName || "Client",
  });
});

// Interactive Live Preview of Generated Project
publicRouter.get("/preview/:code", async (req, res) => {
  const project = await ClientProject.findOne({ projectCode: req.params.code });
  if (!project || !project.generatedCodeFiles || project.generatedCodeFiles.length === 0) {
    return res.status(404).send("<h2>Project preview is not available or build is in progress.</h2>");
  }

  const htmlFile = project.generatedCodeFiles.find((f) => f.filename === "index.html");
  const jsFile = project.generatedCodeFiles.find((f) => f.filename === "app.js" || f.filename === "script.js");
  const cssFile = project.generatedCodeFiles.find((f) => f.filename === "style.css");

  if (!htmlFile) {
    return res.status(404).send("<h2>No index.html found in generated codebase.</h2>");
  }

  let html = htmlFile.content;

  // Inline CSS if external link
  if (cssFile && html.includes("style.css")) {
    html = html.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, `<style>${cssFile.content}</style>`);
  }

  // Inline JS if external script
  if (jsFile && (html.includes("app.js") || html.includes("script.js"))) {
    html = html.replace(/<script[^>]*src=["'](app|script)\.js["'][^>]*><\/script>/i, `<script>${jsFile.content}</script>`);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

function createZipArchive(options = { zlib: { level: 9 } }) {
  if (typeof archiver === "function") return archiver("zip", options);
  if (archiver?.ZipArchive) return new archiver.ZipArchive(options);
  if (archiver?.create) return archiver.create("zip", options);
  return new archiver.Archiver("zip", options);
}

// Download Source Code ZIP Package
publicRouter.get("/download/:code", async (req, res) => {
  const project = await ClientProject.findOne({ projectCode: req.params.code });
  if (!project || !project.generatedCodeFiles || project.generatedCodeFiles.length === 0) {
    return res.status(404).send("Project files are not ready for download.");
  }

  const archive = createZipArchive({ zlib: { level: 9 } });

  res.attachment(`${project.projectCode}_source_code.zip`);
  archive.pipe(res);

  for (const file of project.generatedCodeFiles) {
    archive.append(file.content, { name: file.filename });
  }

  await archive.finalize();
});

// Create Razorpay Order for Project Payment
publicRouter.post(
  "/payment/:code/create-order",
  rateLimiter({ requests: 8, window: "1 h", prefix: "client-payment" }),
  async (req, res) => {
    const project = await ClientProject.findOne({
      projectCode: req.params.code,
      status: "payment_requested",
    });

    if (!project) return res.status(409).json({ error: "This project is not currently open for payment." });

    const amountInPaise = Math.round(project.proposedAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `client_${project.projectCode}_${Date.now()}`,
      payment_capture: 1,
    });

    project.paymentOrderId = order.id;
    await project.save();

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      amountInRupees: project.proposedAmount,
      key: process.env.RAZORPAY_KEY_ID,
      title: project.title,
    });
  }
);

// Record Failed Payment Signal and push to Revenue Recovery Agent
publicRouter.post(
  "/payment/:code/record-failure",
  rateLimiter({ requests: 12, window: "1 h", prefix: "client-payment-failed" }),
  async (req, res) => {
    try {
      const project = await ClientProject.findOne({ projectCode: req.params.code }).populate("leadId");
      if (!project) return res.status(404).json({ error: "Project not found" });

      const { error: paymentError, razorpay_order_id, razorpay_payment_id } = req.body;
      const lead = project.leadId;

      const reason =
        paymentError?.description ||
        paymentError?.reason ||
        paymentError?.code ||
        "Payment cancelled or timed out";

      const FailedPayment = (await import("../../revenue-recovery/schema/FailedPayment.model.js")).default;
      const { handlePaymentFailed } = await import("../../revenue-recovery/services/orchestrator.js");

      const failedRecord = await FailedPayment.create({
        source: "payment_failure",
        batchId: project.projectCode,
        batchTitle: `Client Project: ${project.title}`,
        amount: Math.round(project.proposedAmount * 100),
        currency: "INR",
        customerName: lead?.contactName || lead?.businessName || "Client",
        customerEmail: lead?.email || "",
        customerPhone: lead?.phone || "",
        failureReason: reason,
        razorpayOrderId: razorpay_order_id || project.paymentOrderId || null,
        razorpayPaymentId: razorpay_payment_id || null,
        status: "open",
        rawPayload: { projectCode: project.projectCode, paymentError },
      });

      // Trigger Revenue Recovery diagnosis in the background
      handlePaymentFailed(failedRecord).catch((err) =>
        console.warn("Revenue recovery orchestrator trigger exception:", err.message)
      );

      await logClientActivity(
        "payment_failed",
        `Payment failed for ${project.title} (${project.projectCode}): ${reason}. Pushed to Revenue Recovery Agent.`,
        { projectCode: project.projectCode, reason, amount: project.proposedAmount }
      );

      res.json({ success: true, recordedReason: reason });
    } catch (err) {
      console.warn("Record failure error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

// Verify Razorpay Payment and Unlock Deliverables
publicRouter.post(
  "/payment/:code/verify",
  rateLimiter({ requests: 8, window: "1 h", prefix: "client-payment-verify" }),
  async (req, res) => {
    const project = await ClientProject.findOne({
      projectCode: req.params.code,
      status: "payment_requested",
    }).populate("leadId");

    if (!project) return res.status(409).json({ error: "Payment is not available or already completed." });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || razorpay_order_id !== project.paymentOrderId) {
      return res.status(400).json({ error: "Razorpay order does not match." });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expected);
    const suppliedBuffer = Buffer.from(razorpay_signature || "");

    if (
      expectedBuffer.length !== suppliedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, suppliedBuffer)
    ) {
      return res.status(400).json({ error: "Payment verification failed. Invalid signature." });
    }

    project.paymentId = razorpay_payment_id;
    project.status = "delivered";
    await project.save();

    await logClientActivity("project_paid", "Client payment verified. Deliverables unlocked.", {
      projectCode: project.projectCode,
      amount: project.proposedAmount,
      paymentId: razorpay_payment_id,
    });

    const lead = project.leadId;
    if (lead) {
      if (lead.email) {
        sendClientDeliveryEmail({
          clientName: lead.contactName || lead.businessName,
          clientEmail: lead.email,
          projectTitle: project.title,
          projectCode: project.projectCode,
          deliveryUrl: project.deliveryUrl,
          repositoryUrl: project.repositoryUrl,
          testSummary: project.testSummary,
        }).catch((err) => console.error("Client delivery email dispatch failed:", err.message));
      }

      if (lead.phone) {
        sendClientDeliveryWhatsApp({
          clientName: lead.contactName || lead.businessName,
          clientPhone: lead.phone,
          projectTitle: project.title,
          projectCode: project.projectCode,
          deliveryUrl: project.deliveryUrl,
          repositoryUrl: project.repositoryUrl,
        }).catch((err) => console.error("Client delivery WhatsApp dispatch failed:", err.message));
      }
    }

    res.json({
      success: true,
      deliveryUrl: project.deliveryUrl || "",
      repositoryUrl: project.repositoryUrl || "",
      livePreviewUrl: project.livePreviewUrl || "",
      zipDownloadUrl: project.zipDownloadUrl || "",
      testSummary: project.testSummary || "",
      message: "Payment verified successfully! Your project deliverables are now unlocked.",
    });
  }
);

/* ═════════════════════════════════════════════════════════════
   ADMIN PROTECTED ROUTES
═════════════════════════════════════════════════════════════ */

router.use(auth, requireAdmin);

router.get("/overview", async (_req, res) => {
  const [config, leads, projects, activities] = await Promise.all([
    getClientAgentConfig(),
    ClientLead.find().sort({ createdAt: -1 }).limit(40),
    ClientProject.find().populate("leadId").sort({ createdAt: -1 }).limit(30),
    ClientAgentActivity.find().sort({ createdAt: -1 }).limit(30),
  ]);

  res.json({
    config,
    leads,
    projects,
    activities,
    enquiryPath: `/project-enquiry/${config.enquirySlug || "project-enquiry"}`,
  });
});

router.put("/config", async (req, res) => {
  const config = await getClientAgentConfig();
  for (const key of allowedConfig) if (req.body[key] !== undefined) config[key] = req.body[key];
  config.minimumBudget = Math.max(0, Number(config.minimumBudget) || 0);
  config.enquirySlug = String(config.enquirySlug || "project-enquiry")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .slice(0, 60);

  await config.save();
  await logClientActivity("config_updated", "Client Agent configuration updated.");
  res.json(config);
});

router.post("/start", async (_req, res) => {
  const config = await getClientAgentConfig();
  config.running = true;
  config.lastStartedAt = new Date();
  await config.save();

  try {
    await fetchAuthorisedLeads();
  } catch (error) {
    await logClientActivity("lead_source_error", error.message);
  }

  await logClientActivity("agent_started", "Client Agent started. Monitoring authorised channels.");
  res.json(config);
});

router.post("/stop", async (_req, res) => {
  const config = await getClientAgentConfig();
  config.running = false;
  config.lastStoppedAt = new Date();
  await config.save();
  await logClientActivity("agent_stopped", "Client Agent stopped.");
  res.json(config);
});

router.post("/leads/import", async (req, res) => {
  const config = await getClientAgentConfig();
  const lead = new ClientLead({ ...req.body, source: "admin" });
  const analysis = await analyseLead(lead, config);
  lead.fitScore = analysis.score;
  lead.analysis = analysis.analysis;
  await lead.save();
  await logClientActivity("lead_added", "Admin added a client lead.", { leadId: String(lead._id) });
  res.status(201).json(lead);
});

router.patch("/leads/:id", async (req, res) => {
  const lead = await ClientLead.findByIdAndUpdate(
    req.params.id,
    { $set: { status: req.body.status, adminNote: String(req.body.adminNote || "").slice(0, 3000) } },
    { new: true }
  );
  if (!lead) return res.sendStatus(404);
  res.json(lead);
});

// AI Proposal & Codex Task Generator
router.post("/leads/:id/ai-proposal", async (req, res) => {
  try {
    const lead = await ClientLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const config = await getClientAgentConfig();
    const proposal = await generateAiProposalAndCodexTask(lead, config);

    res.json(proposal);
  } catch (error) {
    console.error("AI proposal error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create & Submit Detailed Project Proposal
router.post("/leads/:id/propose", async (req, res) => {
  const lead = await ClientLead.findById(req.params.id);
  if (!lead) return res.sendStatus(404);

  const amount = Number(req.body.proposedAmount);
  if (!amount || !req.body.title || !req.body.scope) {
    return res.status(400).json({ error: "Title, scope, and proposed amount are required." });
  }

  const code = `PRJ-${Date.now().toString(36).toUpperCase()}`;
  const project = await ClientProject.create({
    leadId: lead._id,
    projectCode: code,
    title: req.body.title,
    scope: req.body.scope,
    proposedAmount: amount,
    deadline: req.body.deadline || lead.deadline,
    developmentBrief:
      req.body.developmentBrief ||
      `Client: ${lead.businessName}\nRequirements: ${lead.requirement}\nApproved Scope:\n${req.body.scope}`,
    codexTask:
      req.body.codexTask ||
      `Build the approved project exactly to this brief. Include tests, a README, setup steps, and a verification report.\n\n${req.body.scope}`,
  });

  lead.status = "reviewing";
  await lead.save();

  await logClientActivity("project_pending_approval", "Project proposal awaits admin approval.", {
    projectCode: code,
    title: project.title,
    amount,
  });

  res.status(201).json(project);
});

// Autonomous AI Coding Worker - Build Full Project Codebase
router.post("/projects/:id/ai-build", async (req, res) => {
  try {
    const project = await ClientProject.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const config = await getClientAgentConfig();
    const origin = getFrontendBaseUrl(req);
    const updated = await buildProjectCodebaseWithAi(project, config, origin);

    res.json(updated);
  } catch (error) {
    console.error("AI Project build error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.patch("/projects/:id/approve", async (req, res) => {
  const project = await ClientProject.findById(req.params.id);
  if (!project) return res.sendStatus(404);

  if (!["approved", "declined"].includes(req.body.decision)) {
    return res.status(400).json({ error: "Decision must be approved or declined." });
  }

  project.status = req.body.decision === "approved" ? "in_progress" : "declined";
  project.adminNote = String(req.body.adminNote || "").slice(0, 3000);
  await project.save();

  await logClientActivity("project_reviewed", `Project ${req.body.decision} by admin.`, {
    projectCode: project.projectCode,
  });

  res.json(project);
});

router.patch("/projects/:id/delivery", async (req, res) => {
  const project = await ClientProject.findById(req.params.id);
  if (!project) return res.sendStatus(404);

  if (project.status !== "in_progress") {
    return res.status(409).json({ error: "Only an in-progress project can be submitted for delivery review." });
  }

  Object.assign(project, {
    repositoryUrl: String(req.body.repositoryUrl || ""),
    deliveryUrl: String(req.body.deliveryUrl || ""),
    testSummary: String(req.body.testSummary || ""),
    status: "awaiting_delivery_review",
  });

  await project.save();
  await logClientActivity("delivery_review_requested", "Project delivery submitted for admin review.", {
    projectCode: project.projectCode,
  });

  res.json(project);
});

router.patch("/projects/:id/delivery-review", async (req, res) => {
  const project = await ClientProject.findById(req.params.id);
  if (!project) return res.sendStatus(404);

  if (!["approved", "changes_requested"].includes(req.body.decision)) {
    return res.status(400).json({ error: "Invalid decision." });
  }

  project.status = req.body.decision === "approved" ? "delivery_approved" : "in_progress";
  project.adminNote = String(req.body.adminNote || "").slice(0, 3000);
  await project.save();

  await logClientActivity("delivery_reviewed", `Delivery ${req.body.decision} by admin.`, {
    projectCode: project.projectCode,
  });

  res.json(project);
});

// Request Payment and Auto-Dispatch to Client (Email + WhatsApp)
router.post("/projects/:id/request-payment", async (req, res) => {
  const project = await ClientProject.findById(req.params.id).populate("leadId");
  if (!project) return res.sendStatus(404);

  if (project.status !== "delivery_approved") {
    return res.status(409).json({ error: "Admin must approve the delivery before payment can be requested." });
  }

  const origin = getFrontendBaseUrl(req);
  project.status = "payment_requested";
  project.paymentLink = `${origin}/project-payment/${project.projectCode}`;
  await project.save();

  const lead = project.leadId;
  let emailDispatched = false;
  let whatsAppDispatched = false;

  if (lead) {
    if (lead.email) {
      const emailRes = await sendClientPaymentEmail({
        clientName: lead.contactName || lead.businessName,
        clientEmail: lead.email,
        projectTitle: project.title,
        projectCode: project.projectCode,
        amount: project.proposedAmount,
        paymentLink: project.paymentLink,
      });
      emailDispatched = emailRes.success;
    }

    if (lead.phone) {
      const waRes = await sendClientPaymentWhatsApp({
        clientName: lead.contactName || lead.businessName,
        clientPhone: lead.phone,
        projectTitle: project.title,
        projectCode: project.projectCode,
        amount: project.proposedAmount,
        paymentLink: project.paymentLink,
      });
      whatsAppDispatched = waRes.success;
    }
  }

  await logClientActivity(
    "payment_requested",
    `Payment requested. Dispatched to client (Email: ${emailDispatched}, WhatsApp: ${whatsAppDispatched}).`,
    {
      projectCode: project.projectCode,
      amount: project.proposedAmount,
      paymentLink: project.paymentLink,
      emailDispatched,
      whatsAppDispatched,
    }
  );

  res.json({
    ...project.toObject(),
    emailDispatched,
    whatsAppDispatched,
    message: "Payment link generated and dispatched to client.",
  });
});

// Manual Resend Payment Notification
router.post("/projects/:id/notify-payment", async (req, res) => {
  const project = await ClientProject.findById(req.params.id).populate("leadId");
  if (!project) return res.sendStatus(404);

  if (!project.paymentLink) {
    const origin = getFrontendBaseUrl(req);
    project.paymentLink = `${origin}/project-payment/${project.projectCode}`;
    await project.save();
  }

  const lead = project.leadId;
  let emailDispatched = false;
  let whatsAppDispatched = false;

  if (lead) {
    if (lead.email) {
      const emailRes = await sendClientPaymentEmail({
        clientName: lead.contactName || lead.businessName,
        clientEmail: lead.email,
        projectTitle: project.title,
        projectCode: project.projectCode,
        amount: project.proposedAmount,
        paymentLink: project.paymentLink,
      });
      emailDispatched = emailRes.success;
    }

    if (lead.phone) {
      const waRes = await sendClientPaymentWhatsApp({
        clientName: lead.contactName || lead.businessName,
        clientPhone: lead.phone,
        projectTitle: project.title,
        projectCode: project.projectCode,
        amount: project.proposedAmount,
        paymentLink: project.paymentLink,
      });
      whatsAppDispatched = waRes.success;
    }
  }

  res.json({
    success: true,
    emailDispatched,
    whatsAppDispatched,
    message: `Payment link re-sent (Email: ${emailDispatched ? "Yes" : "No"}, WhatsApp: ${whatsAppDispatched ? "Yes" : "No"}).`,
  });
});

// Delete a Project Permanently
router.delete("/projects/:id", async (req, res) => {
  try {
    const project = await ClientProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    await logClientActivity("project_deleted", `Deleted project: ${project.title} (${project.projectCode})`);
    res.json({ success: true, message: "Project deleted permanently." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Lead Permanently
router.delete("/leads/:id", async (req, res) => {
  try {
    const lead = await ClientLead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    await logClientActivity("lead_deleted", `Deleted lead: ${lead.businessName}`);
    res.json({ success: true, message: "Lead deleted permanently." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { publicRouter as clientAgentPublicRouter };
export default router;
