import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Typography, Button, TextField, MenuItem, Select, InputLabel,
  FormControl, IconButton, Dialog, DialogTitle, DialogContent, Fade,
  CircularProgress, Chip, Tabs, Tab, useMediaQuery, useTheme, Tooltip,
  Pagination, Snackbar, Alert,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import server from "../environment";

const JOB_CATEGORIES = [
  "Software Development", "Data Science", "Product", "Design",
  "Marketing", "Sales", "Finance", "HR", "Operations", "Other",
];

const CompanyJobHub = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = useState(0); // 0 = Jobs, 1 = Company Intel

  // ── Jobs state ──
  const [jobs, setJobs] = useState([]);
  const [jobCategory, setJobCategory] = useState("all");
  const [jobSearch, setJobSearch] = useState("");
  const [jobPage, setJobPage] = useState(1);
  const [jobTotalPages, setJobTotalPages] = useState(1);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ── Companies state ──
  const [companies, setCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "", website: "", industry: "", location: "", contactEmail: "",
    socialLinks: { linkedin: "", twitter: "", instagram: "", facebook: "" },
  });

  // ── Insight modal ──
  const [insightOpen, setInsightOpen] = useState(false);
  const [insightCompany, setInsightCompany] = useState(null);
  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // ── Fetch jobs ──
  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const res = await axios.get(`${server}/api/jobs`, {
        params: {
          category: jobCategory !== "all" ? jobCategory : undefined,
          search: jobSearch || undefined,
          page: jobPage,
          limit: 12,
        },
      });
      setJobs(res.data.jobs);
      setJobTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setJobsLoading(false);
    }
  }, [jobCategory, jobSearch, jobPage]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleRefreshJobs = async () => {
    setRefreshing(true);
    try {
      const res = await axios.post(`${server}/api/jobs/refresh`, { keyword: jobSearch }, authHeader());
      setSnackbar({ open: true, msg: `Fetched ${res.data.fetched}, added ${res.data.newJobs} new jobs`, severity: "success" });
      fetchJobs();
    } catch {
      setSnackbar({ open: true, msg: "Refresh failed (admin only)", severity: "error" });
    } finally {
      setRefreshing(false);
    }
  };

  // ── Fetch companies ──
  const fetchCompanies = useCallback(async () => {
    setCompaniesLoading(true);
    try {
      const res = await axios.get(`${server}/api/companies`, {
        params: { search: companySearch || undefined, limit: 30 },
      });
      setCompanies(res.data.companies);
    } catch (err) {
      console.error(err);
    } finally {
      setCompaniesLoading(false);
    }
  }, [companySearch]);

  useEffect(() => { if (tab === 1) fetchCompanies(); }, [tab, fetchCompanies]);

  const handleAddCompany = async () => {
    if (!newCompany.name) return setSnackbar({ open: true, msg: "Company name required", severity: "error" });
    try {
      await axios.post(`${server}/api/companies`, newCompany, authHeader());
      setAddOpen(false);
      setNewCompany({
        name: "", website: "", industry: "", location: "", contactEmail: "",
        socialLinks: { linkedin: "", twitter: "", instagram: "", facebook: "" },
      });
      fetchCompanies();
      setSnackbar({ open: true, msg: "Company added", severity: "success" });
    } catch {
      setSnackbar({ open: true, msg: "Failed to add company (admin only)", severity: "error" });
    }
  };

  // ── AI Insight ──
  const openInsight = async (company) => {
    setInsightCompany(company);
    setInsightOpen(true);
    setInsight(null);
    setInsightLoading(true);
    try {
      const res = await axios.get(`${server}/api/companies/${company._id}/insight`);
      setInsight(res.data);
    } catch {
      setInsight(null); // none yet, user can generate
    } finally {
      setInsightLoading(false);
    }
  };

  const generateInsight = async () => {
    if (!insightCompany) return;
    setInsightLoading(true);
    try {
      const res = await axios.post(`${server}/api/companies/${insightCompany._id}/analyze`, {}, authHeader());
      setInsight(res.data);
      setSnackbar({ open: true, msg: "AI analysis generated", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, msg: err.response?.data?.error || "Analysis failed", severity: "error" });
    } finally {
      setInsightLoading(false);
    }
  };

  const copyEmail = () => {
    if (!insight?.generatedEmail) return;
    navigator.clipboard.writeText(insight.generatedEmail);
    setSnackbar({ open: true, msg: "Email copied to clipboard", severity: "success" });
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');`}</style>

      <Fade in timeout={500}>
        <Box>
          {/* ── Header ── */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography sx={{
              fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 800,
              color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5,
            }}>
              Career Hub
            </Typography>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: { xs: 22, sm: 30 }, color: "#1a1a2e", letterSpacing: "-1px",
            }}>
              Jobs &amp; Company Intel
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#aaa", mt: 0.5 }}>
              Off-campus openings, required skills, and AI-drafted outreach for companies you want to work with
            </Typography>
          </Box>

          {/* ── Tabs ── */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 3,
              minHeight: "auto",
              "& .MuiTabs-indicator": { background: "#1a1a2e", height: 3, borderRadius: "3px" },
              "& .MuiTab-root": {
                fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 13,
                textTransform: "none", minHeight: "auto", py: 1.5, color: "#aaa",
                "&.Mui-selected": { color: "#1a1a2e" },
              },
            }}
          >
            <Tab icon={<WorkOutlineIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Off-Campus Jobs" />
            <Tab icon={<BusinessIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Company Intel" />
          </Tabs>

          {/* ════════════════════ TAB 0: JOBS ════════════════════ */}
          {tab === 0 && (
            <Box>
              {/* Filters */}
              <Box sx={{
                display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap",
                alignItems: { sm: "center" },
              }}>
                <TextField
                  size="small"
                  placeholder="Search role or company..."
                  value={jobSearch}
                  onChange={(e) => { setJobSearch(e.target.value); setJobPage(1); }}
                  InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 18, color: "#ccc", mr: 1 }} /> }}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 280px" },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px", fontFamily: "'DM Sans'", fontSize: 13,
                      "& fieldset": { borderColor: "#e8e8e8" },
                    },
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 180, flex: { xs: "1 1 100%", sm: "0 0 auto" } }}>
                  <Select
                    value={jobCategory}
                    onChange={(e) => { setJobCategory(e.target.value); setJobPage(1); }}
                    sx={{
                      borderRadius: "12px", fontFamily: "'DM Sans'", fontSize: 13,
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8e8e8" },
                    }}
                  >
                    <MenuItem value="all" sx={{ fontFamily: "'DM Sans'", fontSize: 13 }}>All Categories</MenuItem>
                    {JOB_CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c} sx={{ fontFamily: "'DM Sans'", fontSize: 13 }}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Tooltip title="Pull latest listings (admin)">
                  <Button
                    onClick={handleRefreshJobs}
                    disabled={refreshing}
                    startIcon={refreshing ? <CircularProgress size={14} /> : <RefreshIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: "12px", fontFamily: "'DM Sans'", fontWeight: 700,
                      fontSize: 12, textTransform: "none", color: "#1a1a2e",
                      background: "#f4f4f6", px: 2,
                      "&:hover": { background: "#e8e8e8" },
                    }}
                  >
                    Refresh
                  </Button>
                </Tooltip>
              </Box>

              {/* Jobs grid */}
              {jobsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress sx={{ color: "#1a1a2e" }} />
                </Box>
              ) : jobs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <WorkOutlineIcon sx={{ fontSize: 48, color: "#e0e0e0", mb: 1 }} />
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#ccc" }}>
                    No openings match these filters yet
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fill, minmax(300px, 1fr))" },
                    gap: { xs: 1.5, sm: 2 },
                  }}>
                    {jobs.map((j) => (
                      <Box key={j._id} sx={{
                        background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px",
                        p: { xs: 2, sm: 2.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        display: "flex", flexDirection: "column", gap: 1.2,
                      }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{
                              fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14,
                              color: "#1a1a2e", lineHeight: 1.3, mb: 0.3,
                            }}>
                              {j.title}
                            </Typography>
                            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12.5, color: "#888", fontWeight: 600 }}>
                              {j.companyName}
                            </Typography>
                          </Box>
                          <Box sx={{
                            px: 1.1, py: 0.3, borderRadius: "8px", background: "#f4f4f6",
                            flexShrink: 0,
                          }}>
                            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10.5, fontWeight: 700, color: "#555" }}>
                              {j.category}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#aaa" }}>
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12 }}>{j.location}</Typography>
                        </Box>

                        {j.skills?.length > 0 && (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                            {j.skills.slice(0, 6).map((s) => (
                              <Chip key={s} label={s} size="small" sx={{
                                fontFamily: "'DM Sans'", fontSize: 10.5, fontWeight: 600,
                                height: 22, background: "#f4f4f6", color: "#555",
                              }} />
                            ))}
                            {j.skills.length > 6 && (
                              <Chip label={`+${j.skills.length - 6}`} size="small" sx={{
                                fontFamily: "'DM Sans'", fontSize: 10.5, fontWeight: 600,
                                height: 22, background: "transparent", color: "#aaa",
                              }} />
                            )}
                          </Box>
                        )}

                        <Button
                          component="a" href={j.applyLink} target="_blank" rel="noopener noreferrer"
                          endIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            mt: 0.5, alignSelf: "flex-start",
                            fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 12.5,
                            color: "#1a1a2e", textTransform: "none", p: 0,
                            "&:hover": { background: "transparent", textDecoration: "underline" },
                          }}
                        >
                          Apply Now
                        </Button>
                      </Box>
                    ))}
                  </Box>

                  {jobTotalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                      <Pagination
                        count={jobTotalPages}
                        page={jobPage}
                        onChange={(_, v) => setJobPage(v)}
                        sx={{ "& .Mui-selected": { background: "#1a1a2e !important", color: "#fff" } }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}

          {/* ════════════════════ TAB 1: COMPANY INTEL ════════════════════ */}
          {tab === 1 && (
            <Box>
              <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
                <TextField
                  size="small"
                  placeholder="Search company..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ fontSize: 18, color: "#ccc", mr: 1 }} /> }}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 280px" },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px", fontFamily: "'DM Sans'", fontSize: 13,
                      "& fieldset": { borderColor: "#e8e8e8" },
                    },
                  }}
                />
                <Button
                  startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                  onClick={() => setAddOpen(true)}
                  sx={{
                    background: "#1a1a2e", color: "#fff", borderRadius: "12px",
                    fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 12.5,
                    textTransform: "none", px: 2.5,
                    "&:hover": { background: "#2d2d4e" },
                  }}
                >
                  Add Company
                </Button>
              </Box>

              {companiesLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress sx={{ color: "#1a1a2e" }} />
                </Box>
              ) : companies.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <BusinessIcon sx={{ fontSize: 48, color: "#e0e0e0", mb: 1 }} />
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#ccc" }}>
                    No companies added yet
                  </Typography>
                </Box>
              ) : (
                <Box sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fill, minmax(300px, 1fr))" },
                  gap: { xs: 1.5, sm: 2 },
                }}>
                  {companies.map((c) => (
                    <Box key={c._id} sx={{
                      background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px",
                      p: { xs: 2, sm: 2.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      display: "flex", flexDirection: "column", gap: 1,
                    }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Typography sx={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
                          {c.name}
                        </Typography>
                        {c.industry && (
                          <Box sx={{ px: 1.1, py: 0.3, borderRadius: "8px", background: "#f4f4f6" }}>
                            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10.5, fontWeight: 700, color: "#555" }}>
                              {c.industry}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {c.location && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#aaa" }}>
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12 }}>{c.location}</Typography>
                        </Box>
                      )}

                      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                        {c.website && (
                          <Tooltip title="Website">
                            <IconButton component="a" href={c.website} target="_blank" size="small"
                              sx={{ color: "#aaa", "&:hover": { color: "#1a1a2e", background: "#f4f4f6" } }}>
                              <LanguageIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {c.contactEmail && (
                          <Tooltip title={c.contactEmail}>
                            <IconButton component="a" href={`mailto:${c.contactEmail}`} size="small"
                              sx={{ color: "#aaa", "&:hover": { color: "#1a1a2e", background: "#f4f4f6" } }}>
                              <EmailIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {c.socialLinks?.linkedin && (
                          <Tooltip title="LinkedIn">
                            <IconButton component="a" href={c.socialLinks.linkedin} target="_blank" size="small"
                              sx={{ color: "#aaa", "&:hover": { color: "#1a1a2e", background: "#f4f4f6" } }}>
                              <LinkedInIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>

                      <Button
                        startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                        onClick={() => openInsight(c)}
                        sx={{
                          mt: 1, borderRadius: "10px", fontFamily: "'DM Sans'", fontWeight: 700,
                          fontSize: 12.5, textTransform: "none", color: "#1a1a2e",
                          background: "#f4f4f6", py: 0.9,
                          "&:hover": { background: "#e8e8e8" },
                        }}
                      >
                        AI Insights &amp; Outreach
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Fade>

      {/* ── Add Company Modal ── */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: { xs: 0, sm: "20px" }, fontFamily: "'DM Sans'" } }}>
        <DialogTitle sx={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18,
          color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", pb: 1.5,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          Add Company
          <IconButton onClick={() => setAddOpen(false)} size="small" sx={{ color: "#aaa" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {[
            { key: "name", label: "Company Name *" },
            { key: "website", label: "Official Website" },
            { key: "industry", label: "Industry" },
            { key: "location", label: "Location" },
            { key: "contactEmail", label: "Contact / Business Email" },
          ].map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              fullWidth
              value={newCompany[f.key]}
              onChange={(e) => setNewCompany({ ...newCompany, [f.key]: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: "'DM Sans'" } }}
            />
          ))}
          <TextField
            label="LinkedIn (Company Page)"
            fullWidth
            value={newCompany.socialLinks.linkedin}
            onChange={(e) => setNewCompany({ ...newCompany, socialLinks: { ...newCompany.socialLinks, linkedin: e.target.value } })}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: "'DM Sans'" } }}
          />
          <Button
            variant="contained" onClick={handleAddCompany} fullWidth
            sx={{
              background: "#1a1a2e", borderRadius: "12px", fontFamily: "'DM Sans'",
              fontWeight: 700, fontSize: 14, py: 1.4, textTransform: "none",
              "&:hover": { background: "#2d2d4e" },
            }}
          >
            Save Company
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── AI Insight Modal ── */}
      <Dialog open={insightOpen} onClose={() => setInsightOpen(false)} maxWidth="sm" fullWidth fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: { xs: 0, sm: "20px" }, fontFamily: "'DM Sans'" } }}>
        <DialogTitle sx={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18,
          color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", pb: 1.5,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {insightCompany?.name} — AI Insight
          <IconButton onClick={() => setInsightOpen(false)} size="small" sx={{ color: "#aaa" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          {insightLoading ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 1.5 }}>
              <CircularProgress sx={{ color: "#1a1a2e" }} />
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#aaa" }}>
                Researching public info & drafting outreach...
              </Typography>
            </Box>
          ) : !insight ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#888", mb: 2 }}>
                No analysis yet. Generate AI-inferred challenges and a draft outreach email based on public information.
              </Typography>
              <Button
                variant="contained" startIcon={<AutoAwesomeIcon />} onClick={generateInsight}
                sx={{
                  background: "#1a1a2e", borderRadius: "12px", fontFamily: "'DM Sans'",
                  fontWeight: 700, textTransform: "none", px: 3,
                  "&:hover": { background: "#2d2d4e" },
                }}
              >
                Generate AI Insight
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box sx={{
                background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "10px",
                p: 1.5, display: "flex", gap: 1, alignItems: "flex-start",
              }}>
                <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: "#8d6e00", lineHeight: 1.5 }}>
                  ⚠️ AI-generated &amp; speculative — confidence: <strong>{insight.confidence}</strong>.
                  These are inferences from public data, not confirmed company statements. Verify before acting.
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 12, color: "#1a1a2e", mb: 1, textTransform: "uppercase", letterSpacing: 1 }}>
                  Possible Current Challenges
                </Typography>
                {insight.inferredProblems?.map((p, i) => (
                  <Typography key={i} sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#555", mb: 0.8, pl: 1.5, borderLeft: "2px solid #f0f0f0" }}>
                    {p}
                  </Typography>
                ))}
              </Box>

              <Box>
                <Typography sx={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 12, color: "#1a1a2e", mb: 1, textTransform: "uppercase", letterSpacing: 1 }}>
                  Suggested Solutions
                </Typography>
                {insight.suggestedSolutions?.map((s, i) => (
                  <Typography key={i} sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#555", mb: 0.8, pl: 1.5, borderLeft: "2px solid #f0f0f0" }}>
                    {s}
                  </Typography>
                ))}
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 12, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: 1 }}>
                    Draft Outreach Email
                  </Typography>
                  <Tooltip title="Copy">
                    <IconButton size="small" onClick={copyEmail} sx={{ color: "#aaa", "&:hover": { color: "#1a1a2e" } }}>
                      <ContentCopyIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ background: "#f9f9fb", borderRadius: "12px", p: 2, border: "1px solid #f0f0f0" }}>
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12.5, color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                    {insight.generatedEmail}
                  </Typography>
                </Box>
                {insightCompany?.contactEmail && (
                  <Button
                    component="a"
                    href={`mailto:${insightCompany.contactEmail}?subject=${encodeURIComponent(`Regarding ${insightCompany.name}`)}&body=${encodeURIComponent(insight.generatedEmail || "")}`}
                    startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      mt: 1.5, borderRadius: "10px", fontFamily: "'DM Sans'", fontWeight: 700,
                      fontSize: 12.5, textTransform: "none", color: "#fff", background: "#1a1a2e", px: 2.5,
                      "&:hover": { background: "#2d2d4e" },
                    }}
                  >
                    Open in Email Client
                  </Button>
                )}
              </Box>

              {insight.sources?.length > 0 && (
                <Box>
                  <Typography sx={{ fontFamily: "'DM Sans'", fontWeight: 800, fontSize: 11, color: "#aaa", mb: 0.5, textTransform: "uppercase", letterSpacing: 1 }}>
                    Sources
                  </Typography>
                  {insight.sources.map((s, i) => (
                    <Typography key={i} component="a" href={s} target="_blank" rel="noopener noreferrer"
                      sx={{ display: "block", fontFamily: "'DM Sans'", fontSize: 11.5, color: "#888", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                      {s}
                    </Typography>
                  ))}
                </Box>
              )}

              <Button
                variant="outlined" startIcon={<RefreshIcon sx={{ fontSize: 16 }} />} onClick={generateInsight}
                sx={{
                  borderRadius: "12px", fontFamily: "'DM Sans'", fontWeight: 700,
                  fontSize: 12.5, textTransform: "none", borderColor: "#e8e8e8", color: "#1a1a2e",
                  "&:hover": { borderColor: "#1a1a2e", background: "#f9f9fb" },
                }}
              >
                Re-analyze
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} sx={{ fontFamily: "'DM Sans'" }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompanyJobHub;