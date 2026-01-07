import express from 'express';
import {
  analyzeResumeFile as analyzeResume,
  getResumeHistory as getHistory,
  getResumeAnalysis,
  deleteResumeAnalysis,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/analyze', upload.single('resume'), analyzeResume);
router.get('/history', getHistory);
router.get('/:id', getResumeAnalysis);
router.delete('/:id', deleteResumeAnalysis);

export default router;

