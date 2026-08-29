import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Chip, Switch, FormControlLabel, Snackbar, Alert, Fade,
  useMediaQuery, useTheme, LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { makeAuthenticatedRequest } from '../../shared/guards/makeauth'; // adjust path
import server from '../../shared/environment';                 // adjust path

// ── shared styling (matches AdminFileUpload's field conventions) ──
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px", fontFamily: "'DM Sans'", fontSize: 14, background: "#fff",
    "& fieldset": { borderColor: "#e8e8e8" },
    "&:hover fieldset": { borderColor: "#c0c0c0" },
    "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
  },
  "& .MuiInputLabel-root": { fontFamily: "'DM Sans'", fontSize: 14 },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" },
};
const darkButtonSx = {
  background: "#1a1a2e", borderRadius: "14px", fontFamily: "'DM Sans'",
  fontWeight: 700, fontSize: 14, textTransform: "none", boxShadow: "none",
  "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
};
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const emptyBatchForm = { slug: '', title: '', description: '', imageUrl: '', price: 0, order: 0, isActive: true, whatYouLearn: '' };
const emptySubjectForm = { slug: '', name: '', description: '', order: 0 };
const emptyChapterForm = {
  slug: '', title: '', mindmapUrl: '', shortNotesUrl: '', completeNotesUrl: '',
  videoUrl: '', order: 0, isActive: true,
};

