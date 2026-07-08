import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Chip, Switch, FormControlLabel, Tooltip, Snackbar, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { makeAuthenticatedRequest } from './makeauth'; // adjust path
import server from '../environment';                 // adjust path

// ── shared styling (matches Batch Manager) ──
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

const emptySubjectForm = { slug: '', name: '', description: '', order: 0 };
const emptyChapterForm = {
  slug: '', title: '', mindmapUrl: '', shortNotesUrl: '', completeNotesUrl: '',
  videoUrl: '', videoComingSoon: true, order: 0, isActive: true,
};

// ─────────────────────────────────────────────────────────────
// FilePicker — Link / Upload toggle for a PDF (or any file) URL.
// Same pattern as the image picker used elsewhere, but shows a
// document icon + filename instead of an image thumbnail.
// ─────────────────────────────────────────────────────────────
const FilePicker = ({ label, value, onChangeValue, mode, onModeChange, uploading, onFileSelected }) => (
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
        placeholder="https://... or /pdfs/chapter.pdf" sx={fieldSx} />
    ) : (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, p: 1.2, border: '1px dashed #e0e0e0', borderRadius: '14px', background: '#fafafa' }}>
        {value && <DescriptionOutlinedIcon sx={{ color: '#1a1a2e', fontSize: 26, flexShrink: 0 }} />}
        <Button component="label" disabled={uploading} startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
          sx={{ borderRadius: '10px', textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, color: '#1a1a2e', background: '#fff', border: '1px solid #ddd', px: 1.6, py: 0.6, whiteSpace: 'nowrap', "&:hover": { borderColor: '#1a1a2e', background: '#f4f4f6' } }}>
          {uploading ? 'Uploading…' : (value ? 'Replace' : 'Choose File')}
          <input type="file" accept="application/pdf" hidden onChange={(e) => { if (e.target.files?.[0]) onFileSelected(e.target.files[0]); }} />
        </Button>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#bbb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || 'No file chosen'}
        </Typography>
      </Box>
    )}
  </Box>
);

