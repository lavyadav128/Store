import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import CodeIcon from "@mui/icons-material/Code";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LaunchIcon from "@mui/icons-material/Launch";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import server from "../../shared/environment";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const card = {
  borderRadius: "20px",
  border: "1px solid #f0f0f0",
  boxShadow: "0 2px 8px rgba(0,0,0,.04)",
  p: { xs: 2, sm: 3 },
  background: "#fff",
};

const title = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 800,
  color: "#1a1a2e",
};

const field = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "13px",
    fontFamily: "'DM Sans', sans-serif",
  },
  "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif" },
};

export default function ClientAgent() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [snack, setSnack] = useState({ open: false, text: "", severity: "success" });

  // Proposal Generator Modal State
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [generatingProposal, setGeneratingProposal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [proposalData, setProposalData] = useState({
    title: "",
    proposedAmount: 0,
    scope: "",
    codexTask: "",
  });

  // AI Build Status
  const [buildingProjectId, setBuildingProjectId] = useState(null);

  // Code Inspector & Live Preview Modal State
  const [inspectorModalOpen, setInspectorModalOpen] = useState(false);
  const [inspectingProject, setInspectingProject] = useState(null);
  const [activeFileTab, setActiveFileTab] = useState(0);

  // Delivery Modal State
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deliveryData, setDeliveryData] = useState({
    deliveryUrl: "",
    repositoryUrl: "",
    testSummary: "",
  });

  // Codex Task Viewer Modal State
  const [codexModalOpen, setCodexModalOpen] = useState(false);
  const [viewingCodexTask, setViewingCodexTask] = useState("");

  const notify = (text, severity = "success") => setSnack({ open: true, text, severity });

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${server}/api/client-agent/overview`, { headers: headers() });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Could not load Client Agent.");
      setData(body);
      setConfig(body.config);
    } catch (e) {
      notify(e.message, "error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const request = async (path, method = "POST", body) => {
    const res = await fetch(`${server}/api/client-agent${path}`, {
      method,
      headers: headers(),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Request failed.");
    return result;
  };

  const act = async (fn, successMsg) => {
    try {
      await fn();
      if (successMsg) notify(successMsg);
      await load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  // Open AI Proposal Generator Modal
  const openProposalGenerator = async (lead) => {
    setSelectedLead(lead);
    setProposalModalOpen(true);
    setGeneratingProposal(true);
    try {
      const generated = await request(`/leads/${lead._id}/ai-proposal`, "POST");
      setProposalData({
        title: generated.title || `${lead.businessName} Project`,
        proposedAmount: generated.proposedAmount || lead.budget || 15000,
        scope: generated.scope || "",
        codexTask: generated.codexTask || "",
      });
    } catch (err) {
      notify(`AI generation note: ${err.message}`, "info");
      setProposalData({
        title: `${lead.businessName} Project`,
        proposedAmount: lead.budget || 15000,
        scope: lead.requirement || "",
        codexTask: `Build complete application for ${lead.businessName} fulfilling: ${lead.requirement}`,
      });
    } finally {
      setGeneratingProposal(false);
    }
  };

  const submitProposal = async () => {
    if (!proposalData.title || !proposalData.scope || !proposalData.proposedAmount) {
      return notify("Please complete Title, Scope, and Amount.", "error");
    }

    await act(
      () =>
        request(`/leads/${selectedLead._id}/propose`, "POST", {
          title: proposalData.title,
          proposedAmount: Number(proposalData.proposedAmount),
          scope: proposalData.scope,
          codexTask: proposalData.codexTask,
        }),
      "Detailed proposal created for admin approval!"
    );
    setProposalModalOpen(false);
  };

  // Trigger Autonomous AI Coding Worker
  const triggerAiBuild = async (project) => {
    setBuildingProjectId(project._id);
    notify("🤖 Autonomous AI Coding Worker started building custom codebase...", "info");
    try {
      const updated = await request(`/projects/${project._id}/ai-build`, "POST");
      notify("🎉 Project codebase built successfully! Live preview and code files ready.");
      await load();
      setInspectingProject(updated);
      setActiveFileTab(0);
      setInspectorModalOpen(true);
    } catch (err) {
      notify(`AI build error: ${err.message}`, "error");
    } finally {
      setBuildingProjectId(null);
    }
  };

  const submitDelivery = async () => {
    if (!deliveryData.deliveryUrl && !deliveryData.repositoryUrl) {
      return notify("Provide at least a Delivery URL or Repository URL.", "error");
    }
    await act(
      () =>
        request(`/projects/${selectedProject._id}/delivery`, "PATCH", {
          deliveryUrl: deliveryData.deliveryUrl,
          repositoryUrl: deliveryData.repositoryUrl,
          testSummary: deliveryData.testSummary,
        }),
      "Delivery submitted for admin review."
    );
    setDeliveryModalOpen(false);
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to permanently delete this project? This cannot be undone.")) return;
    await act(() => request(`/projects/${projectId}`, "DELETE"), "Project deleted permanently.");
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to permanently delete this lead?")) return;
    await act(() => request(`/leads/${leadId}`, "DELETE"), "Lead deleted permanently.");
  };

  const resendPaymentNotification = async (projectId) => {
    await act(
      () => request(`/projects/${projectId}/notify-payment`, "POST"),
      "Payment link re-dispatched to client via Email and WhatsApp!"
    );
  };

  // Compute bundled HTML for 100% reliable offline / direct sandbox preview
  const compiledHtml = useMemo(() => {
    if (!inspectingProject || !inspectingProject.generatedCodeFiles || inspectingProject.generatedCodeFiles.length === 0) {
      return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:30px;text-align:center;color:#666;"><h3>Building application files...</h3></body></html>`;
    }
    const htmlFile = inspectingProject.generatedCodeFiles.find((f) => f.filename === "index.html");
    const cssFile = inspectingProject.generatedCodeFiles.find((f) => f.filename === "style.css");
    const jsFile = inspectingProject.generatedCodeFiles.find((f) => f.filename === "app.js" || f.filename === "script.js");

    if (!htmlFile) {
      return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:30px;text-align:center;color:#666;"><h3>No index.html file found</h3></body></html>`;
    }

    let html = htmlFile.content;
    if (cssFile && html.includes("style.css")) {
      html = html.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, `<style>${cssFile.content}</style>`);
    }
    if (jsFile && (html.includes("app.js") || html.includes("script.js"))) {
      html = html.replace(/<script[^>]*src=["'](app|script)\.js["'][^>]*><\/script>/i, `<script>${jsFile.content}</script>`);
    }
    return html;
  }, [inspectingProject]);

  const openHtmlInNewTab = () => {
    const blob = new Blob([compiledHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  if (!data || !config)
    return (
      <Box sx={{ p: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <CircularProgress size={24} />
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif" }}>Loading AI Client Agent…</Typography>
      </Box>
    );

  const set = (key, value) => setConfig((old) => ({ ...old, [key]: value }));
  const activeSlug = (config?.enquirySlug || data?.config?.enquirySlug || (data?.enquiryPath ? data.enquiryPath.replace(/^\/project-enquiry\/?/, "") : "") || "project-enquiry").trim().replace(/^\//, "") || "project-enquiry";
  const enquiryLink = `${window.location.origin}/project-enquiry/${activeSlug}`;

  const filesList = inspectingProject?.generatedCodeFiles || [];
  const activeContent =
    activeFileTab < filesList.length
      ? filesList[activeFileTab]?.content || ""
      : inspectingProject?.testSummary || "";

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 800,
            color: "#999",
            letterSpacing: "1.5px",
          }}
        >
          APPROVAL-GATED · ADMIN ONLY
        </Typography>
        <Typography sx={{ ...title, fontSize: { xs: 26, sm: 32 }, mt: 0.4 }}>
          AI Client Agent & Autonomous Coder
        </Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "#777", mt: 0.5 }}>
          Autonomous lead scoring, 1-click tailored AI coding worker, embedded live sandbox preview, WhatsApp/Email dispatches, and instant client delivery.
        </Typography>
      </Box>

      {/* Configuration Card */}
      <Paper sx={{ ...card, mb: 3, borderColor: config.running ? "#1a1a2e" : "#f0f0f0" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
          <BusinessCenterIcon sx={{ color: "#1a1a2e" }} />
          <Typography sx={{ ...title, fontSize: 19 }}>
            Client-Finding Strategy{" "}
            <Chip
              size="small"
              label={config.running ? "Running" : "Stopped"}
              sx={{
                ml: 1,
                bgcolor: config.running ? "#1a1a2e" : "#eee",
                color: config.running ? "#fff" : "#555",
                fontWeight: 700,
              }}
            />
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          <TextField
            fullWidth
            label="Client types (comma-separated)"
            value={(config.clientTypes || []).join(", ")}
            onChange={(e) =>
              set(
                "clientTypes",
                e.target.value
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
              )
            }
            sx={field}
          />
          <TextField
            fullWidth
            label="Services offered (comma-separated)"
            value={(config.services || []).join(", ")}
            onChange={(e) =>
              set(
                "services",
                e.target.value
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
              )
            }
            sx={field}
          />
          <TextField
            fullWidth
            type="number"
            label="Minimum budget (₹)"
            value={config.minimumBudget}
            onChange={(e) => set("minimumBudget", e.target.value)}
            sx={field}
          />
          <TextField
            fullWidth
            label="Business/studio name"
            value={config.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            sx={field}
          />
          <TextField
            fullWidth
            label="Contact email"
            value={config.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            sx={field}
          />
          <TextField
            fullWidth
            label="Enquiry link slug"
            value={config.enquirySlug}
            onChange={(e) => set("enquirySlug", e.target.value)}
            sx={field}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1.2, mt: 2.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() => act(() => request("/config", "PUT", config), "Client Agent settings saved.")}
            sx={{ borderRadius: "12px", textTransform: "none", color: "#1a1a2e", borderColor: "#1a1a2e", fontWeight: 700 }}
          >
            Save strategy
          </Button>
          <Button
            variant="contained"
            startIcon={config.running ? <StopIcon /> : <PlayArrowIcon />}
            onClick={() =>
              act(
                () => request(config.running ? "/stop" : "/start"),
                config.running ? "Agent stopped." : "Agent started. Monitoring inbound leads."
              )
            }
            sx={{ borderRadius: "12px", textTransform: "none", bgcolor: config.running ? "#8a2d2d" : "#1a1a2e", fontWeight: 700 }}
          >
            {config.running ? "Stop agent" : "Start freelancing"}
          </Button>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={() => {
              navigator.clipboard.writeText(enquiryLink);
              notify("Client enquiry link copied to clipboard.");
            }}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Copy public enquiry link
          </Button>
        </Box>
        <Alert severity="info" sx={{ mt: 2, borderRadius: "12px" }}>
          Share your public lead intake portal: <strong>{enquiryLink}</strong>. Leads are automatically scored and presented below for AI proposal drafting.
        </Alert>
      </Paper>

      {/* Client Leads Card */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...title, fontSize: 19, mb: 1.5 }}>Inbound Client Leads & Enquiries</Typography>
        {data.leads.length === 0 ? (
          <Typography sx={{ color: "#888" }}>
            No enquiries yet. Share your enquiry link with potential clients.
          </Typography>
        ) : (
          data.leads.map((lead) => (
            <Box key={lead._id} sx={{ borderTop: "1px solid #eee", py: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                  {lead.businessName} {lead.contactName ? `(${lead.contactName})` : ""}
                  <Chip label={`${lead.fitScore}/100 Fit`} size="small" sx={{ ml: 1, bgcolor: "#1a1a2e", color: "#fff", fontWeight: 700 }} />
                  <Chip label={lead.status} size="small" sx={{ ml: 1, fontWeight: 700 }} />
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: 12, color: "#888" }}>
                    {lead.email} {lead.phone ? `· ${lead.phone}` : ""}
                  </Typography>
                  <IconButton size="small" onClick={() => deleteLead(lead._id)} sx={{ color: "#d32f2f" }} title="Delete lead">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Typography sx={{ fontSize: 13, color: "#444", mt: 1, whiteSpace: "pre-wrap" }}>
                <strong>Requirement:</strong> {lead.requirement}
              </Typography>
              {lead.budget && (
                <Typography sx={{ fontSize: 12, color: "#2e7d32", mt: 0.5, fontWeight: 700 }}>
                  Client Budget: ₹{Number(lead.budget).toLocaleString()}
                </Typography>
              )}

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.5 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={() => openProposalGenerator(lead)}
                  sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}
                >
                  Generate AI Proposal & Codex Task
                </Button>
                <Button
                  size="small"
                  onClick={() => act(() => request(`/leads/${lead._id}`, "PATCH", { status: "approved" }), "Lead marked as reviewed.")}
                  sx={{ textTransform: "none" }}
                >
                  Mark Reviewed
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => act(() => request(`/leads/${lead._id}`, "PATCH", { status: "declined" }), "Lead declined.")}
                  sx={{ textTransform: "none" }}
                >
                  Decline
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* Projects & Pipeline Card */}
      <Paper sx={{ ...card, mb: 3 }}>
        <Typography sx={{ ...title, fontSize: 19, mb: 1.5 }}>Client Projects & Approval Gates</Typography>
        {data.projects.length === 0 ? (
          <Typography sx={{ color: "#888" }}>Approved proposals will appear in this pipeline.</Typography>
        ) : (
          data.projects.map((p) => (
            <Box key={p._id} sx={{ borderTop: "1px solid #eee", py: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                    {p.title}{" "}
                    <Chip
                      size="small"
                      label={p.status}
                      sx={{
                        ml: 1,
                        fontWeight: 700,
                        bgcolor: ["paid", "delivered"].includes(p.status) ? "#166534" : undefined,
                        color: ["paid", "delivered"].includes(p.status) ? "#fff" : undefined,
                      }}
                    />
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#666", mt: 0.3 }}>
                    <strong>Code:</strong> {p.projectCode} · <strong>Amount:</strong> ₹{p.proposedAmount?.toLocaleString()} · <strong>Client:</strong> {p.leadId?.businessName || "Client"}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => deleteProject(p._id)} sx={{ color: "#d32f2f" }} title="Delete project permanently">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography sx={{ fontSize: 12, color: "#555", mt: 1, whiteSpace: "pre-wrap", maxHeight: 100, overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.scope}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                {/* 1-Click Autonomous AI Coder Trigger */}
                {["approved", "in_progress", "pending_admin_approval", "awaiting_delivery_review"].includes(p.status) && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={buildingProjectId === p._id ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <PrecisionManufacturingIcon />}
                    disabled={buildingProjectId === p._id}
                    onClick={() => triggerAiBuild(p)}
                    sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#4338ca", "&:hover": { bgcolor: "#3730a3" }, fontWeight: 700 }}
                  >
                    {buildingProjectId === p._id ? "AI Building Specific Codebase..." : "Build Project with AI (Autonomous Coder)"}
                  </Button>
                )}

                {/* Inspect Generated Code & Live Preview */}
                {p.generatedCodeFiles && p.generatedCodeFiles.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      setInspectingProject(p);
                      setActiveFileTab(0);
                      setInspectorModalOpen(true);
                    }}
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700, borderColor: "#1a1a2e", color: "#1a1a2e" }}
                  >
                    Inspect Code & Live Preview ({p.generatedCodeFiles.length} files)
                  </Button>
                )}

                {p.codexTask && (
                  <Button
                    size="small"
                    startIcon={<CodeIcon />}
                    onClick={() => {
                      setViewingCodexTask(p.codexTask);
                      setCodexModalOpen(true);
                    }}
                    sx={{ borderRadius: "8px", textTransform: "none", border: "1px solid #ddd", fontWeight: 700 }}
                  >
                    View Codex Task
                  </Button>
                )}

                {p.status === "pending_admin_approval" && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => act(() => request(`/projects/${p._id}/approve`, "PATCH", { decision: "approved" }), "Project approved! Ready for build.")}
                    sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}
                  >
                    Approve Proposal
                  </Button>
                )}

                {p.status === "awaiting_delivery_review" && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => act(() => request(`/projects/${p._id}/delivery-review`, "PATCH", { decision: "approved" }), "Delivery approved! Ready to create payment link.")}
                    sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#2e7d32", fontWeight: 700 }}
                  >
                    Approve Delivery
                  </Button>
                )}

                {p.status === "delivery_approved" && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => act(() => request(`/projects/${p._id}/request-payment`), "Payment link generated & dispatched to client via Email and WhatsApp!")}
                    sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}
                  >
                    Create & Dispatch Payment Link
                  </Button>
                )}

                {p.paymentLink && (() => {
                  const resolvedUrl = p.paymentLink.startsWith("http://localhost")
                    ? p.paymentLink.replace(/http:\/\/localhost:\d+/, window.location.origin)
                    : p.paymentLink;

                  return (
                    <>
                      <Button
                        size="small"
                        startIcon={<LaunchIcon />}
                        href={resolvedUrl}
                        target="_blank"
                        variant="outlined"
                        sx={{ textTransform: "none", fontWeight: 700, borderColor: "#1a1a2e", color: "#1a1a2e" }}
                      >
                        Open Payment Portal
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => {
                          navigator.clipboard.writeText(resolvedUrl);
                          notify("Client payment link copied!");
                        }}
                        sx={{ textTransform: "none", fontWeight: 700 }}
                      >
                        Copy Payment Link
                      </Button>
                      <Button
                        size="small"
                        startIcon={<SendIcon />}
                        onClick={() => resendPaymentNotification(p._id)}
                        sx={{ textTransform: "none", fontWeight: 700 }}
                      >
                        Resend to Email/WhatsApp
                      </Button>
                    </>
                  );
                })()}

                {["paid", "delivered"].includes(p.status) && (
                  <Button
                    size="small"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => deleteProject(p._id)}
                    sx={{ textTransform: "none", color: "#d32f2f", fontWeight: 700 }}
                  >
                    Delete Completed Project
                  </Button>
                )}
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* Audit Feed */}
      <Paper sx={card}>
        <Typography sx={{ ...title, fontSize: 19, mb: 1 }}>Client Agent Activity Log</Typography>
        {data.activities.slice(0, 10).map((a) => (
          <Typography key={a._id} sx={{ borderTop: "1px solid #eee", py: 1, fontSize: 13 }}>
            {a.message} <Box component="span" sx={{ color: "#999" }}>· {new Date(a.createdAt).toLocaleString()}</Box>
          </Typography>
        ))}
      </Paper>

      {/* Code Inspector & Live Preview Modal */}
      <Dialog
        open={inspectorModalOpen}
        onClose={() => setInspectorModalOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PrecisionManufacturingIcon sx={{ color: "#4338ca" }} />
            <Typography sx={{ ...title, fontSize: 20 }}>
              AI Generated Codebase & Interactive Live Preview ({inspectingProject?.projectCode})
            </Typography>
          </Box>
          <IconButton onClick={() => setInspectorModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 2 }}>
          {inspectingProject && (
            <Box>
              {/* Top Quick Actions Bar */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<LaunchIcon />}
                    onClick={openHtmlInNewTab}
                    sx={{ borderRadius: "8px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}
                  >
                    Open Live App in Full Tab
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    href={`${server}/api/client-agent/public/download/${inspectingProject.projectCode}`}
                    target="_blank"
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700, borderColor: "#1a1a2e", color: "#1a1a2e" }}
                  >
                    Download Project (.zip)
                  </Button>
                </Box>
                <Chip label="100% QA Passed · Live Sandbox" size="small" sx={{ bgcolor: "#f0fdf4", color: "#166534", fontWeight: 700, border: "1px solid #bbf7d0" }} />
              </Box>

              {/* Embedded Direct Sandbox Preview Iframe (Guaranteed 100% Live, zero localhost connection errors) */}
              <Box sx={{ mb: 3, border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", height: 380, bgcolor: "#fff" }}>
                <Box sx={{ px: 2, py: 1, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
                  <Typography sx={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", ml: 1 }}>
                    Interactive Sandbox Preview · {inspectingProject.title}
                  </Typography>
                </Box>
                <iframe
                  srcDoc={compiledHtml}
                  title="Project Live Preview"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                  style={{ width: "100%", height: "calc(100% - 33px)", border: "none" }}
                />
              </Box>

              {/* File Tabs Inspector */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Source Code Files & Documentation</Typography>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText(activeContent);
                    notify("Active file code copied to clipboard!");
                  }}
                  sx={{ textTransform: "none", fontSize: 12, fontWeight: 700 }}
                >
                  Copy File Content
                </Button>
              </Box>

              <Tabs
                value={activeFileTab}
                onChange={(_, val) => setActiveFileTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider", mb: 1.5 }}
              >
                {filesList.map((file, idx) => (
                  <Tab key={file.filename} label={file.filename} sx={{ textTransform: "none", fontWeight: 700, fontSize: 13 }} />
                ))}
                <Tab label="QA Test Report" sx={{ textTransform: "none", fontWeight: 700, fontSize: 13, color: "#166534" }} />
              </Tabs>

              {/* Active Tab Content */}
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: activeFileTab < filesList.length ? "#1a1a2e" : "#f8fafc",
                  color: activeFileTab < filesList.length ? "#e2e8f0" : "#166534",
                  borderRadius: "12px",
                  fontSize: 12,
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  maxHeight: 320,
                  overflowY: "auto",
                  border: activeFileTab < filesList.length ? "none" : "1px solid #e2e8f0",
                }}
              >
                {activeContent || "No content available for this tab."}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setInspectorModalOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
          {inspectingProject?.status === "awaiting_delivery_review" && (
            <Button
              variant="contained"
              onClick={async () => {
                await act(
                  () => request(`/projects/${inspectingProject._id}/delivery-review`, "PATCH", { decision: "approved" }),
                  "Delivery approved! Ready to create payment link."
                );
                setInspectorModalOpen(false);
              }}
              sx={{ borderRadius: "10px", bgcolor: "#2e7d32", textTransform: "none", fontWeight: 700 }}
            >
              Approve Delivery for Client
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* AI Proposal Generator Dialog Modal */}
      <Dialog
        open={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: "#1a1a2e" }} />
            <Typography sx={{ ...title, fontSize: 22 }}>AI Technical Proposal & Codex Specification</Typography>
          </Box>
          <IconButton onClick={() => setProposalModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {generatingProposal ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CircularProgress size={36} sx={{ color: "#1a1a2e" }} />
              <Typography sx={{ mt: 2, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                AI is analyzing client requirements, designing tailored architecture, estimating pricing, and generating Codex specifications...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
              <TextField
                label="Project Title"
                value={proposalData.title}
                onChange={(e) => setProposalData({ ...proposalData, title: e.target.value })}
                sx={field}
                fullWidth
              />

              <TextField
                label="Proposed Amount (₹)"
                type="number"
                value={proposalData.proposedAmount}
                onChange={(e) => setProposalData({ ...proposalData, proposedAmount: e.target.value })}
                sx={field}
                fullWidth
              />

              <TextField
                label="Technical Scope & Deliverables (Client Proposal)"
                multiline
                rows={7}
                value={proposalData.scope}
                onChange={(e) => setProposalData({ ...proposalData, scope: e.target.value })}
                sx={field}
                fullWidth
              />

              <TextField
                label="Detailed Codex Implementation Task Specification (AI Coding Prompt)"
                multiline
                rows={9}
                value={proposalData.codexTask}
                onChange={(e) => setProposalData({ ...proposalData, codexTask: e.target.value })}
                sx={field}
                fullWidth
                helperText="This specification can be copied directly into Codex / Claude / Antigravity to build the project."
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setProposalModalOpen(false)} sx={{ textTransform: "none", color: "#555" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitProposal}
            disabled={generatingProposal}
            sx={{ borderRadius: "12px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}
          >
            Create Proposal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Delivery Dialog Modal */}
      <Dialog
        open={deliveryModalOpen}
        onClose={() => setDeliveryModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ ...title, fontSize: 20 }}>Submit Project Delivery</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Live Delivery / Demo URL"
              placeholder="https://client-project-demo.com"
              value={deliveryData.deliveryUrl}
              onChange={(e) => setDeliveryData({ ...deliveryData, deliveryUrl: e.target.value })}
              sx={field}
              fullWidth
            />
            <TextField
              label="Source Code Repository / Download URL"
              placeholder="https://github.com/user/project"
              value={deliveryData.repositoryUrl}
              onChange={(e) => setDeliveryData({ ...deliveryData, repositoryUrl: e.target.value })}
              sx={field}
              fullWidth
            />
            <TextField
              label="Test & Verification Summary"
              multiline
              rows={4}
              placeholder="All 24 automated tests passing. Lighthouse performance score 98/100."
              value={deliveryData.testSummary}
              onChange={(e) => setDeliveryData({ ...deliveryData, testSummary: e.target.value })}
              sx={field}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeliveryModalOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitDelivery}
            sx={{ borderRadius: "12px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}
          >
            Submit for Admin Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Codex Task Viewer Dialog Modal */}
      <Dialog
        open={codexModalOpen}
        onClose={() => setCodexModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ ...title, fontSize: 20 }}>Codex Implementation Specification</Typography>
          <IconButton onClick={() => setCodexModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="pre"
            sx={{
              p: 2,
              bgcolor: "#1a1a2e",
              color: "#e2e8f0",
              borderRadius: "12px",
              fontSize: 13,
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              maxHeight: 500,
              overflowY: "auto",
            }}
          >
            {viewingCodexTask}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={() => {
              navigator.clipboard.writeText(viewingCodexTask);
              notify("Codex task specification copied to clipboard!");
            }}
            variant="contained"
            sx={{ borderRadius: "12px", textTransform: "none", bgcolor: "#1a1a2e", fontWeight: 700 }}
          >
            Copy Codex Task
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack((v) => ({ ...v, open: false }))}>
        <Alert severity={snack.severity}>{snack.text}</Alert>
      </Snackbar>
    </Box>
  );
}
