// import express from 'express';
// import multer from 'multer';
// import NoteBatch from '../schema/Notebatch.model.js';
// import NoteSubject from '../schema/Notesubject.model.js';
// import NoteChapter from '../schema/Notechapter.model.js';
// import { cloudinary } from '../config/cloudinary.js';
// import auth from '../controller/authh.js';

// const router = express.Router();

// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// // ═════════════════════════════════════════════════════════════
// // PUBLIC — BATCHES (browse/buy page)
// // ═════════════════════════════════════════════════════════════

// // GET /api/notes/batches — active only, used by the browse page
// router.get('/batches', async (req, res) => {
//   try {
//     const batches = await NoteBatch.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
//     res.json(batches);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
//   }
// });

// // GET /api/notes/batches/:slug — one batch (e.g. for a title header)
// router.get('/batches/:slug', async (req, res) => {
//   try {
//     const batch = await NoteBatch.findOne({ slug: req.params.slug, isActive: true });
//     if (!batch) return res.status(404).json({ message: 'Batch not found' });
//     res.json(batch);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch batch', error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════════
// // PUBLIC — SUBJECTS (scoped to a batch)
// // ═════════════════════════════════════════════════════════════

// // GET /api/notes/subjects?batch=physics-crash-course
// router.get('/subjects', async (req, res) => {
//   try {
//     const { batch } = req.query;
//     if (!batch) return res.status(400).json({ message: 'batch is required' });
//     const subjects = await NoteSubject.find({ batchSlug: batch, isActive: true }).sort({ order: 1, createdAt: 1 });
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch subjects', error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════════
// // PUBLIC — CHAPTERS (scoped to batch + subject)
// // ═════════════════════════════════════════════════════════════

// // GET /api/notes/chapters?batch=X&subject=physics
// router.get('/chapters', async (req, res) => {
//   try {
//     const { batch, subject } = req.query;
//     if (!batch || !subject) return res.status(400).json({ message: 'batch and subject are required' });
//     const chapters = await NoteChapter.find({ batchSlug: batch, subjectSlug: subject, isActive: true })
//       .sort({ order: 1, createdAt: 1 });
//     res.json(chapters);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch chapters', error: err.message });
//   }
// });

// // GET /api/notes/chapters/single?batch=X&subject=physics&chapter=redox-reactions
// router.get('/chapters/single', async (req, res) => {
//   try {
//     const { batch, subject, chapter } = req.query;
//     if (!batch || !subject || !chapter) return res.status(400).json({ message: 'batch, subject and chapter are required' });
//     const found = await NoteChapter.findOne({ batchSlug: batch, subjectSlug: subject, slug: chapter, isActive: true });
//     if (!found) return res.status(404).json({ message: 'Chapter not found' });
//     res.json(found);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch chapter', error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════════
// // ADMIN — BATCHES
// // ═════════════════════════════════════════════════════════════

// router.get('/admin/batches', auth, async (req, res) => {
//   try {
//     const batches = await NoteBatch.find().sort({ order: 1, createdAt: 1 });
//     res.json(batches);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
//   }
// });

// router.post('/admin/batches', auth, async (req, res) => {
//   try {
//     const { slug, title, description, imageUrl, price, isActive, order, whatYouLearn  } = req.body;

//     const existing = await NoteBatch.findOne({ slug });
//     if (existing) return res.status(400).json({ message: 'A batch with this slug already exists.' });

//     const batch = new NoteBatch({
//       slug, title, description, imageUrl,
//       price: price || 0,
//       isActive: isActive !== undefined ? isActive : true,
//       order: order || 0,
//       whatYouLearn: whatYouLearn || [],
//     });
//     await batch.save();
//     res.status(201).json({ message: 'Batch created', batch });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create batch', error: err.message });
//   }
// });

// router.put('/admin/batches/:id', auth, async (req, res) => {
//   try {
//     const batch = await NoteBatch.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
//     if (!batch) return res.status(404).json({ message: 'Batch not found' });
//     res.json({ message: 'Batch updated', batch });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update batch', error: err.message });
//   }
// });

// router.delete('/admin/batches/:id', auth, async (req, res) => {
//   try {
//     const batch = await NoteBatch.findByIdAndDelete(req.params.id);
//     if (!batch) return res.status(404).json({ message: 'Batch not found' });
//     res.json({ message: 'Batch deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete batch', error: err.message });
//   }
// });

