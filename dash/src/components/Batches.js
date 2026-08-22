import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Switch,
  FormControlLabel, Chip, IconButton, Snackbar, Alert,
  Tooltip, Fade,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LayersIcon from '@mui/icons-material/Layers';
import CodeIcon from '@mui/icons-material/Code';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { makeAuthenticatedRequest } from './makeauth'; // adjust path
import server from '../environment';                 // adjust path

// ─────────────────────────────────────────────────────────────
// FOLDER STRUCTURE — the single source of truth for where a
// batch is allowed to live. Each folder maps to one real page/
// route in the app; each sub-course is a FIXED slot id that your
// frontend already keys content off of (subjects[id], etc).
//
// Admin flow: pick Folder → pick Slot → batchId auto-locks to
// that slot's id. There is no free-text ID field anymore, so a
// batch can't accidentally end up on the wrong page.
// ─────────────────────────────────────────────────────────────
const FOLDER_STRUCTURE = {
  'IIT JEE': {
    route: '/pre',
    tagline: 'Premium Batches',
    icon: AutoAwesomeIcon,
    slots: [
      { id: '1',  title: 'Class 10' },
      { id: '2',  title: 'Class 11 (Jee + Boards)' },
      { id: '3',  title: 'Class 12 (Jee + Boards)' },
      { id: '14', title: 'Handwritten Notes' },
    ],
  },
  'Jee Mains': {
    route: '/cou',
    tagline: 'All Courses',
    icon: LayersIcon,
    slots: [
      { id: '10',  title: 'Class 10' },
      { id: '11',  title: 'Class 11 (Jee + Boards)' },
      { id: '12',  title: 'Class 12 (Jee + Boards)' },
      { id: '111', title: 'Class 11 (Neet + Boards)' },
      { id: '121', title: 'Class 12 (Neet + Boards)' },
    ],
  },
  'Tech': {
    route: '/dsac',
    tagline: 'DSA & Algorithms',
    icon: CodeIcon,
    slots: [
      { id: 'dsa',           title: 'DSA Sheet' },
      { id: 'web',           title: 'Web Development' },
      { id: 'data-analysis', title: 'Data Analysis' },
      { id: 'aptitude',      title: 'Aptitude Preparation' },
    ],
  },
  'CDS': {
    route: '/rev',
    tagline: 'Revision Batch',
    icon: MilitaryTechIcon,
    slots: [
      { id: '31', title: 'Common Defence Service' },
      { id: '32', title: 'SSB Interview' },
    ],
  },
  'College': {
    route: '/col',
    tagline: 'University Prep',
    icon: AccountBalanceIcon,
    slots: [
      { id: '7',  title: 'Civil Engineering' },
      { id: '8',  title: 'Electronics Engineering' },
      { id: '9',  title: 'Electrical Engineering' },
      { id: '13', title: 'Computer Engineering' },
    ],
  },
};

const FOLDER_NAMES = Object.keys(FOLDER_STRUCTURE);

// helper: find which folder a given batchId currently belongs to (for edit mode)
const findFolderForBatchId = (batchId) => {
  for (const folder of FOLDER_NAMES) {
    if (FOLDER_STRUCTURE[folder].slots.some(s => s.id === batchId)) return folder;
  }
  return '';
};

// ─────────────────────────────────────────────────────────────
// Default empty form state
// ─────────────────────────────────────────────────────────────
const emptyForm = {
  folder: '',
  batchId: '',      // locked — equals the selected slot's id
  title: '',
  description: '',
  imageUrl: '',
  screenshot: '',
  price: 0,
  redirectPath: '',
  whatYouLearn: '',   // comma separated in form, converted to array on save
  examFocus: '',      // comma separated, e.g. JEE Main, JEE Advanced
  targetAudience: '',
  includedFeatures: '', // one feature per line
  isActive: true,
  sortOrder: 0,
};

