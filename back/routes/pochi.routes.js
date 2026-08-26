// pochi.routes.js
// ─────────────────────────────────────────────────────────────
// Admin Voice Assistant Route (Pochi)
// Strictly protected for authenticated Administrators only.
// ─────────────────────────────────────────────────────────────

import express from 'express';
import auth from '../controller/authh.js';
import requireAdmin from '../middleware/requireAdmin.js';
import { askPochi, getPochiAdminContext } from '../ai/pochiAdminContext.js';
import { rateLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Strict security: Only admins can access Pochi
router.use(auth, requireAdmin);

router.post(
  '/query',
  rateLimiter({ requests: 30, window: '1 m', prefix: 'rl:pochi' }),
  async (req, res) => {
    try {
      const { query, history = [] } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
      }

      const result = await askPochi(query, req.user, history);
      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      console.error('Pochi Route Error:', err);
      res.status(500).json({
        success: false,
        voiceText: 'Sorry Admin, I encountered a temporary processing error.',
        visualReply: 'Pochi encountered a temporary error processing your request. Please try again.',
        action: 'NONE',
      });
    }
  }
);

router.get('/context', async (req, res) => {
  try {
    const context = await getPochiAdminContext();
    res.json({ success: true, context });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
