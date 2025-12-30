import express from 'express';
import {
  analyzeResumeFile,
  getResumeHistory,
  getResumeAnalysis,
  deleteResumeAnalysis,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/analyze', upload.single('resume'), analyzeResumeFile);
router.get('/history', getResumeHistory);
router.get('/:id', getResumeAnalysis);
router.delete('/:id', deleteResumeAnalysis);

export default router;

