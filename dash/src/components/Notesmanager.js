import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Chip, Switch, FormControlLabel, Tooltip, Snackbar, Alert, Fade,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { makeAuthenticatedRequest } from './makeauth'; // adjust path
import server from '../environment';                 // adjust path

// ── shared styling ──
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, background: "#fff",
    "& fieldset": { borderColor: "#e8e8e8" },
    "&:hover fieldset": { borderColor: "#c0c0c0" },
    "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
  },
  "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", fontSize: 14 },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" },
};
const darkButtonSx = {
  background: "#1a1a2e", borderRadius: "14px", fontFamily: "'DM Sans', sans-serif",
  fontWeight: 700, fontSize: 14, textTransform: "none", boxShadow: "none",
  "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
  transition: "all 0.2s ease",
};
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const emptyBatchForm = { slug: '', title: '', description: '', imageUrl: '', price: 0, order: 0, isActive: true };
const emptySubjectForm = { slug: '', name: '', description: '', order: 0 };
const emptyChapterForm = {
  slug: '', title: '', mindmapUrl: '', shortNotesUrl: '', completeNotesUrl: '',
  videoUrl: '', order: 0, isActive: true,
};

// ─────────────────────────────────────────────────────────────
// FilePicker — Link / Upload toggle. Upload goes straight to
// Cloudinary via POST /api/notes/admin/upload. Used for both
// batch images and chapter PDFs.
// ─────────────────────────────────────────────────────────────
const FilePicker = ({ label, value, onChangeValue, mode, onModeChange, uploading, onFileSelected, accept, showImagePreview }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 700, color: "#888" }}>{label}</Typography>
      <Box sx={{ ml: 'auto', display: 'flex', background: '#f4f4f6', borderRadius: '9px', p: 0.35 }}>
        <Box onClick={() => onModeChange('url')} sx={{
          px: 1.4, py: 0.35, borderRadius: '7px', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
          background: mode === 'url' ? '#1a1a2e' : 'transparent', color: mode === 'url' ? '#fff' : '#999',
        }}>Link</Box>
        <Box onClick={() => onModeChange('upload')} sx={{
          px: 1.4, py: 0.35, borderRadius: '7px', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
          background: mode === 'upload' ? '#1a1a2e' : 'transparent', color: mode === 'upload' ? '#fff' : '#999',
        }}>Upload</Box>
      </Box>
    </Box>

    {mode === 'url' ? (
      <TextField fullWidth value={value} onChange={(e) => onChangeValue(e.target.value)}
        placeholder="https://..." sx={fieldSx} />
    ) : (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, p: 1.2, border: '1px dashed #e0e0e0', borderRadius: '14px', background: '#fafafa' }}>
        {value && showImagePreview && (
          <Box component="img" src={value} alt="preview" sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee', flexShrink: 0 }} />
        )}
        {value && !showImagePreview && <DescriptionOutlinedIcon sx={{ color: '#1a1a2e', fontSize: 26, flexShrink: 0 }} />}
        <Button component="label" disabled={uploading} startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
          sx={{ borderRadius: '10px', textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, color: '#1a1a2e', background: '#fff', border: '1px solid #ddd', px: 1.6, py: 0.6, whiteSpace: 'nowrap', "&:hover": { borderColor: '#1a1a2e', background: '#f4f4f6' } }}>
          {uploading ? 'Uploading…' : (value ? 'Replace' : 'Choose File')}
          <input type="file" accept={accept} hidden onChange={(e) => { if (e.target.files?.[0]) onFileSelected(e.target.files[0]); }} />
        </Button>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#bbb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || 'No file chosen'}
        </Typography>
      </Box>
    )}
  </Box>
);

