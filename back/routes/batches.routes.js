import express from 'express';
import Batch from "../schema/batches.model.js";
import auth from '../controller/authh.js';
const router = express.Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.folder) filter.folder = req.query.folder;
    const batches = await Batch.find(filter).sort({ sortOrder: 1, createdAt: 1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
  }
});

// ─────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────

router.get('/admin', auth, async (req, res) => {
  try {
    const batches = await Batch.find().sort({ folder: 1, sortOrder: 1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
  }
});

router.post('/admin', auth, async (req, res) => {
  try {
    const {
      batchId, folder, title, description, imageUrl, screenshot,
      price, redirectPath, whatYouLearn,
      isActive, sortOrder, resourceTypes,
    } = req.body;

    const existing = await Batch.findOne({ batchId });
    if (existing) {
      return res.status(400).json({ message: 'Batch ID already exists. Use a unique ID.' });
    }

    const batch = new Batch({
      batchId, folder, title, description, imageUrl,
      screenshot: screenshot || '',
      price: price || 0,
      redirectPath: redirectPath || '',
      whatYouLearn: whatYouLearn || [],
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0,
      resourceTypes: resourceTypes || { mindmap: true, shortNotes: true, completeNotes: true, video: true },
    });

    await batch.save();
    res.status(201).json({ message: 'Batch created successfully', batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create batch', error: err.message });
  }
});

// PUT — generic $set already covers subjects AND resourceTypes updates, no change needed
router.put('/admin/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json({ message: 'Batch updated successfully', batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update batch', error: err.message });
  }
});

router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json({ message: 'Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete batch', error: err.message });
  }
});

router.patch('/admin/:id/toggle', auth, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    batch.isActive = !batch.isActive;
    await batch.save();
    res.json({ message: `Batch ${batch.isActive ? 'activated' : 'deactivated'}`, batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle batch', error: err.message });
  }
});

// GET /api/batches/:batchId — registered LAST so it never shadows /admin routes
router.get('/:batchId', async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId, isActive: true });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batch', error: err.message });
  }
});

export default router;