// router.patch('/admin/batches/:id/toggle', auth, async (req, res) => {
//   try {
//     const batch = await NoteBatch.findById(req.params.id);
//     if (!batch) return res.status(404).json({ message: 'Batch not found' });
//     batch.isActive = !batch.isActive;
//     await batch.save();
//     res.json({ message: `Batch ${batch.isActive ? 'activated' : 'deactivated'}`, batch });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to toggle batch', error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════════
// // ADMIN — SUBJECTS (scoped to a batch)
// // ═════════════════════════════════════════════════════════════

// router.get('/admin/subjects', auth, async (req, res) => {
//   try {
//     const { batch } = req.query;
//     if (!batch) return res.status(400).json({ message: 'batch is required' });
//     const subjects = await NoteSubject.find({ batchSlug: batch }).sort({ order: 1, createdAt: 1 });
//     res.json(subjects);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch subjects', error: err.message });
//   }
// });

// router.post('/admin/subjects', auth, async (req, res) => {
//   try {
//     const { batchSlug, slug, name, description, order, isActive } = req.body;

//     const existing = await NoteSubject.findOne({ batchSlug, slug });
//     if (existing) return res.status(400).json({ message: 'A subject with this slug already exists in this batch.' });

//     const subject = new NoteSubject({
//       batchSlug, slug, name, description: description || '', order: order || 0,
//       isActive: isActive !== undefined ? isActive : true,
//     });
//     await subject.save();
//     res.status(201).json({ message: 'Subject created', subject });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create subject', error: err.message });
//   }
// });

// router.put('/admin/subjects/:id', auth, async (req, res) => {
//   try {
//     const subject = await NoteSubject.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });
//     res.json({ message: 'Subject updated', subject });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update subject', error: err.message });
//   }
// });

// router.delete('/admin/subjects/:id', auth, async (req, res) => {
//   try {
//     const subject = await NoteSubject.findByIdAndDelete(req.params.id);
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });
//     res.json({ message: 'Subject deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete subject', error: err.message });
//   }
// });

// router.patch('/admin/subjects/:id/toggle', auth, async (req, res) => {
//   try {
//     const subject = await NoteSubject.findById(req.params.id);
//     if (!subject) return res.status(404).json({ message: 'Subject not found' });
//     subject.isActive = !subject.isActive;
//     await subject.save();
//     res.json({ message: `Subject ${subject.isActive ? 'activated' : 'deactivated'}`, subject });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to toggle subject', error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════════
// // ADMIN — CHAPTERS (scoped to batch + subject)
// // ═════════════════════════════════════════════════════════════

// router.get('/admin/chapters', auth, async (req, res) => {
//   try {
//     const { batch, subject } = req.query;
//     if (!batch || !subject) return res.status(400).json({ message: 'batch and subject are required' });
//     const chapters = await NoteChapter.find({ batchSlug: batch, subjectSlug: subject }).sort({ order: 1, createdAt: 1 });
//     res.json(chapters);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch chapters', error: err.message });
//   }
// });

// router.post('/admin/chapters', auth, async (req, res) => {
//   try {
//     const {
//       batchSlug, subjectSlug, slug, title,
//       mindmapUrl, shortNotesUrl, completeNotesUrl, videoUrl,
//       order, isActive,
//     } = req.body;

//     const existing = await NoteChapter.findOne({ batchSlug, subjectSlug, slug });
//     if (existing) return res.status(400).json({ message: 'A chapter with this slug already exists for this subject.' });

//     const chapter = new NoteChapter({
//       batchSlug, subjectSlug, slug, title,
//       mindmapUrl: mindmapUrl || '',
//       shortNotesUrl: shortNotesUrl || '',
//       completeNotesUrl: completeNotesUrl || '',
//       videoUrl: videoUrl || '',
//       order: order || 0,
//       isActive: isActive !== undefined ? isActive : true,
//     });
//     await chapter.save();
//     res.status(201).json({ message: 'Chapter created', chapter });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create chapter', error: err.message });
//   }
// });

// router.put('/admin/chapters/:id', auth, async (req, res) => {
//   try {
//     const chapter = await NoteChapter.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
//     if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
//     res.json({ message: 'Chapter updated', chapter });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update chapter', error: err.message });
//   }
// });

// router.delete('/admin/chapters/:id', auth, async (req, res) => {
//   try {
//     const chapter = await NoteChapter.findByIdAndDelete(req.params.id);
//     if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
//     res.json({ message: 'Chapter deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to delete chapter', error: err.message });
//   }
// });

// router.patch('/admin/chapters/:id/toggle', auth, async (req, res) => {
//   try {
//     const chapter = await NoteChapter.findById(req.params.id);
//     if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
//     chapter.isActive = !chapter.isActive;
//     await chapter.save();
//     res.json({ message: `Chapter ${chapter.isActive ? 'activated' : 'deactivated'}`, chapter });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to toggle chapter', error: err.message });
//   }
// });

// // ═════════════════════════════════════════════════════════════
// // ADMIN — UPLOAD (Cloudinary, used for batch images AND chapter PDFs)
// // ═════════════════════════════════════════════════════════════

// router.post('/admin/upload', auth, upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No file provided' });

//     const isPdf = req.file.mimetype === 'application/pdf';

//     const uploadFromBuffer = () => new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: 'notes', resource_type: isPdf ? 'raw' : 'auto' },
//         (error, result) => (error ? reject(error) : resolve(result))
//       );
//       stream.end(req.file.buffer);
//     });

//     const result = await uploadFromBuffer();
//     res.json({ url: result.secure_url });
//   } catch (err) {
//     res.status(500).json({ message: 'Upload failed', error: err.message });
//   }
// });

// export default router;


import express from 'express';
import multer from 'multer';
import NoteBatch from '../schema/Notebatch.model.js';
import NoteSubject from '../schema/Notesubject.model.js';
import NoteChapter from '../schema/Notechapter.model.js';
import { cloudinary } from '../config/cloudinary.js';
import auth from '../controller/authh.js';
import { cache, clearCache } from '../middleware/cache.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// ═════════════════════════════════════════════════════════════
// PUBLIC — BATCHES (browse/buy page)
// ═════════════════════════════════════════════════════════════

// GET /api/notes/batches — active only, used by the browse page
router.get('/batches', cache(60), async (req, res) => {
  try {
    const batches = await NoteBatch.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
  }
});

// GET /api/notes/batches/:slug — one batch (e.g. for a title header)
router.get('/batches/:slug', cache(60), async (req, res) => {
  try {
    const batch = await NoteBatch.findOne({ slug: req.params.slug, isActive: true });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batch', error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════
// PUBLIC — SUBJECTS (scoped to a batch)
// ═════════════════════════════════════════════════════════════

// GET /api/notes/subjects?batch=physics-crash-course
router.get('/subjects', cache(60), async (req, res) => {
  try {
    const { batch } = req.query;
    if (!batch) return res.status(400).json({ message: 'batch is required' });
    const subjects = await NoteSubject.find({ batchSlug: batch, isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════
// PUBLIC — CHAPTERS (scoped to batch + subject)
// ═════════════════════════════════════════════════════════════

// GET /api/notes/chapters?batch=X&subject=physics
router.get('/chapters', cache(60), async (req, res) => {
  try {
    const { batch, subject } = req.query;
    if (!batch || !subject) return res.status(400).json({ message: 'batch and subject are required' });
    const chapters = await NoteChapter.find({ batchSlug: batch, subjectSlug: subject, isActive: true })
      .sort({ order: 1, createdAt: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapters', error: err.message });
  }
});

// GET /api/notes/chapters/single?batch=X&subject=physics&chapter=redox-reactions
router.get('/chapters/single', cache(120), async (req, res) => {
  try {
    const { batch, subject, chapter } = req.query;
    if (!batch || !subject || !chapter) return res.status(400).json({ message: 'batch, subject and chapter are required' });
    const found = await NoteChapter.findOne({ batchSlug: batch, subjectSlug: subject, slug: chapter, isActive: true });
    if (!found) return res.status(404).json({ message: 'Chapter not found' });
    res.json(found);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapter', error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════
// ADMIN — BATCHES
// ═════════════════════════════════════════════════════════════

router.get('/admin/batches', auth, async (req, res) => {
  try {
    const batches = await NoteBatch.find().sort({ order: 1, createdAt: 1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
  }
});

router.post('/admin/batches', auth, async (req, res) => {
  try {
    const { slug, title, description, imageUrl, price, isActive, order, whatYouLearn  } = req.body;

    const existing = await NoteBatch.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'A batch with this slug already exists.' });

    const batch = new NoteBatch({
      slug, title, description, imageUrl,
      price: price || 0,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      whatYouLearn: whatYouLearn || [],
    });
    await batch.save();
    await clearCache('cache:/api/notes/batches*');
    res.status(201).json({ message: 'Batch created', batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create batch', error: err.message });
  }
});

router.put('/admin/batches/:id', auth, async (req, res) => {
  try {
    const batch = await NoteBatch.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    await clearCache('cache:/api/notes/batches*');
    res.json({ message: 'Batch updated', batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update batch', error: err.message });
  }
});

router.delete('/admin/batches/:id', auth, async (req, res) => {
  try {
    const batch = await NoteBatch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    await clearCache('cache:/api/notes/batches*');
    res.json({ message: 'Batch deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete batch', error: err.message });
  }
});

router.patch('/admin/batches/:id/toggle', auth, async (req, res) => {
  try {
    const batch = await NoteBatch.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    batch.isActive = !batch.isActive;
    await batch.save();
    await clearCache('cache:/api/notes/batches*');
    res.json({ message: `Batch ${batch.isActive ? 'activated' : 'deactivated'}`, batch });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle batch', error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════
// ADMIN — SUBJECTS (scoped to a batch)
// ═════════════════════════════════════════════════════════════

router.get('/admin/subjects', auth, async (req, res) => {
  try {
    const { batch } = req.query;
    if (!batch) return res.status(400).json({ message: 'batch is required' });
    const subjects = await NoteSubject.find({ batchSlug: batch }).sort({ order: 1, createdAt: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: err.message });
  }
});

router.post('/admin/subjects', auth, async (req, res) => {
  try {
    const { batchSlug, slug, name, description, order, isActive } = req.body;

    const existing = await NoteSubject.findOne({ batchSlug, slug });
    if (existing) return res.status(400).json({ message: 'A subject with this slug already exists in this batch.' });

    const subject = new NoteSubject({
      batchSlug, slug, name, description: description || '', order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    await subject.save();
    await clearCache('cache:/api/notes/subjects*');
    res.status(201).json({ message: 'Subject created', subject });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create subject', error: err.message });
  }
});

router.put('/admin/subjects/:id', auth, async (req, res) => {
  try {
    const subject = await NoteSubject.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    await clearCache('cache:/api/notes/subjects*');
    res.json({ message: 'Subject updated', subject });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subject', error: err.message });
  }
});

router.delete('/admin/subjects/:id', auth, async (req, res) => {
  try {
    const subject = await NoteSubject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    await clearCache('cache:/api/notes/subjects*');
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
    await clearCache('cache:/api/notes/subjects*');
    res.json({ message: `Subject ${subject.isActive ? 'activated' : 'deactivated'}`, subject });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle subject', error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════
// ADMIN — CHAPTERS (scoped to batch + subject)
// ═════════════════════════════════════════════════════════════

router.get('/admin/chapters', auth, async (req, res) => {
  try {
    const { batch, subject } = req.query;
    if (!batch || !subject) return res.status(400).json({ message: 'batch and subject are required' });
    const chapters = await NoteChapter.find({ batchSlug: batch, subjectSlug: subject }).sort({ order: 1, createdAt: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chapters', error: err.message });
  }
});

router.post('/admin/chapters', auth, async (req, res) => {
  try {
    const {
      batchSlug, subjectSlug, slug, title,
      mindmapUrl, shortNotesUrl, completeNotesUrl, videoUrl,
      order, isActive,
    } = req.body;

    const existing = await NoteChapter.findOne({ batchSlug, subjectSlug, slug });
    if (existing) return res.status(400).json({ message: 'A chapter with this slug already exists for this subject.' });

    const chapter = new NoteChapter({
      batchSlug, subjectSlug, slug, title,
      mindmapUrl: mindmapUrl || '',
      shortNotesUrl: shortNotesUrl || '',
      completeNotesUrl: completeNotesUrl || '',
      videoUrl: videoUrl || '',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    await chapter.save();
    await clearCache('cache:/api/notes/chapters*');
    res.status(201).json({ message: 'Chapter created', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create chapter', error: err.message });
  }
});

router.put('/admin/chapters/:id', auth, async (req, res) => {
  try {
    const chapter = await NoteChapter.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    await clearCache('cache:/api/notes/chapters*');
    res.json({ message: 'Chapter updated', chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update chapter', error: err.message });
  }
});

router.delete('/admin/chapters/:id', auth, async (req, res) => {
  try {
    const chapter = await NoteChapter.findByIdAndDelete(req.params.id);
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    await clearCache('cache:/api/notes/chapters*');
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
    await clearCache('cache:/api/notes/chapters*');
    res.json({ message: `Chapter ${chapter.isActive ? 'activated' : 'deactivated'}`, chapter });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle chapter', error: err.message });
  }
});

// ═════════════════════════════════════════════════════════════
// ADMIN — UPLOAD (Cloudinary, used for batch images AND chapter PDFs)
// ═════════════════════════════════════════════════════════════

router.post('/admin/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const isPdf = req.file.mimetype === 'application/pdf';

    const uploadFromBuffer = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'notes', resource_type: isPdf ? 'raw' : 'auto' },
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