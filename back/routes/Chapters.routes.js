import express from 'express';
import Chapter from '../schema/Chapter.model.js';
import auth from '../controller/authh.js';
const router = express.Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────

// GET /api/chapters?batchId=11&subject=chemistry  (or "Semester (1)" etc — literal)
router.get('/', async (req, res) => {
  try {
    const { batchId, subject } = req.query;
    if (!batchId || !subject) {
      return res.status(400).json({ message: 'batchId and subject are required' });
    }

    const chapters = await Chapter.find({
      batchId,
      subjectSlug: subject,
      isActive: true,
    }).sort({ order: 1, createdAt: 1 });

    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapters', error: err.message });
  }
});

// GET /api/chapters/single?batchId=11&subject=chemistry&title=redox-reactions
// Used by ChapterDetail.js to get this chapter's videoUrl
router.get('/single', async (req, res) => {
  try {
    const { batchId, subject, title } = req.query;
    if (!batchId || !subject || !title) {
      return res.status(400).json({ message: 'batchId, subject and title are required' });
    }

    const found = await Chapter.findOne({
      batchId, subjectSlug: subject, title, isActive: true,
    });

    if (!found) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json(found);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapter', error: err.message });
  }
});

// ─────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────

router.get('/admin', auth, async (req, res) => {
  try {
    const { batchId, subject } = req.query;
    if (!batchId || !subject) {
      return res.status(400).json({ message: 'batchId and subject are required' });
    }

    const chapters = await Chapter.find({ batchId, subjectSlug: subject })
      .sort({ order: 1, createdAt: 1 });

    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapters', error: err.message });
  }
});

router.post('/admin', auth, async (req, res) => {
  try {
    const { batchId, subjectSlug, title, videoUrl, order, isActive } = req.body;

    const existing = await Chapter.findOne({ batchId, subjectSlug, title });
    if (existing) {
      return res.status(400).json({ message: 'A chapter with this title already exists for this subject.' });
    }

    const chapter = new Chapter({
      batchId, subjectSlug, title,
      videoUrl: videoUrl || '',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await chapter.save();
    res.status(201).json({ message: 'Chapter created successfully', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create chapter', error: err.message });
  }
});

router.put('/admin/:id', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json({ message: 'Chapter updated successfully', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update chapter', error: err.message });
  }
});

router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json({ message: 'Chapter deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete chapter', error: err.message });
  }
});

router.patch('/admin/:id/toggle', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    chapter.isActive = !chapter.isActive;
    await chapter.save();
    res.json({ message: `Chapter ${chapter.isActive ? 'activated' : 'deactivated'}`, chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle chapter', error: err.message });
  }
});

export default router;