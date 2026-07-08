import express from 'express';
import Chapter from '../schema/Chapter.model.js';
import auth from '../controller/authh.js';
const router = express.Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES — used by the Subjects/Chapters/Chapter-detail pages
// ─────────────────────────────────────────────

// GET /api/chapters?batchId=11&subject=chemistry
// Returns the chapter list for the Chapters grid page (Image 2)
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

// GET /api/chapters/single?batchId=11&subject=chemistry&chapter=redox-reactions
// Returns ONE chapter — used by the chapter-detail page (Image 3)
router.get('/single', async (req, res) => {
  try {
    const { batchId, subject, chapter } = req.query;
    if (!batchId || !subject || !chapter) {
      return res.status(400).json({ message: 'batchId, subject and chapter are required' });
    }

    const found = await Chapter.findOne({
      batchId,
      subjectSlug: subject,
      slug: chapter,
      isActive: true,
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
// ADMIN ROUTES — protected, used by BatchContentManager
// ─────────────────────────────────────────────

// GET /api/chapters/admin?batchId=11&subject=chemistry — all chapters, including inactive
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

// POST /api/chapters/admin — create a new chapter
router.post('/admin', auth, async (req, res) => {
  try {
    const {
      batchId, subjectSlug, slug, title,
      mindmapUrl, shortNotesUrl, completeNotesUrl,
      videoUrl, videoComingSoon, order, isActive,
    } = req.body;

    const existing = await Chapter.findOne({ batchId, subjectSlug, slug });
    if (existing) {
      return res.status(400).json({ message: 'A chapter with this slug already exists for this subject.' });
    }

    const chapter = new Chapter({
      batchId, subjectSlug, slug, title,
      mindmapUrl: mindmapUrl || '',
      shortNotesUrl: shortNotesUrl || '',
      completeNotesUrl: completeNotesUrl || '',
      videoUrl: videoUrl || '',
      videoComingSoon: videoComingSoon !== undefined ? videoComingSoon : true,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await chapter.save();
    res.status(201).json({ message: 'Chapter created successfully', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create chapter', error: err.message });
  }
});

// PUT /api/chapters/admin/:id — edit an existing chapter
router.put('/admin/:id', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json({ message: 'Chapter updated successfully', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update chapter', error: err.message });
  }
});

// DELETE /api/chapters/admin/:id
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    res.json({ message: 'Chapter deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete chapter', error: err.message });
  }
});

// PATCH /api/chapters/admin/:id/toggle
router.patch('/admin/:id/toggle', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    chapter.isActive = !chapter.isActive;
    await chapter.save();

    res.json({ message: `Chapter ${chapter.isActive ? 'activated' : 'deactivated'}`, chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle chapter', error: err.message });
  }
});

export default router;