// ── shared field styling helper (matches AdminDashboard inputs) ──
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    background: "#fff",
    "& fieldset": { borderColor: "#e8e8e8" },
    "&:hover fieldset": { borderColor: "#c0c0c0" },
    "&.Mui-focused fieldset": { borderColor: "#1a1a2e" },
  },
  "& .MuiInputLabel-root": { fontFamily: "'DM Sans', sans-serif", fontSize: 14 },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1a1a2e" },
};

const darkButtonSx = {
  background: "#1a1a2e",
  borderRadius: "14px",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 700,
  fontSize: 14,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": { background: "#2d2d4e", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" },
  transition: "all 0.2s ease",
};

// ─────────────────────────────────────────────────────────────
// ImagePicker — toggle between pasting a path/URL and uploading
// a file manually. Compact enough to sit in a single grid column
// exactly where the old plain TextField used to be.
// ─────────────────────────────────────────────────────────────
const ImagePicker = ({ label, value, onChangeValue, mode, onModeChange, uploading, onFileSelected, placeholder }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.7 }}>
      <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 700, color: "#888" }}>{label}</Typography>
      <Box sx={{ ml: 'auto', display: 'flex', background: '#f4f4f6', borderRadius: '9px', p: 0.35 }}>
        <Box
          onClick={() => onModeChange('url')}
          sx={{
            px: 1.4, py: 0.35, borderRadius: '7px', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
            background: mode === 'url' ? '#1a1a2e' : 'transparent',
            color: mode === 'url' ? '#fff' : '#999',
            transition: 'all 0.18s ease',
          }}
        >
          Link
        </Box>
        <Box
          onClick={() => onModeChange('upload')}
          sx={{
            px: 1.4, py: 0.35, borderRadius: '7px', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
            background: mode === 'upload' ? '#1a1a2e' : 'transparent',
            color: mode === 'upload' ? '#fff' : '#999',
            transition: 'all 0.18s ease',
          }}
        >
          Upload
        </Box>
      </Box>
    </Box>

    {mode === 'url' ? (
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        sx={fieldSx}
      />
    ) : (
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.2, p: 1.2,
        border: '1px dashed #e0e0e0', borderRadius: '14px', background: '#fafafa',
      }}>
        {value && (
          <Box
            component="img" src={value} alt="preview"
            sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee', flexShrink: 0 }}
          />
        )}
        <Button
          component="label" disabled={uploading}
          startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: '10px', textTransform: 'none', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 12.5, color: '#1a1a2e', background: '#fff',
            border: '1px solid #ddd', px: 1.6, py: 0.6, whiteSpace: 'nowrap',
            "&:hover": { borderColor: '#1a1a2e', background: '#f4f4f6' },
          }}
        >
          {uploading ? 'Uploading…' : (value ? 'Replace' : 'Choose File')}
          <input
            type="file" accept="image/*" hidden
            onChange={(e) => { if (e.target.files?.[0]) onFileSelected(e.target.files[0]); }}
          />
        </Button>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#bbb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || 'No file chosen'}
        </Typography>
      </Box>
    )}
  </Box>
);

