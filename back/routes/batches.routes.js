

import express from 'express';
import Batch from "../schema/batches.model.js";
import auth from '../controller/authh.js'; // Custom auth middleware for protecting routes
import { cache, clearCache } from '../middleware/cache.js'; // Redis caching
const router = express.Router();
// ─────────────────────────────────────────────
// PUBLIC ROUTES — used by frontend pages
// ─────────────────────────────────────────────

// GET /api/batches?folder=Tech
// GET /api/batches?folder=IIT+JEE
// Frontend calls this to get batches for a specific folder/page
// cache(60) → cached in Redis for 60 seconds, since this data barely changes
router.get('/', cache(60), async (req, res) => {
  try {
    const filter = { isActive: true };

    // If folder query param is passed, filter by it
    if (req.query.folder) {
      filter.folder = req.query.folder;
    }

    const batches = await Batch.find(filter).sort({ sortOrder: 1, createdAt: 1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
  }
});

// ─────────────────────────────────────────────
// ADMIN ROUTES — protected, only admin can access
// ─────────────────────────────────────────────

// GET /api/admin/batches — get ALL batches (including inactive)
router.get('/admin', auth, async (req, res) => {
  try {
    const batches = await Batch.find().sort({ folder: 1, sortOrder: 1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
  }
});

// POST /api/admin/batches — add a new batch
router.post('/admin', auth, async (req, res) => {
  try {
    const {
      batchId, folder, title, description, imageUrl, screenshot,
      price, redirectPath, whatYouLearn,
      isActive, sortOrder,
    } = req.body;

    // Check if batchId already exists
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
    });

    await batch.save();

    // Wipe cached /api/batches responses (with any ?folder=... query) so the
    // next student request fetches fresh data including this new batch
    await clearCache('cache:/api/batches*');

    res.status(201).json({ message: 'Batch created successfully', batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create batch', error: err.message });
  }
});

// PUT /api/admin/batches/:id — edit an existing batch
router.put('/admin/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    await clearCache('cache:/api/batches*');

    res.json({ message: 'Batch updated successfully', batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update batch', error: err.message });
  }
});

// DELETE /api/admin/batches/:id — delete a batch permanently
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    await clearCache('cache:/api/batches*');

    res.json({ message: 'Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete batch', error: err.message });
  }
});

// PATCH /api/admin/batches/:id/toggle — toggle active/inactive
router.patch('/admin/:id/toggle', auth, async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    batch.isActive = !batch.isActive;
    await batch.save();

    await clearCache('cache:/api/batches*');

    res.json({ message: `Batch ${batch.isActive ? 'activated' : 'deactivated'}`, batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle batch', error: err.message });
  }
});

export default router;