// ─────────────────────────────────────────────────────────────
// NotesManager — standalone admin page: Batches → Subjects → Chapters
// ─────────────────────────────────────────────────────────────
const NotesManager = () => {
  const [view, setView] = useState('batches'); // 'batches' | 'subjects' | 'chapters'

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [batchForm, setBatchForm] = useState(emptyBatchForm);
  const [editingBatch, setEditingBatch] = useState(null);
  const [batchImageMode, setBatchImageMode] = useState('url');
  const [batchImageUploading, setBatchImageUploading] = useState(false);

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

  // ── generic Cloudinary upload helper ──
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
    } catch (err) {
      showSnackbar('Failed to load batches', 'error');
    }
  };
  useEffect(() => { fetchBatches(); }, []);

  const openAddBatch = () => { setEditingBatch(null); setBatchForm(emptyBatchForm); setBatchImageMode('url'); setBatchDialogOpen(true); };
  const openEditBatch = (b) => {
    setEditingBatch(b);
    setBatchForm({ slug: b.slug, title: b.title, description: b.description, imageUrl: b.imageUrl, price: b.price, order: b.order, isActive: b.isActive });
    setBatchImageMode('url');
    setBatchDialogOpen(true);
  };

  const handleBatchImageFile = async (file) => {
    setBatchImageUploading(true);
    try {
      const url = await uploadFile(file);
      setBatchForm((p) => ({ ...p, imageUrl: url }));
      showSnackbar('Image uploaded!');
    } catch (err) {
      showSnackbar('Upload failed', 'error');
    } finally {
      setBatchImageUploading(false);
    }
  };

  const saveBatch = async () => {
    if (!batchForm.title || !batchForm.description || !batchForm.imageUrl) {
      showSnackbar('Title, Description and Image are required', 'error'); return;
    }
    const slug = editingBatch ? editingBatch.slug : (batchForm.slug || slugify(batchForm.title));
    const payload = { ...batchForm, slug, price: Number(batchForm.price), order: Number(batchForm.order) };

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
    } catch (err) {
      showSnackbar(err.message || 'Failed to save batch', 'error');
    }
  };

  const toggleBatch = async (id) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/notes/admin/batches/${id}/toggle`, 'PATCH');
      fetchBatches();
    } catch (err) { showSnackbar('Failed to toggle batch', 'error'); }
  };

  const deleteBatch = async (id) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/notes/admin/batches/${id}`, 'DELETE');
      showSnackbar('Batch deleted');
      fetchBatches();
    } catch (err) { showSnackbar('Failed to delete batch', 'error'); }
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
    } catch (err) {
      showSnackbar(err.message || 'Failed to save subject', 'error');
    }
  };

  const toggleSubject = async (id) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/notes/admin/subjects/${id}/toggle`, 'PATCH');
      refreshSubjects();
    } catch (err) { showSnackbar('Failed to toggle subject', 'error'); }
  };

  const deleteSubject = async (id) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/notes/admin/subjects/${id}`, 'DELETE');
      showSnackbar('Subject deleted');
      refreshSubjects();
    } catch (err) { showSnackbar('Failed to delete subject', 'error'); }
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
    } catch (err) {
      showSnackbar('Upload failed', 'error');
    } finally {
      setUploadingField(null);
    }
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
    } catch (err) {
      showSnackbar(err.message || 'Failed to save chapter', 'error');
    }
  };

  const toggleChapter = async (id) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/notes/admin/chapters/${id}/toggle`, 'PATCH');
      refreshChapters();
    } catch (err) { showSnackbar('Failed to toggle chapter', 'error'); }
  };

  const deleteChapter = async (id) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/notes/admin/chapters/${id}`, 'DELETE');
      showSnackbar('Chapter deleted');
      refreshChapters();
    } catch (err) { showSnackbar('Failed to delete chapter', 'error'); }
    setDeleteConfirm(null);
  };

  // ═══════════════════ HEADER TEXT PER VIEW ═══════════════════
  const headerTitle = view === 'batches' ? 'Batches'
    : view === 'subjects' ? `${selectedBatch?.title} — Subjects`
    : `${selectedSubject?.name} — Chapters`;
  const headerSubtitle = view === 'batches' ? 'Free-form batches — no folder/slot restriction'
    : view === 'subjects' ? 'Subjects inside this batch'
    : 'Chapters with Mindmap / Short Notes / Complete Notes / Video';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .admin-card { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease !important; }
        .admin-card:hover { transform: translateY(-4px) !important; box-shadow: 0 18px 48px rgba(0,0,0,0.10) !important; }
      `}</style>

      <Fade in timeout={500}>
        <Box sx={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 11, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5 }}>Admin Panel</Typography>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 26, sm: 32 }, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-1px" }}>
              Notes Manager
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#aaa", mt: 0.8 }}>
              Batches → Subjects → Chapters — standalone, independent of your 5 batch folders.
            </Typography>
          </Box>

          <Box className="admin-card" sx={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 2.5, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "13px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {view === 'batches' ? <Inventory2Icon sx={{ color: "#fff", fontSize: 19 }} /> : <MenuBookIcon sx={{ color: "#fff", fontSize: 19 }} />}
              </Box>
              <Box sx={{ flex: 1, minWidth: 180 }}>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#1a1a2e" }}>{headerTitle}</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>{headerSubtitle}</Typography>
              </Box>

              {view === 'chapters' && (
                <Button size="small" startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 12 }} />} onClick={() => setView('subjects')}
                  sx={{ textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, color: '#888' }}>
                  Subjects
                </Button>
              )}
              {view !== 'batches' && (
                <Button size="small" startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 12 }} />} onClick={() => setView('batches')}
                  sx={{ textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, color: '#888' }}>
                  Batches
                </Button>
              )}

              <Button
                startIcon={<AddIcon />}
                onClick={view === 'batches' ? openAddBatch : view === 'subjects' ? openAddSubject : openAddChapter}
                sx={{ ...darkButtonSx, py: 1, px: 2.2 }}
              >
                {view === 'batches' ? 'Add Batch' : view === 'subjects' ? 'Add Subject' : 'Add Chapter'}
              </Button>
            </Box>

            {/* ── BATCHES LIST ── */}
            {view === 'batches' && (
              batches.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, background: '#fafafa', borderRadius: '14px', border: '1px dashed #e8e8e8' }}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#ccc' }}>No batches yet — add one to get started.</Typography>
                </Box>
              ) : (
                batches.map((b) => (
                  <Box key={b._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.8, mb: 1.3, background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px' }}>
                    <Box component="img" src={b.imageUrl} alt={b.title} sx={{ width: 44, height: 44, borderRadius: '10px', objectFit: 'cover', border: '1px solid #eee', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => openBatchSubjects(b)}>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14.5, color: '#1a1a2e' }}>{b.title}</Typography>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: '#aaa' }}>{b.description}</Typography>
                    </Box>
                    <Chip label={b.price === 0 ? 'FREE' : `₹${b.price}`} size="small"
                      sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, borderRadius: '8px', background: b.price === 0 ? '#e8f5e9' : '#f4f4f6', color: b.price === 0 ? '#2e7d32' : '#555' }} />
                    <Chip label={b.isActive ? 'Active' : 'Inactive'} size="small" onClick={() => toggleBatch(b._id)}
                      sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: '8px', background: b.isActive ? '#1a1a2e' : '#f0f0f0', color: b.isActive ? '#fff' : '#999' }} />
                    <Button size="small" onClick={() => openBatchSubjects(b)}
                      sx={{ textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, color: '#1a1a2e', background: '#f4f4f6', borderRadius: '10px', px: 1.6 }}>
                      Subjects →
                    </Button>
                    <IconButton size="small" onClick={() => openEditBatch(b)} sx={{ color: '#aaa', '&:hover': { color: '#1a1a2e', background: '#f4f4f6' } }}>
                      <EditIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteConfirm({ type: 'batch', item: b })} sx={{ color: '#ccc', '&:hover': { color: '#e53935', background: '#fff0f0' } }}>
                      <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Box>
                ))
              )
            )}

            {/* ── SUBJECTS LIST ── */}
            {view === 'subjects' && (
              subjects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, background: '#fafafa', borderRadius: '14px', border: '1px dashed #e8e8e8' }}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#ccc' }}>No subjects yet in this batch.</Typography>
                </Box>
              ) : (
                subjects.map((s) => (
                  <Box key={s._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.8, mb: 1.3, background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px' }}>
                    <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => openSubjectChapters(s)}>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14.5, color: '#1a1a2e' }}>{s.name}</Typography>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: '#aaa' }}>{s.description}</Typography>
                    </Box>
                    <Chip label={s.isActive ? 'Active' : 'Inactive'} size="small" onClick={() => toggleSubject(s._id)}
                      sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: '8px', background: s.isActive ? '#1a1a2e' : '#f0f0f0', color: s.isActive ? '#fff' : '#999' }} />
                    <Button size="small" onClick={() => openSubjectChapters(s)}
                      sx={{ textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, color: '#1a1a2e', background: '#f4f4f6', borderRadius: '10px', px: 1.6 }}>
                      Chapters →
                    </Button>
                    <IconButton size="small" onClick={() => openEditSubject(s)} sx={{ color: '#aaa', '&:hover': { color: '#1a1a2e', background: '#f4f4f6' } }}>
                      <EditIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteConfirm({ type: 'subject', item: s })} sx={{ color: '#ccc', '&:hover': { color: '#e53935', background: '#fff0f0' } }}>
                      <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Box>
                ))
              )
            )}

            {/* ── CHAPTERS LIST ── */}
            {view === 'chapters' && (
              chapters.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, background: '#fafafa', borderRadius: '14px', border: '1px dashed #e8e8e8' }}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#ccc' }}>No chapters yet for this subject.</Typography>
                </Box>
              ) : (
                chapters.map((ch) => (
                  <Box key={ch._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.8, mb: 1.3, background: ch.isActive ? '#fff' : '#fafafa', border: '1px solid #f0f0f0', borderRadius: '14px', opacity: ch.isActive ? 1 : 0.6 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14.5, color: '#1a1a2e' }}>{ch.title}</Typography>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: '#bbb' }}>/{ch.slug}</Typography>
                    </Box>
                    <Chip label={ch.isActive ? 'Active' : 'Inactive'} size="small" onClick={() => toggleChapter(ch._id)}
                      sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: '8px', background: ch.isActive ? '#1a1a2e' : '#f0f0f0', color: ch.isActive ? '#fff' : '#999' }} />
                    <IconButton size="small" onClick={() => openEditChapter(ch)} sx={{ color: '#aaa', '&:hover': { color: '#1a1a2e', background: '#f4f4f6' } }}>
                      <EditIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteConfirm({ type: 'chapter', item: ch })} sx={{ color: '#ccc', '&:hover': { color: '#e53935', background: '#fff0f0' } }}>
                      <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Box>
                ))
              )
            )}
          </Box>
        </Box>
      </Fade>

      {/* ── ADD/EDIT BATCH DIALOG ── */}
      <Dialog open={batchDialogOpen} onClose={() => setBatchDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', fontFamily: "'DM Sans', sans-serif" } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: '#1a1a2e', borderBottom: '1px solid #f0f0f0' }}>
          {editingBatch ? 'Edit Batch' : 'Add Batch'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField label="Title *" value={batchForm.title}
              onChange={(e) => setBatchForm((p) => ({ ...p, title: e.target.value }))} fullWidth sx={fieldSx} />
            {!editingBatch && (
              <TextField label="Slug" value={batchForm.slug}
                onChange={(e) => setBatchForm((p) => ({ ...p, slug: e.target.value }))} fullWidth
                helperText="Leave blank to auto-generate from title" sx={fieldSx} />
            )}
            <TextField label="Description *" value={batchForm.description}
              onChange={(e) => setBatchForm((p) => ({ ...p, description: e.target.value }))} fullWidth multiline rows={2} sx={fieldSx} />

            <FilePicker label="Image *" value={batchForm.imageUrl} accept="image/*" showImagePreview
              onChangeValue={(v) => setBatchForm((p) => ({ ...p, imageUrl: v }))}
              mode={batchImageMode} onModeChange={setBatchImageMode}
              uploading={batchImageUploading} onFileSelected={handleBatchImageFile} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Price (₹)" type="number" value={batchForm.price}
                onChange={(e) => setBatchForm((p) => ({ ...p, price: e.target.value }))} fullWidth
                helperText="0 = FREE" sx={fieldSx} />
              <TextField label="Order" type="number" value={batchForm.order}
                onChange={(e) => setBatchForm((p) => ({ ...p, order: e.target.value }))} fullWidth sx={fieldSx} />
            </Box>

            <FormControlLabel
              control={<Switch checked={batchForm.isActive}
                onChange={(e) => setBatchForm((p) => ({ ...p, isActive: e.target.checked }))}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a1a2e" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#1a1a2e" } }} />}
              label="Active (visible to students)"
              sx={{ "& .MuiFormControlLabel-label": { fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: '#555' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => setBatchDialogOpen(false)} sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: 'none', color: '#888' }}>Cancel</Button>
          <Button variant="contained" onClick={saveBatch} sx={{ ...darkButtonSx, py: 1, px: 2.5 }}>
            {editingBatch ? 'Update Batch' : 'Add Batch'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── ADD/EDIT SUBJECT DIALOG ── */}
      <Dialog open={subjectDialogOpen} onClose={() => setSubjectDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', fontFamily: "'DM Sans', sans-serif" } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: '#1a1a2e', borderBottom: '1px solid #f0f0f0' }}>
          {editingSubject ? 'Edit Subject' : 'Add Subject'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Subject Name *" value={subjectForm.name}
              onChange={(e) => setSubjectForm((p) => ({ ...p, name: e.target.value }))} fullWidth sx={fieldSx} />
            <TextField label="Slug *" value={subjectForm.slug}
              onChange={(e) => setSubjectForm((p) => ({ ...p, slug: e.target.value }))} fullWidth
              disabled={!!editingSubject}
              helperText={editingSubject ? "Can't change after creation" : 'e.g. "physics"'}
              sx={fieldSx} />
            <TextField label="Description" value={subjectForm.description}
              onChange={(e) => setSubjectForm((p) => ({ ...p, description: e.target.value }))} fullWidth multiline rows={2} sx={fieldSx} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => setSubjectDialogOpen(false)} sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: 'none', color: '#888' }}>Cancel</Button>
          <Button variant="contained" onClick={saveSubject} sx={{ ...darkButtonSx, py: 1, px: 2.5 }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ── ADD/EDIT CHAPTER DIALOG ── */}
      <Dialog open={chapterDialogOpen} onClose={() => setChapterDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', fontFamily: "'DM Sans', sans-serif" } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: '#1a1a2e', borderBottom: '1px solid #f0f0f0' }}>
          {editingChapter ? 'Edit Chapter' : 'Add Chapter'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField label="Chapter Title *" value={chapterForm.title}
              onChange={(e) => setChapterForm((p) => ({ ...p, title: e.target.value }))} fullWidth sx={fieldSx} />

            <FilePicker label="Mindmap PDF" value={chapterForm.mindmapUrl} accept="application/pdf"
              onChangeValue={(v) => setChapterForm((p) => ({ ...p, mindmapUrl: v }))}
              mode={mindmapMode} onModeChange={setMindmapMode}
              uploading={uploadingField === 'mindmapUrl'} onFileSelected={(f) => handleChapterFileSelected('mindmapUrl', f)} />

            <FilePicker label="Short Notes PDF" value={chapterForm.shortNotesUrl} accept="application/pdf"
              onChangeValue={(v) => setChapterForm((p) => ({ ...p, shortNotesUrl: v }))}
              mode={shortNotesMode} onModeChange={setShortNotesMode}
              uploading={uploadingField === 'shortNotesUrl'} onFileSelected={(f) => handleChapterFileSelected('shortNotesUrl', f)} />

            <FilePicker label="Complete Notes PDF" value={chapterForm.completeNotesUrl} accept="application/pdf"
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
                sx={{ whiteSpace: 'nowrap', "& .MuiFormControlLabel-label": { fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: '#555' } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => setChapterDialogOpen(false)} sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: 'none', color: '#888' }}>Cancel</Button>
          <Button variant="contained" onClick={saveChapter} sx={{ ...darkButtonSx, py: 1, px: 2.5 }}>
            {editingChapter ? 'Update Chapter' : 'Add Chapter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DELETE CONFIRM ── */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} PaperProps={{ sx: { borderRadius: '20px', fontFamily: "'DM Sans', sans-serif" } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: '#1a1a2e', borderBottom: '1px solid #f0f0f0' }}>
          Delete {deleteConfirm?.type === 'batch' ? 'Batch' : deleteConfirm?.type === 'subject' ? 'Subject' : 'Chapter'}?
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#333' }}>
            {deleteConfirm?.type === 'batch'
              ? `Delete "${deleteConfirm.item.title}"? Its subjects/chapters remain in the database but become unreachable.`
              : deleteConfirm?.type === 'subject'
              ? `Delete "${deleteConfirm.item.name}"? Its chapters remain in the database but become unreachable.`
              : `Delete "${deleteConfirm?.item?.title}"? This cannot be undone.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: 'none', color: '#888' }}>Cancel</Button>
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
        <Alert severity={snackbar.severity} sx={{ fontFamily: "'DM Sans', sans-serif", borderRadius: '12px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default NotesManager;