// ─────────────────────────────────────────────────────────────
// BatchManager Component
// ─────────────────────────────────────────────────────────────
const BatchManager = () => {
  const [batches, setBatches] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null); // null = adding new
  const [form, setForm] = useState(emptyForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // batch to delete

  // ── image input mode: 'url' (paste a path) or 'upload' (pick a file) ──
  const [imageMode, setImageMode] = useState('url');
  const [imageUploading, setImageUploading] = useState(false);
  const [screenshotMode, setScreenshotMode] = useState('url');
  const [screenshotUploading, setScreenshotUploading] = useState(false);

  // ── FETCH ALL BATCHES (admin sees inactive too) ──
  const fetchBatches = async () => {
    try {
      const data = await makeAuthenticatedRequest(`${server}/api/batches/admin`);
      setBatches(data);
    } catch (err) {
      showSnackbar('Failed to load batches', 'error');
    }
  };

  useEffect(() => { fetchBatches(); }, []);

  // ── SNACKBAR HELPER ──
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ── OPEN ADD DIALOG ──
  const handleAdd = () => {
    setEditingBatch(null);
    setForm(emptyForm);
    setImageMode('url');
    setScreenshotMode('url');
    setDialogOpen(true);
  };

  // ── OPEN EDIT DIALOG ──
  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setForm({
      folder: batch.folder || findFolderForBatchId(batch.batchId),
      batchId: batch.batchId,
      title: batch.title,
      description: batch.description,
      imageUrl: batch.imageUrl,
      screenshot: batch.screenshot || '',
      price: batch.price,
      redirectPath: batch.redirectPath || '',
      whatYouLearn: (batch.whatYouLearn || []).join(', '),
      examFocus: (batch.examFocus || []).join(', '),
      targetAudience: batch.targetAudience || '',
      includedFeatures: (batch.includedFeatures || []).join('\n'),
      isActive: batch.isActive,
      sortOrder: batch.sortOrder || 0,
    });
    setImageMode('url');
    setScreenshotMode('url');
    setDialogOpen(true);
  };

  // ── SAVE (add or edit) ──
  const handleSave = async () => {
    if (!form.folder || !form.batchId || !form.title || !form.description || !form.imageUrl) {
      showSnackbar('Folder, Slot, Title, Description and Image URL are required', 'error');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
      whatYouLearn: form.whatYouLearn
        ? form.whatYouLearn.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      examFocus: form.examFocus
        ? form.examFocus.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      targetAudience: form.targetAudience.trim(),
      includedFeatures: form.includedFeatures
        ? form.includedFeatures.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingBatch) {
        await makeAuthenticatedRequest(
          `${server}/api/batches/admin/${editingBatch._id}`, 'PUT', payload
        );
        showSnackbar('Batch updated successfully!');
      } else {
        await makeAuthenticatedRequest(`${server}/api/batches/admin`, 'POST', payload);
        showSnackbar('Batch added successfully!');
      }
      setDialogOpen(false);
      fetchBatches();
    } catch (err) {
      showSnackbar(err.message || 'Failed to save batch', 'error');
    }
  };

  // ── TOGGLE ACTIVE/INACTIVE ──
  const handleToggle = async (batch) => {
    try {
      await makeAuthenticatedRequest(
        `${server}/api/batches/admin/${batch._id}/toggle`, 'PATCH'
      );
      showSnackbar(`Batch ${batch.isActive ? 'deactivated' : 'activated'}`);
      fetchBatches();
    } catch (err) {
      showSnackbar('Failed to toggle batch', 'error');
    }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    try {
      await makeAuthenticatedRequest(
        `${server}/api/batches/admin/${deleteConfirm._id}`, 'DELETE'
      );
      showSnackbar('Batch deleted successfully!');
      setDeleteConfirm(null);
      fetchBatches();
    } catch (err) {
      showSnackbar('Failed to delete batch', 'error');
    }
  };

  // ── FORM CHANGE HANDLER (generic fields) ──
  const handleFormChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // ── FOLDER CHANGE — reset slot/batchId since slots are folder-specific ──
  const handleFolderChange = (e) => {
    const folder = e.target.value;
    setForm(prev => ({ ...prev, folder, batchId: '', title: '' }));
  };

  // ── SLOT CHANGE — this is what actually locks batchId ──
  const handleSlotChange = (e) => {
    const slotId = e.target.value;
    const slot = FOLDER_STRUCTURE[form.folder]?.slots.find(s => s.id === slotId);
    setForm(prev => ({
      ...prev,
      batchId: slotId,
      // prefill title from the slot's default name, but only if admin
      // hasn't already typed a custom title
      title: prev.title ? prev.title : (slot ? slot.title : ''),
    }));
  };

  // ── UPLOAD an image file to the server, get back a usable path/URL ──
  // NOTE: this expects a backend endpoint POST /api/upload that accepts
  // multipart/form-data (field name "image") and responds { url: "..." }.
  // Uses fetch directly (not makeAuthenticatedRequest) since this needs
  // FormData rather than a JSON body.
  const uploadImageFile = async (file) => {
    const token = localStorage.getItem('token');
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${server}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleImageFileSelected = async (file) => {
    setImageUploading(true);
    try {
      const url = await uploadImageFile(file);
      setForm(prev => ({ ...prev, imageUrl: url }));
      showSnackbar('Image uploaded!');
    } catch (err) {
      showSnackbar('Image upload failed', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  const handleScreenshotFileSelected = async (file) => {
    setScreenshotUploading(true);
    try {
      const url = await uploadImageFile(file);
      setForm(prev => ({ ...prev, screenshot: url }));
      showSnackbar('Screenshot uploaded!');
    } catch (err) {
      showSnackbar('Screenshot upload failed', 'error');
    } finally {
      setScreenshotUploading(false);
    }
  };

  // available slots for the currently chosen folder
  const availableSlots = form.folder ? FOLDER_STRUCTURE[form.folder].slots : [];
  // when ADDING, hide slots that are already occupied by an existing batch
  const usedIds = new Set(batches.map(b => b.batchId));
  const selectableSlots = editingBatch
    ? availableSlots
    : availableSlots.filter(s => !usedIds.has(s.id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .admin-card { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease !important; }
        .admin-card:hover { transform: translateY(-4px) !important; box-shadow: 0 18px 48px rgba(0,0,0,0.10) !important; }
        .batch-row { transition: background 0.18s ease; }
        .batch-row:hover { background: #fafafa !important; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      <Fade in timeout={500}>
        <Box sx={{ fontFamily: "'DM Sans', sans-serif" }}>

          {/* ── Page header ── */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 4 }}>
            <Box>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 11, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", mb: 0.5 }}>Admin Panel</Typography>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: { xs: 26, sm: 32 }, color: "#1a1a2e", lineHeight: 1.1, letterSpacing: "-1px" }}>Batch Manager</Typography>
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#aaa", mt: 0.8 }}>Create and manage batches across all 5 folders.</Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleAdd}
              sx={{ ...darkButtonSx, py: 1.4, px: 3 }}
            >
              <AddIcon sx={{ fontSize: 20, mr: 0.8 }} /> Add New Batch
            </Button>
          </Box>

          {/* ── STATS STRIP ── */}
          <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
            {[
              { label: "Total Batches", value: batches.length, tag: "All folders" },
              { label: "Active",       value: batches.filter(b => b.isActive).length, tag: "Visible now" },
              {
                label: "Slots Filled",
                value: `${batches.length}/${FOLDER_NAMES.reduce((n, f) => n + FOLDER_STRUCTURE[f].slots.length, 0)}`,
                tag: "Across all folders",
              },
              { label: "Folders",      value: FOLDER_NAMES.length, tag: "Configured" },
            ].map(({ label, value, tag }) => (
              <Box key={label} className="admin-card" sx={{ flex: "1 1 140px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", p: 2.5, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#ccc", letterSpacing: "1.2px", textTransform: "uppercase", mb: 0.5 }}>{tag}</Typography>
                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 28, color: "#1a1a2e", lineHeight: 1 }}>{value}</Typography>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa", mt: 0.5 }}>{label}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── ONE SECTION PER FOLDER ── */}
          {FOLDER_NAMES.map((folderName, idx) => {
            const config = FOLDER_STRUCTURE[folderName];
            const FolderIcon = config.icon;
            const folderBatches = batches.filter(b => b.folder === folderName || config.slots.some(s => s.id === b.batchId));
            return (
              <Box key={folderName} sx={{ mb: idx === FOLDER_NAMES.length - 1 ? 0 : 3 }}>
                <SectionCard
                  icon={<FolderIcon sx={{ color: "#fff", fontSize: 19 }} />}
                  title={folderName}
                  subtitle={`${config.tagline} · ${config.route} · ${folderBatches.length}/${config.slots.length} slots filled`}
                >
                  <BatchTable
                    batches={folderBatches}
                    onEdit={handleEdit}
                    onToggle={handleToggle}
                    onDelete={(b) => setDeleteConfirm(b)}
                    showRedirect={folderName === 'Tech'}
                  />
                </SectionCard>
              </Box>
            );
          })}
        </Box>
      </Fade>

      {/* ── ADD / EDIT DIALOG ── */}
      <Dialog
        open={dialogOpen} onClose={() => setDialogOpen(false)}
        maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: "20px", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 32px 80px rgba(0,0,0,0.15)" } }}
      >
        <DialogTitle sx={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800,
          fontSize: 20, color: "#1a1a2e", pb: 1, borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", gap: 1.5,
        }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "11px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Inventory2Icon sx={{ color: "#fff", fontSize: 18 }} />
          </Box>
          {editingBatch ? 'Edit Batch' : 'Add New Batch'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>

            {/* ── STEP 1: Folder ── */}
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Folder *</InputLabel>
              <Select
                value={form.folder} label="Folder *"
                onChange={handleFolderChange}
                disabled={!!editingBatch}
              >
                {FOLDER_NAMES.map(f => (
                  <MenuItem key={f} value={f}>{f} — {FOLDER_STRUCTURE[f].tagline}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ── STEP 2: Slot (filtered by folder) ── */}
            <FormControl fullWidth sx={fieldSx} disabled={!form.folder}>
              <InputLabel>Slot *</InputLabel>
              <Select
                value={form.batchId} label="Slot *"
                onChange={handleSlotChange}
                disabled={!!editingBatch || !form.folder}
              >
                {selectableSlots.length === 0 && form.folder && (
                  <MenuItem value="" disabled>All slots in this folder are filled</MenuItem>
                )}
                {selectableSlots.map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.title} <Box component="span" sx={{ ml: 1, color: "#aaa", fontFamily: "monospace", fontSize: 12 }}>({s.id})</Box></MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ── locked batch id confirmation chip ── */}
            {form.batchId && (
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' }, display: "flex", alignItems: "center", gap: 1, mt: -1, mb: 0.5 }}>
                <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#aaa" }}>This batch will be saved as:</Typography>
                <Chip
                  label={`${form.folder} → ${form.batchId}`}
                  size="small"
                  sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: 11.5, background: "#1a1a2e", color: "#fff", borderRadius: "8px" }}
                />
              </Box>
            )}

            <TextField label="Title *" value={form.title}
              onChange={handleFormChange('title')} fullWidth sx={fieldSx} />

            <TextField label="Description *" value={form.description}
              onChange={handleFormChange('description')} fullWidth multiline rows={2}
              sx={{ gridColumn: { xs: '1', sm: '1 / -1' }, ...fieldSx }} />

            <Box>
              <ImagePicker
                label="Image *"
                value={form.imageUrl}
                onChangeValue={(v) => setForm(prev => ({ ...prev, imageUrl: v }))}
                mode={imageMode}
                onModeChange={setImageMode}
                uploading={imageUploading}
                onFileSelected={handleImageFileSelected}
                placeholder="/images/11.png"
              />
            </Box>

            <TextField label="Price (₹)" value={form.price} type="number"
              onChange={handleFormChange('price')} fullWidth
              helperText="0 = FREE" sx={fieldSx} />

            {form.folder === 'Tech' && (
              <>
                <Box>
                  <ImagePicker
                    label="Screenshot"
                    value={form.screenshot}
                    onChangeValue={(v) => setForm(prev => ({ ...prev, screenshot: v }))}
                    mode={screenshotMode}
                    onModeChange={setScreenshotMode}
                    uploading={screenshotUploading}
                    onFileSelected={handleScreenshotFileSelected}
                    placeholder="/images/dsa_files/dsass.png"
                  />
                </Box>

                <TextField label="Redirect Path" value={form.redirectPath}
                  onChange={handleFormChange('redirectPath')} fullWidth
                  helperText='e.g. /dsa, /web, /data-analysis' sx={fieldSx} />
              </>
            )}

            <TextField
              label="What You'll Learn"
              value={form.whatYouLearn}
              onChange={handleFormChange('whatYouLearn')}
              fullWidth multiline rows={4}
              sx={{ gridColumn: { xs: '1', sm: '1 / -1' }, ...fieldSx }}
              helperText="Enter points separated by commas"
            />

            <TextField
                  label="Exam Focus"
                  value={form.examFocus}
                  onChange={handleFormChange('examFocus')}
                  fullWidth
                  helperText="Comma separated, e.g. JEE Main, JEE Advanced"
                  sx={fieldSx}
                />

            <TextField
                  label="Target Audience"
                  value={form.targetAudience}
                  onChange={handleFormChange('targetAudience')}
                  fullWidth
                  helperText="Who should buy this batch?"
                  sx={fieldSx}
                />

            <TextField
                  label="Included Features"
                  value={form.includedFeatures}
                  onChange={handleFormChange('includedFeatures')}
                  fullWidth multiline rows={4}
                  helperText="One feature per line. The AI will use only these stated benefits."
                  sx={{ gridColumn: { xs: '1', sm: '1 / -1' }, ...fieldSx }}
            />

            <TextField label="Sort Order" value={form.sortOrder} type="number"
              onChange={handleFormChange('sortOrder')} fullWidth
              helperText="Lower number = shown first" sx={fieldSx} />

            <FormControlLabel
              sx={{ "& .MuiFormControlLabel-label": { fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555" } }}
              control={
                <Switch
                  checked={form.isActive}
                  onChange={handleFormChange('isActive')}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a1a2e" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#1a1a2e" },
                  }}
                />
              }
              label="Active (visible to students)"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: "1px solid #f0f0f0" }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, textTransform: "none", color: "#888", borderRadius: "14px", px: 2.5 }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} sx={{ ...darkButtonSx, py: 1.2, px: 3 }}>
            {editingBatch ? 'Update Batch' : 'Add Batch'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DELETE CONFIRM DIALOG ── */}
      <Dialog
        open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}
        PaperProps={{ sx: { borderRadius: "20px", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 32px 80px rgba(0,0,0,0.15)" } }}
      >
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 19, color: "#1a1a2e", pb: 1, borderBottom: "1px solid #f0f0f0" }}>
          Delete Batch?
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#333", lineHeight: 1.7 }}>
            Are you sure you want to permanently delete <strong>{deleteConfirm?.title}</strong>? This cannot be undone.
          </Typography>
          <Box sx={{ mt: 2, p: 1.8, borderRadius: "12px", background: "#f4f4f6" }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#888" }}>
              Tip: use "Deactivate" instead to hide a batch without deleting it. Deleting frees up its slot for re-use.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: "1px solid #f0f0f0" }}>
          <Button
            onClick={() => setDeleteConfirm(null)}
            sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, textTransform: "none", color: "#888", borderRadius: "14px", px: 2.5 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              background: "#e53935", borderRadius: "14px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: 14, py: 1.2, px: 3, textTransform: "none", boxShadow: "none",
              "&:hover": { background: "#c62828", boxShadow: "0 8px 24px rgba(229,57,53,0.25)" },
              transition: "all 0.2s ease",
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── SNACKBAR ── */}
      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert
          severity={snackbar.severity}
          sx={{ fontFamily: "'DM Sans', sans-serif", borderRadius: "12px", width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// SectionCard — wraps each table in the grey/white card shell
// ─────────────────────────────────────────────────────────────
const SectionCard = ({ icon, title, subtitle, children }) => (
  <Box className="admin-card" sx={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "20px", p: { xs: 2.5, sm: 3.5 }, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
      <Box sx={{ width: 40, height: 40, borderRadius: "13px", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: "-0.3px" }}>{title}</Typography>
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa" }}>{subtitle}</Typography>
      </Box>
    </Box>
    {children}
  </Box>
);

// ─────────────────────────────────────────────────────────────
// Reusable BatchTable sub-component — grey/white restyle
// ─────────────────────────────────────────────────────────────
const BatchTable = ({ batches, onEdit, onToggle, onDelete, showRedirect = false }) => {
  const headCellSx = {
    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
    color: "#aaa", letterSpacing: "0.8px", textTransform: "uppercase",
    borderBottom: "1px solid #f0f0f0", py: 1.4,
  };
  const cellSx = {
    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#333",
    borderBottom: "1px solid #f4f4f6", py: 1.4,
  };

  if (batches.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 5, background: "#fafafa", borderRadius: "14px", border: "1px dashed #e8e8e8" }}>
        <Inventory2Icon sx={{ fontSize: 40, color: "#e0e0e0", mb: 1 }} />
        <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#ccc" }}>
          No batches yet in this folder — click "Add New Batch" to fill a slot.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: "auto", borderRadius: "14px", border: "1px solid #f0f0f0" }}>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
        <Box component="thead">
          <Box component="tr" sx={{ background: "#fafafa" }}>
            <Box component="th" sx={{ ...headCellSx, textAlign: "left", pl: 2 }}>Slot ID</Box>
            <Box component="th" sx={{ ...headCellSx, textAlign: "left" }}>Title</Box>
            <Box component="th" sx={{ ...headCellSx, textAlign: "left" }}>Price</Box>
            {showRedirect && <Box component="th" sx={{ ...headCellSx, textAlign: "left" }}>Redirect</Box>}
            <Box component="th" sx={{ ...headCellSx, textAlign: "left" }}>Order</Box>
            <Box component="th" sx={{ ...headCellSx, textAlign: "left" }}>Status</Box>
            <Box component="th" sx={{ ...headCellSx, textAlign: "center", pr: 2 }}>Actions</Box>
          </Box>
        </Box>
        <Box component="tbody">
          {batches.map((batch) => (
            <Box component="tr" key={batch._id} className="batch-row" sx={{ opacity: batch.isActive ? 1 : 0.5 }}>
              <Box component="td" sx={{ ...cellSx, pl: 2 }}>
                <Typography sx={{ fontFamily: "monospace", fontSize: 12.5, fontWeight: 700, color: "#555" }}>
                  {batch.batchId}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...cellSx, fontWeight: 600 }}>{batch.title}</Box>
              <Box component="td" sx={cellSx}>
                <Chip
                  label={batch.price === 0 ? 'FREE' : `₹${batch.price}`}
                  size="small"
                  sx={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, borderRadius: "8px",
                    background: batch.price === 0 ? "#e8f5e9" : "#f4f4f6",
                    color: batch.price === 0 ? "#2e7d32" : "#555",
                  }}
                />
              </Box>
              {showRedirect && (
                <Box component="td" sx={cellSx}>
                  <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#aaa" }}>
                    {batch.redirectPath || '—'}
                  </Typography>
                </Box>
              )}
              <Box component="td" sx={cellSx}>{batch.sortOrder}</Box>
              <Box component="td" sx={cellSx}>
                <Chip
                  label={batch.isActive ? 'Active' : 'Inactive'}
                  onClick={() => onToggle(batch)}
                  size="small"
                  sx={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, borderRadius: "8px",
                    cursor: "pointer",
                    background: batch.isActive ? "#1a1a2e" : "#f0f0f0",
                    color: batch.isActive ? "#fff" : "#999",
                    "&:hover": { background: batch.isActive ? "#2d2d4e" : "#e5e5e5" },
                  }}
                />
              </Box>
              <Box component="td" sx={{ ...cellSx, textAlign: "center", pr: 1.5 }}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small" onClick={() => onEdit(batch)}
                    sx={{ color: "#aaa", borderRadius: "8px", p: 0.7, mr: 0.5, "&:hover": { color: "#1a1a2e", background: "#f4f4f6" }, transition: "all 0.18s ease" }}
                  >
                    <EditIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small" onClick={() => onDelete(batch)}
                    sx={{ color: "#ccc", borderRadius: "8px", p: 0.7, "&:hover": { color: "#e53935", background: "#fff0f0" }, transition: "all 0.18s ease" }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BatchManager;