// ─────────────────────────────────────────────────────────────
// FilePicker — Link input, or a dashed drag-drop-style box
// (matching AdminFileUpload's file picker exactly) for Upload mode.
// ─────────────────────────────────────────────────────────────
const FilePicker = ({ label, value, onChangeValue, mode, onModeChange, uploading, onFileSelected, accept, isImage }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
      <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12.5, fontWeight: 700, color: "#888" }}>{label}</Typography>
      <Box sx={{ ml: 'auto', display: 'flex', background: '#f4f4f6', borderRadius: '9px', p: 0.35 }}>
        <Box onClick={() => onModeChange('url')} sx={{
          px: 1.4, py: 0.35, borderRadius: '7px', cursor: 'pointer',
          fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700,
          background: mode === 'url' ? '#1a1a2e' : 'transparent', color: mode === 'url' ? '#fff' : '#999',
        }}>Link</Box>
        <Box onClick={() => onModeChange('upload')} sx={{
          px: 1.4, py: 0.35, borderRadius: '7px', cursor: 'pointer',
          fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700,
          background: mode === 'upload' ? '#1a1a2e' : 'transparent', color: mode === 'upload' ? '#fff' : '#999',
        }}>Upload</Box>
      </Box>
    </Box>

    {mode === 'url' ? (
      <TextField fullWidth value={value} onChange={(e) => onChangeValue(e.target.value)}
        placeholder="https://..." sx={fieldSx} />
    ) : (
      <Box
        component="label"
        sx={{
          border: "2px dashed #e8e8e8", borderRadius: "14px",
          p: 3, textAlign: "center", cursor: uploading ? 'default' : "pointer",
          "&:hover": uploading ? {} : { borderColor: "#1a1a2e", background: "#fafafa" },
          transition: "all 0.2s ease",
          minHeight: 110, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <input type="file" accept={accept} hidden disabled={uploading}
          onChange={(e) => { if (e.target.files?.[0]) onFileSelected(e.target.files[0]); }} />
        {isImage && value ? (
          <Box component="img" src={value} alt="preview" sx={{ width: 44, height: 44, borderRadius: '10px', objectFit: 'cover', mb: 1 }} />
        ) : (
          value ? <DescriptionOutlinedIcon sx={{ fontSize: 32, color: "#1a1a2e", mb: 1 }} /> : <UploadFileIcon sx={{ fontSize: 32, color: "#ccc", mb: 1 }} />
        )}
        <Typography sx={{
          fontFamily: "'DM Sans'", fontSize: 13,
          color: uploading ? "#aaa" : value ? "#1a1a2e" : "#aaa",
          fontWeight: value ? 700 : 400, wordBreak: "break-word", px: 1,
        }}>
          {uploading ? 'Uploading…' : (value || 'Click to choose a file')}
        </Typography>
      </Box>
    )}
  </Box>
);

// ─────────────────────────────────────────────────────────────
// EntityCard — one card in the grid (subject / chapter).
// Same visual shell as AdminFileUpload's file cards.
// ─────────────────────────────────────────────────────────────
const EntityCard = ({ icon, title, subtitle, tagLabel, tagColor, statusLabel, statusActive, thumbUrl, onOpen, onEdit, onDelete, onToggleStatus, openLabel }) => (
  <Box sx={{
    background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px",
    p: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex", flexDirection: "column", gap: 1.5,
    opacity: statusActive === false ? 0.6 : 1,
  }}>
    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, cursor: onOpen ? 'pointer' : 'default' }} onClick={onOpen}>
        {thumbUrl ? (
          <Box component="img" src={thumbUrl} alt={title} sx={{ width: 40, height: 40, borderRadius: "11px", objectFit: 'cover', flexShrink: 0, border: '1px solid #eee' }} />
        ) : (
          <Box sx={{ width: 40, height: 40, borderRadius: "11px", background: "#f4f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{
            fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 14, color: "#1a1a2e", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11.5, color: "#aaa", mt: 0.3 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      <IconButton onClick={onDelete} size="small"
        sx={{ color: "#ccc", borderRadius: "8px", p: 0.6, flexShrink: 0, "&:hover": { color: "#e53935", background: "#fff0f0" } }}>
        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: 'wrap', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
        {tagLabel && (
          <Box sx={{ px: 1.2, py: 0.3, borderRadius: "8px", background: tagColor?.bg || "#f4f4f6" }}>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700, color: tagColor?.text || "#555" }}>
              {tagLabel}
            </Typography>
          </Box>
        )}
        {statusLabel && (
          <Box onClick={onToggleStatus} sx={{
            px: 1.2, py: 0.3, borderRadius: "8px", cursor: onToggleStatus ? 'pointer' : 'default',
            background: statusActive ? "#1a1a2e" : "#f4f4f6",
          }}>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 700, color: statusActive ? "#fff" : "#999" }}>
              {statusLabel}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {onOpen && (
          <Button onClick={onOpen} size="small"
            sx={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 12, color: "#1a1a2e", textTransform: "none", p: 0, "&:hover": { background: "transparent", textDecoration: "underline" } }}>
            {openLabel || 'Open →'}
          </Button>
        )}
        <IconButton size="small" onClick={onEdit} sx={{ color: "#aaa", p: 0.5, borderRadius: "8px", "&:hover": { color: "#1a1a2e", background: "#f4f4f6" } }}>
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────────
// BatchCard — a much richer, "storefront" style card just for
// batches: full-bleed image banner, gradient scrim, floating
// price badge, and a dedicated Explore action that surfaces the
// "What You'll Learn" list pulled straight from the backend.
// ─────────────────────────────────────────────────────────────
const BatchCard = ({ batch, onExplore, onOpen, onEdit, onDelete, onToggleStatus }) => {
  const isFree = Number(batch.price) === 0;
  const learnCount = Array.isArray(batch.whatYouLearn) ? batch.whatYouLearn.length : 0;

  return (
    <Box sx={{
      position: 'relative',
      borderRadius: '22px',
      overflow: 'hidden',
      background: '#fff',
      border: '1px solid #f0f0f0',
      boxShadow: '0 10px 30px rgba(26,26,46,0.08)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      opacity: batch.isActive === false ? 0.65 : 1,
      "&:hover": {
        transform: 'translateY(-4px)',
        boxShadow: '0 18px 44px rgba(26,26,46,0.16)',
      },
    }}>
      {/* ── Banner ── */}
      <Box sx={{ position: 'relative', height: 150, overflow: 'hidden' }}>
        {batch.imageUrl ? (
          <Box component="img" src={batch.imageUrl} alt={batch.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <Box sx={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Inventory2Icon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.35)' }} />
          </Box>
        )}

        {/* gradient scrim for title legibility */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(26,26,46,0) 35%, rgba(26,26,46,0.85) 100%)',
        }} />

        {/* delete, top-right */}
        <IconButton onClick={onDelete} size="small" sx={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(255,255,255,0.9)', color: '#888', p: 0.7,
          "&:hover": { color: '#e53935', background: '#fff' },
        }}>
          <DeleteOutlineIcon sx={{ fontSize: 17 }} />
        </IconButton>

        {/* price badge, top-left */}
        <Box sx={{
          position: 'absolute', top: 10, left: 10,
          px: 1.3, py: 0.4, borderRadius: '10px',
          background: isFree ? 'linear-gradient(135deg,#43e97b,#38f9d7)' : 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        }}>
          <Typography sx={{
            fontFamily: "'DM Sans'", fontSize: 11.5, fontWeight: 800,
            color: isFree ? '#0a3d24' : '#1a1a2e', letterSpacing: '0.3px',
          }}>
            {isFree ? 'FREE' : `₹${batch.price}`}
          </Typography>
        </Box>

        {/* status pill, next to price */}
        <Box onClick={onToggleStatus} sx={{
          position: 'absolute', top: 10, left: isFree ? 72 : (String(batch.price).length > 3 ? 92 : 76),
          px: 1.1, py: 0.4, borderRadius: '10px', cursor: 'pointer',
          background: batch.isActive ? 'rgba(26,26,46,0.85)' : 'rgba(255,255,255,0.9)',
        }}>
          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 10.5, fontWeight: 700, color: batch.isActive ? '#fff' : '#999' }}>
            {batch.isActive ? 'Active' : 'Inactive'}
          </Typography>
        </Box>

        {/* title over the scrim */}
        <Box sx={{ position: 'absolute', left: 14, right: 14, bottom: 10 }}>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18,
            color: '#fff', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.35)',
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {batch.title}
          </Typography>
        </Box>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ p: 2, pt: 1.6, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
        <Typography sx={{
          fontFamily: "'DM Sans'", fontSize: 12.5, color: '#888', lineHeight: 1.5,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 34,
        }}>
          {batch.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={onExplore}
            startIcon={<AutoAwesomeIcon sx={{ fontSize: 15 }} />}
            size="small"
            sx={{
              flex: 1, fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 12.5,
              color: '#fff', textTransform: 'none', borderRadius: '11px', py: 0.7,
              background: 'linear-gradient(135deg, #1a1a2e, #3a3a6e)',
              "&:hover": { background: 'linear-gradient(135deg, #2d2d4e, #4a4a8e)' },
            }}
          >
            Explore{learnCount > 0 ? ` · ${learnCount}` : ''}
          </Button>

          <Button onClick={onOpen} size="small"
            sx={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 12, color: '#1a1a2e', textTransform: 'none', px: 1.2, borderRadius: '11px', border: '1px solid #eee' }}>
            Subjects →
          </Button>

          <IconButton size="small" onClick={onEdit} sx={{ color: "#aaa", p: 0.8, borderRadius: "10px", border: '1px solid #eee', "&:hover": { color: "#1a1a2e", background: "#f4f4f6" } }}>
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────
// NotesManager — standalone admin page: Batches → Subjects → Chapters
// ─────────────────────────────────────────────────────────────
const NotesManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [view, setView] = useState('batches'); // 'batches' | 'subjects' | 'chapters'

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchForm, setBatchForm] = useState(emptyBatchForm);
  const [editingBatch, setEditingBatch] = useState(null);
  const [batchImageMode, setBatchImageMode] = useState('url');
  const [batchImageUploading, setBatchImageUploading] = useState(false);

  // Explore dialog — shows "What You'll Learn" for a batch (backend-sourced)
  const [exploreBatch, setExploreBatch] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState(emptySubjectForm);
  const [editingSubject, setEditingSubject] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [chapterForm, setChapterForm] = useState(emptyChapterForm);
  const [editingChapter, setEditingChapter] = useState(null);

  const [mindmapMode, setMindmapMode] = useState('url');
  const [shortNotesMode, setShortNotesMode] = useState('url');
  const [completeNotesMode, setCompleteNotesMode] = useState('url');
  const [uploadingField, setUploadingField] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'batch'|'subject'|'chapter', item }
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const uploadFile = async (file) => {
    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${server}/api/notes/admin/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  // ═══════════════════ BATCHES ═══════════════════
  const fetchBatches = async () => {
    try {
      const data = await makeAuthenticatedRequest(`${server}/api/notes/admin/batches`);
      setBatches(data);
    } catch (err) { showSnackbar('Failed to load batches', 'error'); }
  };
  useEffect(() => { fetchBatches(); }, []);

  const openAddBatch = () => { setEditingBatch(null); setBatchForm(emptyBatchForm); setBatchImageMode('url'); setBatchDialogOpen(true); };
  const openEditBatch = (b) => {
    setEditingBatch(b);
    setBatchForm({
      slug: b.slug, title: b.title, description: b.description, imageUrl: b.imageUrl,
      price: b.price, order: b.order, isActive: b.isActive,
      whatYouLearn: Array.isArray(b.whatYouLearn) ? b.whatYouLearn.join('\n') : '',
    });
    setBatchImageMode('url');
    setBatchDialogOpen(true);
  };

  const handleBatchImageFile = async (file) => {
    setBatchImageUploading(true);
    try {
      const url = await uploadFile(file);
      setBatchForm((p) => ({ ...p, imageUrl: url }));
      showSnackbar('Image uploaded!');
    } catch (err) { showSnackbar('Upload failed', 'error'); }
    finally { setBatchImageUploading(false); }
  };

  const saveBatch = async () => {
    if (!batchForm.title || !batchForm.description || !batchForm.imageUrl) {
      showSnackbar('Title, Description and Image are required', 'error'); return;
    }
    const slug = editingBatch ? editingBatch.slug : (batchForm.slug || slugify(batchForm.title));
    const whatYouLearn = batchForm.whatYouLearn
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = { ...batchForm, slug, price: Number(batchForm.price), order: Number(batchForm.order), whatYouLearn };

    try {
      if (editingBatch) {
        await makeAuthenticatedRequest(`${server}/api/notes/admin/batches/${editingBatch._id}`, 'PUT', payload);
        showSnackbar('Batch updated!');
      } else {
        await makeAuthenticatedRequest(`${server}/api/notes/admin/batches`, 'POST', payload);
        showSnackbar('Batch added!');
      }
      setBatchDialogOpen(false);
      fetchBatches();
    } catch (err) { showSnackbar(err.message || 'Failed to save batch', 'error'); }
  };

  const toggleBatch = async (id) => {
    try { await makeAuthenticatedRequest(`${server}/api/notes/admin/batches/${id}/toggle`, 'PATCH'); fetchBatches(); }
    catch (err) { showSnackbar('Failed to toggle batch', 'error'); }
  };

  const deleteBatch = async (id) => {
    try { await makeAuthenticatedRequest(`${server}/api/notes/admin/batches/${id}`, 'DELETE'); showSnackbar('Batch deleted'); fetchBatches(); }
    catch (err) { showSnackbar('Failed to delete batch', 'error'); }
    setDeleteConfirm(null);
  };

  const openBatchSubjects = async (batch) => {
    setSelectedBatch(batch);
    setView('subjects');
    try {
      const data = await makeAuthenticatedRequest(`${server}/api/notes/admin/subjects?batch=${encodeURIComponent(batch.slug)}`);
      setSubjects(data);
    } catch (err) { showSnackbar('Failed to load subjects', 'error'); }
  };

  // ═══════════════════ SUBJECTS ═══════════════════
  const refreshSubjects = async () => {
    if (!selectedBatch) return;
    try {
      const data = await makeAuthenticatedRequest(`${server}/api/notes/admin/subjects?batch=${encodeURIComponent(selectedBatch.slug)}`);
      setSubjects(data);
    } catch (err) { showSnackbar('Failed to refresh subjects', 'error'); }
  };

  const openAddSubject = () => { setEditingSubject(null); setSubjectForm(emptySubjectForm); setSubjectDialogOpen(true); };
  const openEditSubject = (s) => { setEditingSubject(s); setSubjectForm({ slug: s.slug, name: s.name, description: s.description, order: s.order }); setSubjectDialogOpen(true); };

  const saveSubject = async () => {
    if (!subjectForm.name) { showSnackbar('Subject name is required', 'error'); return; }
    if (!editingSubject && !subjectForm.slug) { showSnackbar('Subject key (slug) is required', 'error'); return; }
    const payload = { ...subjectForm, batchSlug: selectedBatch.slug, slug: editingSubject ? editingSubject.slug : subjectForm.slug };
    try {
      if (editingSubject) {
        await makeAuthenticatedRequest(`${server}/api/notes/admin/subjects/${editingSubject._id}`, 'PUT', payload);
        showSnackbar('Subject updated!');
      } else {
        await makeAuthenticatedRequest(`${server}/api/notes/admin/subjects`, 'POST', payload);
        showSnackbar('Subject added!');
      }
      setSubjectDialogOpen(false);
      refreshSubjects();
    } catch (err) { showSnackbar(err.message || 'Failed to save subject', 'error'); }
  };

  const toggleSubject = async (id) => {
    try { await makeAuthenticatedRequest(`${server}/api/notes/admin/subjects/${id}/toggle`, 'PATCH'); refreshSubjects(); }
    catch (err) { showSnackbar('Failed to toggle subject', 'error'); }
  };

  const deleteSubject = async (id) => {
    try { await makeAuthenticatedRequest(`${server}/api/notes/admin/subjects/${id}`, 'DELETE'); showSnackbar('Subject deleted'); refreshSubjects(); }
    catch (err) { showSnackbar('Failed to delete subject', 'error'); }
    setDeleteConfirm(null);
  };

  const openSubjectChapters = async (subject) => {
    setSelectedSubject(subject);
    setView('chapters');
    try {
      const data = await makeAuthenticatedRequest(`${server}/api/notes/admin/chapters?batch=${encodeURIComponent(selectedBatch.slug)}&subject=${encodeURIComponent(subject.slug)}`);
      setChapters(data);
    } catch (err) { showSnackbar('Failed to load chapters', 'error'); }
  };

  // ═══════════════════ CHAPTERS ═══════════════════
  const refreshChapters = async () => {
    if (!selectedBatch || !selectedSubject) return;
    try {
      const data = await makeAuthenticatedRequest(`${server}/api/notes/admin/chapters?batch=${encodeURIComponent(selectedBatch.slug)}&subject=${encodeURIComponent(selectedSubject.slug)}`);
      setChapters(data);
    } catch (err) { showSnackbar('Failed to refresh chapters', 'error'); }
  };

  const openAddChapter = () => {
    setEditingChapter(null);
    setChapterForm(emptyChapterForm);
    setMindmapMode('url'); setShortNotesMode('url'); setCompleteNotesMode('url');
    setChapterDialogOpen(true);
  };

  const openEditChapter = (ch) => {
    setEditingChapter(ch);
    setChapterForm({
      slug: ch.slug, title: ch.title,
      mindmapUrl: ch.mindmapUrl || '', shortNotesUrl: ch.shortNotesUrl || '', completeNotesUrl: ch.completeNotesUrl || '',
      videoUrl: ch.videoUrl || '', order: ch.order || 0, isActive: ch.isActive,
    });
    setMindmapMode('url'); setShortNotesMode('url'); setCompleteNotesMode('url');
    setChapterDialogOpen(true);
  };

  const handleChapterFileSelected = async (field, file) => {
    setUploadingField(field);
    try {
      const url = await uploadFile(file);
      setChapterForm((prev) => ({ ...prev, [field]: url }));
      showSnackbar('File uploaded to Cloudinary!');
    } catch (err) { showSnackbar('Upload failed', 'error'); }
    finally { setUploadingField(null); }
  };

  const saveChapter = async () => {
    if (!chapterForm.title) { showSnackbar('Chapter title is required', 'error'); return; }
    const slug = editingChapter ? editingChapter.slug : slugify(chapterForm.title);
    const payload = { ...chapterForm, slug, batchSlug: selectedBatch.slug, subjectSlug: selectedSubject.slug };

    try {
      if (editingChapter) {
        await makeAuthenticatedRequest(`${server}/api/notes/admin/chapters/${editingChapter._id}`, 'PUT', payload);
        showSnackbar('Chapter updated!');
      } else {
        await makeAuthenticatedRequest(`${server}/api/notes/admin/chapters`, 'POST', payload);
        showSnackbar('Chapter added!');
      }
      setChapterDialogOpen(false);
      refreshChapters();
    } catch (err) { showSnackbar(err.message || 'Failed to save chapter', 'error'); }
  };

  const toggleChapter = async (id) => {
    try { await makeAuthenticatedRequest(`${server}/api/notes/admin/chapters/${id}/toggle`, 'PATCH'); refreshChapters(); }
    catch (err) { showSnackbar('Failed to toggle chapter', 'error'); }
  };

  const deleteChapter = async (id) => {
    try { await makeAuthenticatedRequest(`${server}/api/notes/admin/chapters/${id}`, 'DELETE'); showSnackbar('Chapter deleted'); refreshChapters(); }
    catch (err) { showSnackbar('Failed to delete chapter', 'error'); }
    setDeleteConfirm(null);
  };

  // ═══════════════════ HEADER TEXT ═══════════════════
  const headerTitle = view === 'batches' ? 'Notes Manager'
    : view === 'subjects' ? selectedBatch?.title
    : selectedSubject?.name;
  const headerSubtitle = view === 'batches' ? 'Batches → Subjects → Chapters, standalone'
    : view === 'subjects' ? 'Subjects inside this batch'
    : 'Chapters — Mindmap / Short Notes / Complete Notes / Video';

  const list = view === 'batches' ? batches : view === 'subjects' ? subjects : chapters;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');`}</style>

      <Fade in timeout={500}>
        <Box sx={{ px: { xs: 0, sm: 0 } }}>

          {/* ── Header (matches AdminFileUpload) ── */}
          <Box sx={{
            mb: { xs: 3, sm: 4 },
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}>
            <Box>
              {view !== 'batches' && (
                <Button
                  size="small" startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 11 }} />}
                  onClick={() => view === 'chapters' ? setView('subjects') : setView('batches')}
                  sx={{ mb: 0.8, fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 12, color: '#888', textTransform: 'none', p: 0 }}
                >
                  {view === 'chapters' ? 'Subjects' : 'Batches'}
                </Button>
              )}
              <Typography sx={{
                fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 800,
                color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5,
              }}>
                Admin Panel
              </Typography>
              <Typography sx={{
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
                fontSize: { xs: 22, sm: 30 }, color: "#1a1a2e", letterSpacing: "-1px",
              }}>
                {headerTitle}
              </Typography>
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#aaa", mt: 0.5 }}>
                {headerSubtitle}
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={view === 'batches' ? <Inventory2Icon /> : <AddIcon />}
              onClick={view === 'batches' ? openAddBatch : view === 'subjects' ? openAddSubject : openAddChapter}
              fullWidth={isMobile}
              sx={{ ...darkButtonSx, py: 1.4, px: 3 }}
            >
              {view === 'batches' ? 'Add Batch' : view === 'subjects' ? 'Add Subject' : 'Add Chapter'}
            </Button>
          </Box>

          {/* ── Grid ── */}
          {list.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <MenuBookIcon sx={{ fontSize: 48, color: "#e0e0e0", mb: 1 }} />
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#ccc" }}>
                {view === 'batches' ? 'No batches yet — add one to get started' : view === 'subjects' ? 'No subjects yet in this batch' : 'No chapters yet for this subject'}
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fill, minmax(280px, 1fr))" },
              gap: { xs: 2, sm: 2.5 },
            }}>
              {view === 'batches' && batches.map((b) => (
                <BatchCard
                  key={b._id}
                  batch={b}
                  onExplore={() => setExploreBatch(b)}
                  onOpen={() => openBatchSubjects(b)}
                  onEdit={() => openEditBatch(b)}
                  onDelete={() => setDeleteConfirm({ type: 'batch', item: b })}
                  onToggleStatus={() => toggleBatch(b._id)}
                />
              ))}

              {view === 'subjects' && subjects.map((s) => (
                <EntityCard
                  key={s._id}
                  icon={<MenuBookIcon sx={{ fontSize: 20, color: "#1a1a2e" }} />}
                  title={s.name}
                  subtitle={s.description}
                  statusLabel={s.isActive ? 'Active' : 'Inactive'}
                  statusActive={s.isActive}
                  onToggleStatus={() => toggleSubject(s._id)}
                  onOpen={() => openSubjectChapters(s)}
                  openLabel="Chapters →"
                  onEdit={() => openEditSubject(s)}
                  onDelete={() => setDeleteConfirm({ type: 'subject', item: s })}
                />
              ))}

              {view === 'chapters' && chapters.map((ch) => (
                <EntityCard
                  key={ch._id}
                  icon={<DescriptionOutlinedIcon sx={{ fontSize: 20, color: "#1a1a2e" }} />}
                  title={ch.title}
                  subtitle={`/${ch.slug}`}
                  statusLabel={ch.isActive ? 'Active' : 'Inactive'}
                  statusActive={ch.isActive}
                  onToggleStatus={() => toggleChapter(ch._id)}
                  onEdit={() => openEditChapter(ch)}
                  onDelete={() => setDeleteConfirm({ type: 'chapter', item: ch })}
                />
              ))}
            </Box>
          )}
        </Box>
      </Fade>

      {/* ── ADD/EDIT BATCH DIALOG ── */}
      <Dialog
        open={batchDialogOpen} onClose={() => setBatchDialogOpen(false)}
        maxWidth="sm" fullWidth fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: { xs: 0, sm: "20px" }, fontFamily: "'DM Sans'", boxShadow: "0 32px 80px rgba(0,0,0,0.15)", m: { xs: 0, sm: 2 } } }}
      >
        <DialogTitle sx={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 18, sm: 20 },
          color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", pb: 1.5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {editingBatch ? 'Edit Batch' : 'Add Batch'}
          {isMobile && <IconButton onClick={() => setBatchDialogOpen(false)} size="small" sx={{ color: "#aaa" }}><CloseIcon /></IconButton>}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5 }, mt: 1 }}>
          <TextField label="Title *" value={batchForm.title}
            onChange={(e) => setBatchForm((p) => ({ ...p, title: e.target.value }))} fullWidth sx={fieldSx} />
          {!editingBatch && (
            <TextField label="Slug" value={batchForm.slug}
              onChange={(e) => setBatchForm((p) => ({ ...p, slug: e.target.value }))} fullWidth
              helperText="Leave blank to auto-generate from title" sx={fieldSx} />
          )}
          <TextField label="Description *" value={batchForm.description}
            onChange={(e) => setBatchForm((p) => ({ ...p, description: e.target.value }))} fullWidth multiline rows={2} sx={fieldSx} />

          <FilePicker label="Image *" value={batchForm.imageUrl} accept="image/*" isImage
            onChangeValue={(v) => setBatchForm((p) => ({ ...p, imageUrl: v }))}
            mode={batchImageMode} onModeChange={setBatchImageMode}
            uploading={batchImageUploading} onFileSelected={handleBatchImageFile} />

          {batchImageUploading && (
            <Box>
              <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#aaa", mb: 0.8 }}>Uploading…</Typography>
              <LinearProgress sx={{ borderRadius: "4px", "& .MuiLinearProgress-bar": { background: "#1a1a2e" } }} />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Price (₹)" type="number" value={batchForm.price}
              onChange={(e) => setBatchForm((p) => ({ ...p, price: e.target.value }))} fullWidth
              helperText="0 = FREE" sx={fieldSx} />
            <TextField label="Order" type="number" value={batchForm.order}
              onChange={(e) => setBatchForm((p) => ({ ...p, order: e.target.value }))} fullWidth sx={fieldSx} />
          </Box>

          <Box>
            <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12.5, fontWeight: 700, color: "#888", mb: 0.8 }}>
              What You'll Learn
            </Typography>
            <TextField
              value={batchForm.whatYouLearn}
              onChange={(e) => setBatchForm((p) => ({ ...p, whatYouLearn: e.target.value }))}
              fullWidth multiline rows={4}
              placeholder={"One feature per line, e.g.\nComplete NCERT-based mindmaps\nChapter-wise short notes\nWeekly live doubt sessions"}
              helperText="Each line becomes a feature students see when they tap Explore on this batch"
              sx={fieldSx}
            />
          </Box>

          <FormControlLabel
            control={<Switch checked={batchForm.isActive}
              onChange={(e) => setBatchForm((p) => ({ ...p, isActive: e.target.checked }))}
              sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a1a2e" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#1a1a2e" } }} />}
            label="Active (visible to students)"
            sx={{ "& .MuiFormControlLabel-label": { fontFamily: "'DM Sans'", fontSize: 13.5, color: '#555' } }}
          />

          <Button variant="contained" onClick={saveBatch} fullWidth
            sx={{ ...darkButtonSx, py: { xs: 1.8, sm: 1.5 }, fontSize: { xs: 15, sm: 14 } }}>
            {editingBatch ? 'Update Batch' : 'Add Batch'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── EXPLORE DIALOG (What You'll Learn, sourced from backend) ── */}
      <Dialog
        open={!!exploreBatch} onClose={() => setExploreBatch(null)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: "22px", fontFamily: "'DM Sans'", overflow: 'hidden', boxShadow: "0 32px 80px rgba(0,0,0,0.2)" } }}
      >
        {exploreBatch && (
          <>
            <Box sx={{ position: 'relative', height: 130 }}>
              {exploreBatch.imageUrl ? (
                <Box component="img" src={exploreBatch.imageUrl} alt={exploreBatch.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)' }} />
              )}
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,26,46,0.1) 0%, rgba(26,26,46,0.9) 100%)' }} />
              <IconButton onClick={() => setExploreBatch(null)} size="small"
                sx={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', "&:hover": { background: '#fff' } }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Box sx={{ position: 'absolute', left: 18, bottom: 12, right: 18 }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, color: '#fff' }}>
                  {exploreBatch.title}
                </Typography>
                <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 12, color: 'rgba(255,255,255,0.75)', mt: 0.3 }}>
                  What you'll get in this batch
                </Typography>
              </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              {Array.isArray(exploreBatch.whatYouLearn) && exploreBatch.whatYouLearn.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6 }}>
                  {exploreBatch.whatYouLearn.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                      <CheckCircleIcon sx={{ fontSize: 19, color: '#43a047', mt: '1px', flexShrink: 0 }} />
                      <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 14, color: '#333', lineHeight: 1.5 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <VisibilityIcon sx={{ fontSize: 32, color: '#e0e0e0', mb: 1 }} />
                  <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 13, color: '#aaa' }}>
                    No features added yet for this batch.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => { const b = exploreBatch; setExploreBatch(null); openEditBatch(b); }}
                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                sx={{ ...darkButtonSx, py: 1.3 }}
              >
                Edit Features
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── ADD/EDIT SUBJECT DIALOG ── */}
      <Dialog
        open={subjectDialogOpen} onClose={() => setSubjectDialogOpen(false)}
        maxWidth="xs" fullWidth fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: { xs: 0, sm: "20px" }, fontFamily: "'DM Sans'", m: { xs: 0, sm: 2 } } }}
      >
        <DialogTitle sx={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 18, sm: 20 },
          color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", pb: 1.5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {editingSubject ? 'Edit Subject' : 'Add Subject'}
          {isMobile && <IconButton onClick={() => setSubjectDialogOpen(false)} size="small" sx={{ color: "#aaa" }}><CloseIcon /></IconButton>}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Subject Name *" value={subjectForm.name}
            onChange={(e) => setSubjectForm((p) => ({ ...p, name: e.target.value }))} fullWidth sx={fieldSx} />
          <TextField label="Slug *" value={subjectForm.slug}
            onChange={(e) => setSubjectForm((p) => ({ ...p, slug: e.target.value }))} fullWidth
            disabled={!!editingSubject}
            helperText={editingSubject ? "Can't change after creation" : 'e.g. "physics"'}
            sx={fieldSx} />
          <TextField label="Description" value={subjectForm.description}
            onChange={(e) => setSubjectForm((p) => ({ ...p, description: e.target.value }))} fullWidth multiline rows={2} sx={fieldSx} />
          <Button variant="contained" onClick={saveSubject} fullWidth sx={{ ...darkButtonSx, py: { xs: 1.8, sm: 1.5 } }}>Save</Button>
        </DialogContent>
      </Dialog>

      {/* ── ADD/EDIT CHAPTER DIALOG ── */}
      <Dialog
        open={chapterDialogOpen} onClose={() => setChapterDialogOpen(false)}
        maxWidth="sm" fullWidth fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: { xs: 0, sm: "20px" }, fontFamily: "'DM Sans'", m: { xs: 0, sm: 2 } } }}
      >
        <DialogTitle sx={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 18, sm: 20 },
          color: "#1a1a2e", borderBottom: "1px solid #f0f0f0", pb: 1.5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {editingChapter ? 'Edit Chapter' : 'Add Chapter'}
          {isMobile && <IconButton onClick={() => setChapterDialogOpen(false)} size="small" sx={{ color: "#aaa" }}><CloseIcon /></IconButton>}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: 2.5, mt: 1, overflowY: 'auto' }}>
          <TextField label="Chapter Title *" value={chapterForm.title}
            onChange={(e) => setChapterForm((p) => ({ ...p, title: e.target.value }))} fullWidth sx={fieldSx} />

            <FilePicker label="Mindmap PDF" value={chapterForm.mindmapUrl} accept="application/pdf,image/*"
              onChangeValue={(v) => setChapterForm((p) => ({ ...p, mindmapUrl: v }))}
              mode={mindmapMode} onModeChange={setMindmapMode}
              uploading={uploadingField === 'mindmapUrl'} onFileSelected={(f) => handleChapterFileSelected('mindmapUrl', f)} />

            <FilePicker label="Short Notes PDF" value={chapterForm.shortNotesUrl} accept="application/pdf,image/*"
              onChangeValue={(v) => setChapterForm((p) => ({ ...p, shortNotesUrl: v }))}
              mode={shortNotesMode} onModeChange={setShortNotesMode}
              uploading={uploadingField === 'shortNotesUrl'} onFileSelected={(f) => handleChapterFileSelected('shortNotesUrl', f)} />

            <FilePicker label="Complete Notes PDF" value={chapterForm.completeNotesUrl} accept="application/pdf,image/*"
              onChangeValue={(v) => setChapterForm((p) => ({ ...p, completeNotesUrl: v }))}
              mode={completeNotesMode} onModeChange={setCompleteNotesMode}
              uploading={uploadingField === 'completeNotesUrl'} onFileSelected={(f) => handleChapterFileSelected('completeNotesUrl', f)} />
              
          <TextField label="Video URL" value={chapterForm.videoUrl}
            onChange={(e) => setChapterForm((p) => ({ ...p, videoUrl: e.target.value }))} fullWidth
            helperText="YouTube / hosted video link — leave blank if not ready" sx={fieldSx} />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Order" type="number" value={chapterForm.order}
              onChange={(e) => setChapterForm((p) => ({ ...p, order: e.target.value }))} fullWidth sx={fieldSx} />
            <FormControlLabel
              control={<Switch checked={chapterForm.isActive}
                onChange={(e) => setChapterForm((p) => ({ ...p, isActive: e.target.checked }))}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a1a2e" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#1a1a2e" } }} />}
              label="Active"
              sx={{ whiteSpace: 'nowrap', "& .MuiFormControlLabel-label": { fontFamily: "'DM Sans'", fontSize: 13.5, color: '#555' } }}
            />
          </Box>

          <Button variant="contained" onClick={saveChapter} fullWidth sx={{ ...darkButtonSx, py: { xs: 1.8, sm: 1.5 }, mt: { xs: 'auto', sm: 0 } }}>
            {editingChapter ? 'Update Chapter' : 'Add Chapter'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM ── */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} PaperProps={{ sx: { borderRadius: '20px', fontFamily: "'DM Sans'" } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: '#1a1a2e', borderBottom: '1px solid #f0f0f0' }}>
          Delete {deleteConfirm?.type === 'batch' ? 'Batch' : deleteConfirm?.type === 'subject' ? 'Subject' : 'Chapter'}?
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ fontFamily: "'DM Sans'", fontSize: 14, color: '#333' }}>
            {deleteConfirm?.type === 'batch'
              ? `Delete "${deleteConfirm.item.title}"? Its subjects/chapters remain in the database but become unreachable.`
              : deleteConfirm?.type === 'subject'
              ? `Delete "${deleteConfirm.item.name}"? Its chapters remain in the database but become unreachable.`
              : `Delete "${deleteConfirm?.item?.title}"? This cannot be undone.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ fontFamily: "'DM Sans'", fontWeight: 700, textTransform: 'none', color: '#888' }}>Cancel</Button>
          <Button variant="contained"
            onClick={() => {
              if (deleteConfirm.type === 'batch') deleteBatch(deleteConfirm.item._id);
              else if (deleteConfirm.type === 'subject') deleteSubject(deleteConfirm.item._id);
              else deleteChapter(deleteConfirm.item._id);
            }}
            sx={{ background: '#e53935', borderRadius: '14px', fontWeight: 700, textTransform: 'none', boxShadow: 'none', '&:hover': { background: '#c62828' } }}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ fontFamily: "'DM Sans'", borderRadius: '12px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default NotesManager;