import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Switch,
  FormControlLabel, Chip, IconButton, Snackbar, Alert,
  Divider, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { makeAuthenticatedRequest } from './makeauth'; // adjust path
import server from '../environment';                 // adjust path

// ─────────────────────────────────────────────────────────────
// Default empty form state
// ─────────────────────────────────────────────────────────────
const emptyForm = {
  batchId: '',
  title: '',
  description: '',
  imageUrl: '',
  screenshot: '',
  price: 0,
  pageType: 'classes',
  category: 'JEE',
  redirectPath: '',
  whatYouLearn: '',   // comma separated in form, converted to array on save
  isActive: true,
  sortOrder: 0,
};

const CATEGORIES = ['JEE', 'NEET', 'Boards', 'DSA', 'Web', 'DataAnalysis', 'Aptitude', 'Other'];

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
    setDialogOpen(true);
  };

  // ── OPEN EDIT DIALOG ──
  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setForm({
      batchId: batch.batchId,
      title: batch.title,
      description: batch.description,
      imageUrl: batch.imageUrl,
      screenshot: batch.screenshot || '',
      price: batch.price,
      pageType: batch.pageType,
      category: batch.category,
      redirectPath: batch.redirectPath || '',
      whatYouLearn: (batch.whatYouLearn || []).join(', '),
      isActive: batch.isActive,
      sortOrder: batch.sortOrder || 0,
    });
    setDialogOpen(true);
  };

  // ── SAVE (add or edit) ──
  const handleSave = async () => {
    // Basic validation
    if (!form.batchId || !form.title || !form.description || !form.imageUrl) {
      showSnackbar('Batch ID, Title, Description and Image URL are required', 'error');
      return;
    }

    // Convert whatYouLearn from comma string to array
    const payload = {
      ...form,
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
      whatYouLearn: form.whatYouLearn
        ? form.whatYouLearn.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingBatch) {
        // EDIT existing
        await makeAuthenticatedRequest(
          `${server}/api/batches/admin/${editingBatch._id}`, 'PUT', payload
        );
        showSnackbar('Batch updated successfully!');
      } else {
        // ADD new
        await makeAuthenticatedRequest(`${server}/api/batches/admin`, 'POST', payload);
        showSnackbar('Batch added successfully!');
      }
      setDialogOpen(false);
      fetchBatches(); // refresh table
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

  // ── FORM CHANGE HANDLER ──
  const handleFormChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Group batches by pageType for cleaner display
  const classesBatches = batches.filter(b => b.pageType === 'classes');
  const coursesBatches = batches.filter(b => b.pageType === 'courses');

  return (
    <Box sx={{ p: 3 }}>

      {/* ── HEADER ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary">
          Batch Manager
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add New Batch
        </Button>
      </Box>

      {/* ── CLASSES BATCHES TABLE ── */}
      <Typography variant="h6" fontWeight={600} mb={1} color="text.secondary">
        Classes (JEE / NEET / Boards) — ClassCardPage
      </Typography>
      <BatchTable
        batches={classesBatches}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onDelete={(b) => setDeleteConfirm(b)}
      />

      <Divider sx={{ my: 4 }} />

      {/* ── COURSES BATCHES TABLE ── */}
      <Typography variant="h6" fontWeight={600} mb={1} color="text.secondary">
        Courses (DSA / Web / Data Analysis / Aptitude) — Courses.js
      </Typography>
      <BatchTable
        batches={coursesBatches}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onDelete={(b) => setDeleteConfirm(b)}
        showRedirect
      />

      {/* ── ADD / EDIT DIALOG ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={700}>
          {editingBatch ? 'Edit Batch' : 'Add New Batch'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>

            <TextField label="Batch ID *" value={form.batchId}
              onChange={handleFormChange('batchId')} fullWidth
              disabled={!!editingBatch}
              helperText={editingBatch ? "Can't change ID after creation" : 'e.g. "11", "dsa", "web"'}
            />

            <TextField label="Title *" value={form.title}
              onChange={handleFormChange('title')} fullWidth />

            <TextField label="Description *" value={form.description}
              onChange={handleFormChange('description')} fullWidth multiline rows={2}
              sx={{ gridColumn: '1 / -1' }} />

            <TextField label="Image URL *" value={form.imageUrl}
              onChange={handleFormChange('imageUrl')} fullWidth
              helperText='e.g. /images/11.png' />

            <TextField label="Price (₹)" value={form.price} type="number"
              onChange={handleFormChange('price')} fullWidth
              helperText="0 = FREE" />

            <FormControl fullWidth>
              <InputLabel>Page Type *</InputLabel>
              <Select value={form.pageType} label="Page Type *"
                onChange={handleFormChange('pageType')}>
                <MenuItem value="classes">Classes (JEE/NEET/Boards)</MenuItem>
                <MenuItem value="courses">Courses (DSA/Web/Data/Aptitude)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select value={form.category} label="Category *"
                onChange={handleFormChange('category')}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Only show these for courses pageType */}
            {form.pageType === 'courses' && (
              <>
                <TextField label="Screenshot URL" value={form.screenshot}
                  onChange={handleFormChange('screenshot')} fullWidth
                  helperText='e.g. /images/dsa_files/dsass.png' />

                <TextField label="Redirect Path" value={form.redirectPath}
                  onChange={handleFormChange('redirectPath')} fullWidth
                  helperText='e.g. /dsa, /web, /data-analysis' />

                <TextField
                  label="What You'll Learn"
                  value={form.whatYouLearn}
                  onChange={handleFormChange('whatYouLearn')}
                  fullWidth multiline rows={4}
                  sx={{ gridColumn: '1 / -1' }}
                  helperText="Enter points separated by commas"
                />
              </>
            )}

            <TextField label="Sort Order" value={form.sortOrder} type="number"
              onChange={handleFormChange('sortOrder')} fullWidth
              helperText="Lower number = shown first" />

            <FormControlLabel
              control={<Switch checked={form.isActive}
                onChange={handleFormChange('isActive')} />}
              label="Active (visible to students)"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingBatch ? 'Update Batch' : 'Add Batch'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DELETE CONFIRM DIALOG ── */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle fontWeight={700} color="error">Delete Batch?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete <strong>{deleteConfirm?.title}</strong>?
            This cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Tip: Use "Deactivate" instead to hide a batch without deleting it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── SNACKBAR ── */}
      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────
// Reusable BatchTable sub-component
// ─────────────────────────────────────────────────────────────
const BatchTable = ({ batches, onEdit, onToggle, onDelete, showRedirect = false }) => (
  <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell><strong>ID</strong></TableCell>
          <TableCell><strong>Title</strong></TableCell>
          <TableCell><strong>Category</strong></TableCell>
          <TableCell><strong>Price</strong></TableCell>
          {showRedirect && <TableCell><strong>Redirect</strong></TableCell>}
          <TableCell><strong>Order</strong></TableCell>
          <TableCell><strong>Status</strong></TableCell>
          <TableCell align="center"><strong>Actions</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {batches.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.secondary' }}>
              No batches yet. Click "Add New Batch" to create one.
            </TableCell>
          </TableRow>
        ) : (
          batches.map((batch) => (
            <TableRow key={batch._id}
              sx={{ opacity: batch.isActive ? 1 : 0.5, '&:hover': { bgcolor: '#fafafa' } }}>
              <TableCell>
                <Typography variant="caption" fontFamily="monospace" fontWeight={600}>
                  {batch.batchId}
                </Typography>
              </TableCell>
              <TableCell>{batch.title}</TableCell>
              <TableCell>
                <Chip label={batch.category} size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={batch.price === 0 ? 'FREE' : `₹${batch.price}`}
                  color={batch.price === 0 ? 'success' : 'warning'}
                  size="small"
                />
              </TableCell>
              {showRedirect && (
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {batch.redirectPath || '—'}
                  </Typography>
                </TableCell>
              )}
              <TableCell>{batch.sortOrder}</TableCell>
              <TableCell>
                <Chip
                  label={batch.isActive ? 'Active' : 'Inactive'}
                  color={batch.isActive ? 'success' : 'default'}
                  size="small"
                  onClick={() => onToggle(batch)}
                  sx={{ cursor: 'pointer' }}
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Edit">
                  <IconButton size="small" color="primary" onClick={() => onEdit(batch)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => onDelete(batch)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default BatchManager;