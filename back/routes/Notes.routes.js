import express from 'express';
import multer from 'multer';
import NoteSubject from '../schema/Notesubject.model.js';
import NoteChapter from '../schema/Notchapter.model.js';
import { cloudinary } from "../config/cloudinary.js";
import auth from '../controller/authh.js';

const router = express.Router();

// in-memory storage — file goes straight to Cloudinary, never touches disk
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// ─────────────────────────────────────────────
// PUBLIC — SUBJECTS
// ─────────────────────────────────────────────

// GET /api/notes/subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await NoteSubject.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: err.message });
  }
});

// ─────────────────────────────────────────────
// PUBLIC — CHAPTERS
// ─────────────────────────────────────────────

// GET /api/notes/chapters?subject=physics
router.get('/chapters', async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) return res.status(400).json({ message: 'subject is required' });

    const chapters = await NoteChapter.find({ subjectSlug: subject, isActive: true })
      .sort({ order: 1, createdAt: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapters', error: err.message });
  }
});

// GET /api/notes/chapters/single?subject=physics&chapter=redox-reactions
router.get('/chapters/single', async (req, res) => {
  try {
    const { subject, chapter } = req.query;
    if (!subject || !chapter) return res.status(400).json({ message: 'subject and chapter are required' });

    const found = await NoteChapter.findOne({ subjectSlug: subject, slug: chapter, isActive: true });
    if (!found) return res.status(404).json({ message: 'Chapter not found' });
    res.json(found);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapter', error: err.message });
  }
});

// ─────────────────────────────────────────────
// ADMIN — SUBJECTS
// ─────────────────────────────────────────────

router.get('/admin/subjects', auth, async (req, res) => {
  try {
    const subjects = await NoteSubject.find().sort({ order: 1, createdAt: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: err.message });
  }
});

router.post('/admin/subjects', auth, async (req, res) => {
  try {
    const { slug, name, description, order, isActive } = req.body;

    const existing = await NoteSubject.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'A subject with this slug already exists.' });

    const subject = new NoteSubject({
      slug, name, description: description || '', order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    await subject.save();
    res.status(201).json({ message: 'Subject created', subject });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create subject', error: err.message });
  }
});

router.put('/admin/subjects/:id', auth, async (req, res) => {
  try {
    const subject = await NoteSubject.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject updated', subject });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subject', error: err.message });
  }
});

router.delete('/admin/subjects/:id', auth, async (req, res) => {
  try {
    const subject = await NoteSubject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete subject', error: err.message });
  }
});

router.patch('/admin/subjects/:id/toggle', auth, async (req, res) => {
  try {
    const subject = await NoteSubject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    subject.isActive = !subject.isActive;
    await subject.save();
    res.json({ message: `Subject ${subject.isActive ? 'activated' : 'deactivated'}`, subject });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle subject', error: err.message });
  }
});

// ─────────────────────────────────────────────
// ADMIN — CHAPTERS
// ─────────────────────────────────────────────

router.get('/admin/chapters', auth, async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) return res.status(400).json({ message: 'subject is required' });
    const chapters = await NoteChapter.find({ subjectSlug: subject }).sort({ order: 1, createdAt: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapters', error: err.message });
  }
});

router.post('/admin/chapters', auth, async (req, res) => {
  try {
    const {
      subjectSlug, slug, title,
      mindmapUrl, shortNotesUrl, completeNotesUrl, videoUrl,
      order, isActive,
    } = req.body;

    const existing = await NoteChapter.findOne({ subjectSlug, slug });
    if (existing) return res.status(400).json({ message: 'A chapter with this slug already exists for this subject.' });

    const chapter = new NoteChapter({
      subjectSlug, slug, title,
      mindmapUrl: mindmapUrl || '',
      shortNotesUrl: shortNotesUrl || '',
      completeNotesUrl: completeNotesUrl || '',
      videoUrl: videoUrl || '',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    await chapter.save();
    res.status(201).json({ message: 'Chapter created', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create chapter', error: err.message });
  }
});

router.put('/admin/chapters/:id', auth, async (req, res) => {
  try {
    const chapter = await NoteChapter.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json({ message: 'Chapter updated', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update chapter', error: err.message });
  }
});

router.delete('/admin/chapters/:id', auth, async (req, res) => {
  try {
    const chapter = await NoteChapter.findByIdAndDelete(req.params.id);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json({ message: 'Chapter deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete chapter', error: err.message });
  }
});

router.patch('/admin/chapters/:id/toggle', auth, async (req, res) => {
  try {
    const chapter = await NoteChapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    chapter.isActive = !chapter.isActive;
    await chapter.save();
    res.json({ message: `Chapter ${chapter.isActive ? 'activated' : 'deactivated'}`, chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle chapter', error: err.message });
  }
});

// ─────────────────────────────────────────────
// ADMIN — UPLOAD (direct to Cloudinary, no bulkupload.js needed)
// ─────────────────────────────────────────────

// POST /api/notes/admin/upload  (multipart/form-data, field name "file")
router.post('/admin/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const isPdf = req.file.mimetype === 'application/pdf';

    const uploadFromBuffer = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'notes',
          resource_type: isPdf ? 'raw' : 'auto', // "raw" is required for PDFs on Cloudinary
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    const result = await uploadFromBuffer();
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

export default router;