// ─────────────────────────────────────────────────────────────
// BatchContentManager — the main dialog
// ─────────────────────────────────────────────────────────────
const BatchContentManager = ({ open, onClose, batch, onBatchUpdated }) => {
  const [view, setView] = useState('subjects'); // 'subjects' | 'chapters'
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null); // {slug, name}

  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState(emptySubjectForm);
  const [editingSubjectSlug, setEditingSubjectSlug] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [chapterForm, setChapterForm] = useState(emptyChapterForm);
  const [editingChapter, setEditingChapter] = useState(null);

  const [mindmapMode, setMindmapMode] = useState('url');
  const [shortNotesMode, setShortNotesMode] = useState('url');
  const [completeNotesMode, setCompleteNotesMode] = useState('url');
  const [uploadingField, setUploadingField] = useState(null); // which field is currently uploading

  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'subject'|'chapter', item }
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // reset local state whenever a new batch is opened
  useEffect(() => {
    if (batch) {
      setSubjects(batch.subjects || []);
      setView('subjects');
      setSelectedSubject(null);
    }
  }, [batch, open]);

  // ── SUBJECTS: save the whole array back onto the batch document ──
  const persistSubjects = async (updated) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/admin/batches/${batch._id}`, 'PUT', { subjects: updated });
      setSubjects(updated);
      onBatchUpdated && onBatchUpdated();
      showSnackbar('Subjects updated!');
    } catch (err) {
      showSnackbar(err.message || 'Failed to update subjects', 'error');
    }
  };

  const openAddSubject = () => { setEditingSubjectSlug(null); setSubjectForm(emptySubjectForm); setSubjectDialogOpen(true); };
  const openEditSubject = (s) => { setEditingSubjectSlug(s.slug); setSubjectForm(s); setSubjectDialogOpen(true); };

  const saveSubject = async () => {
    if (!subjectForm.name) { showSnackbar('Subject name is required', 'error'); return; }
    const slug = editingSubjectSlug || slugify(subjectForm.name);
    const entry = { ...subjectForm, slug };

    let updated;
    if (editingSubjectSlug) {
      updated = subjects.map((s) => (s.slug === editingSubjectSlug ? entry : s));
    } else {
      if (subjects.some((s) => s.slug === slug)) { showSnackbar('A subject with this name already exists', 'error'); return; }
      updated = [...subjects, entry];
    }
    await persistSubjects(updated);
    setSubjectDialogOpen(false);
  };

  const deleteSubject = async (slug) => {
    const updated = subjects.filter((s) => s.slug !== slug);
    await persistSubjects(updated);
    setDeleteConfirm(null);
  };

  // ── CHAPTERS: fetch when a subject is selected ──
  const openSubjectChapters = async (subject) => {
    setSelectedSubject(subject);
    setView('chapters');
    try {
      const data = await makeAuthenticatedRequest(
        `${server}/api/chapters/admin?batchId=${encodeURIComponent(batch.batchId)}&subject=${encodeURIComponent(subject.slug)}`
      );
      setChapters(data);
    } catch (err) {
      showSnackbar('Failed to load chapters', 'error');
    }
  };

  const refreshChapters = async () => {
    if (!selectedSubject) return;
    try {
      const data = await makeAuthenticatedRequest(
        `${server}/api/chapters/admin?batchId=${encodeURIComponent(batch.batchId)}&subject=${encodeURIComponent(selectedSubject.slug)}`
      );
      setChapters(data);
    } catch (err) {
      showSnackbar('Failed to refresh chapters', 'error');
    }
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
      videoUrl: ch.videoUrl || '', videoComingSoon: ch.videoComingSoon, order: ch.order || 0, isActive: ch.isActive,
    });
    setMindmapMode('url'); setShortNotesMode('url'); setCompleteNotesMode('url');
    setChapterDialogOpen(true);
  };

  const uploadFile = async (file) => {
    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${server}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleFileSelected = async (field, file) => {
    setUploadingField(field);
    try {
      const url = await uploadFile(file);
      setChapterForm((prev) => ({ ...prev, [field]: url }));
      showSnackbar('File uploaded!');
    } catch (err) {
      showSnackbar('Upload failed', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const saveChapter = async () => {
    if (!chapterForm.title) { showSnackbar('Chapter title is required', 'error'); return; }
    const slug = editingChapter ? editingChapter.slug : slugify(chapterForm.title);
    const payload = { ...chapterForm, slug, batchId: batch.batchId, subjectSlug: selectedSubject.slug };

    try {
      if (editingChapter) {
        await makeAuthenticatedRequest(`${server}/api/chapters/admin/${editingChapter._id}`, 'PUT', payload);
        showSnackbar('Chapter updated!');
      } else {
        await makeAuthenticatedRequest(`${server}/api/chapters/admin`, 'POST', payload);
        showSnackbar('Chapter added!');
      }
      setChapterDialogOpen(false);
      refreshChapters();
    } catch (err) {
      showSnackbar(err.message || 'Failed to save chapter', 'error');
    }
  };

  const deleteChapter = async (id) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/chapters/admin/${id}`, 'DELETE');
      showSnackbar('Chapter deleted');
      refreshChapters();
    } catch (err) {
      showSnackbar('Failed to delete chapter', 'error');
    }
    setDeleteConfirm(null);
  };

  const toggleChapter = async (id) => {
    try {
      await makeAuthenticatedRequest(`${server}/api/chapters/admin/${id}/toggle`, 'PATCH');
      refreshChapters();
    } catch (err) {
      showSnackbar('Failed to toggle chapter', 'error');
    }
  };

  if (!batch) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 32px 80px rgba(0,0,0,0.15)', minHeight: 520 } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 19, color: '#1a1a2e', pb: 1, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MenuBookIcon sx={{ color: '#fff', fontSize: 17 }} />
          </Box>
          {view === 'subjects' ? `Manage Content — ${batch.title}` : `${selectedSubject?.name} — Chapters`}
          {view === 'chapters' && (
            <Button size="small" startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 12 }} />} onClick={() => setView('subjects')}
              sx={{ ml: 'auto', textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12.5, color: '#888' }}>
              Subjects
            </Button>
          )}
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {/* ── SUBJECTS VIEW ── */}
          {view === 'subjects' && (
            <>
              <Button startIcon={<AddIcon />} onClick={openAddSubject} sx={{ ...darkButtonSx, mb: 2.5, py: 1, px: 2.2 }}>
                Add Subject
              </Button>

              {subjects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, background: '#fafafa', borderRadius: '14px', border: '1px dashed #e8e8e8' }}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#ccc' }}>
                    No subjects yet — add one to start building content.
                  </Typography>
                </Box>
              ) : (
                subjects.map((s) => (
                  <Box key={s.slug} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.8, mb: 1.3, background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px' }}>
                    <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => openSubjectChapters(s)}>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14.5, color: '#1a1a2e' }}>{s.name}</Typography>
                      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: '#aaa' }}>{s.description}</Typography>
                    </Box>
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
              )}
            </>
          )}

          {/* ── CHAPTERS VIEW ── */}
          {view === 'chapters' && (
            <>
              <Button startIcon={<AddIcon />} onClick={openAddChapter} sx={{ ...darkButtonSx, mb: 2.5, py: 1, px: 2.2 }}>
                Add Chapter
              </Button>

              {chapters.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, background: '#fafafa', borderRadius: '14px', border: '1px dashed #e8e8e8' }}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#ccc' }}>
                    No chapters yet for this subject.
                  </Typography>
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
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={onClose} sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, textTransform: 'none', color: '#888', borderRadius: '14px', px: 2.5 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── ADD/EDIT SUBJECT DIALOG ── */}
      <Dialog open={subjectDialogOpen} onClose={() => setSubjectDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: '20px', fontFamily: "'DM Sans', sans-serif" } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: '#1a1a2e', borderBottom: '1px solid #f0f0f0' }}>
          {editingSubjectSlug ? 'Edit Subject' : 'Add Subject'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Subject Name *" value={subjectForm.name}
              onChange={(e) => setSubjectForm((p) => ({ ...p, name: e.target.value }))} fullWidth sx={fieldSx} />
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

            <FilePicker label="Mindmap PDF" value={chapterForm.mindmapUrl}
              onChangeValue={(v) => setChapterForm((p) => ({ ...p, mindmapUrl: v }))}
              mode={mindmapMode} onModeChange={setMindmapMode}
              uploading={uploadingField === 'mindmapUrl'} onFileSelected={(f) => handleFileSelected('mindmapUrl', f)} />

            <FilePicker label="Short Notes PDF" value={chapterForm.shortNotesUrl}
              onChangeValue={(v) => setChapterForm((p) => ({ ...p, shortNotesUrl: v }))}
              mode={shortNotesMode} onModeChange={setShortNotesMode}
              uploading={uploadingField === 'shortNotesUrl'} onFileSelected={(f) => handleFileSelected('shortNotesUrl', f)} />

            <FilePicker label="Complete Notes PDF" value={chapterForm.completeNotesUrl}
              onChangeValue={(v) => setChapterForm((p) => ({ ...p, completeNotesUrl: v }))}
              mode={completeNotesMode} onModeChange={setCompleteNotesMode}
              uploading={uploadingField === 'completeNotesUrl'} onFileSelected={(f) => handleFileSelected('completeNotesUrl', f)} />

            <TextField label="Video URL" value={chapterForm.videoUrl}
              onChange={(e) => setChapterForm((p) => ({ ...p, videoUrl: e.target.value }))} fullWidth
              helperText="YouTube / hosted video link" sx={fieldSx} />

            <FormControlLabel
              control={<Switch checked={chapterForm.videoComingSoon}
                onChange={(e) => setChapterForm((p) => ({ ...p, videoComingSoon: e.target.checked }))}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a1a2e" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#1a1a2e" } }} />}
              label="Show as 'Coming Soon' (video not ready yet)"
              sx={{ "& .MuiFormControlLabel-label": { fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: '#555' } }}
            />

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
          Delete {deleteConfirm?.type === 'subject' ? 'Subject' : 'Chapter'}?
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#333' }}>
            {deleteConfirm?.type === 'subject'
              ? `Delete "${deleteConfirm.item.name}"? Its chapters will remain in the database but become unreachable from the Subjects page.`
              : `Delete "${deleteConfirm?.item?.title}"? This cannot be undone.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: 'none', color: '#888' }}>Cancel</Button>
          <Button variant="contained" onClick={() => deleteConfirm.type === 'subject' ? deleteSubject(deleteConfirm.item.slug) : deleteChapter(deleteConfirm.item._id)}
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

export default BatchContentManager;