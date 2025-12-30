import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { analyzeResume } from '../services/resumeAnalysisEngine.js';

// @desc    Analyze resume
// @route   POST /api/resume/analyze
// @access  Private
export const analyzeResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Get job description from request body (optional)
    const { jobDescription, jobTitle, jobCompany } = req.body;

    // Analyze resume with optional job description
    const analysisResult = await analyzeResume(
      req.file.buffer, 
      req.file.originalname,
      jobDescription || null
    );

    // Save to database
    const resumeAnalysis = await ResumeAnalysis.create({
      userId: req.user._id,
      jobDescription: jobDescription || null,
      jobTitle: jobTitle || null,
      jobCompany: jobCompany || null,
      ...analysisResult,
    });

    res.status(201).json({
      message: 'Resume analyzed successfully',
      analysis: resumeAnalysis,
    });
  } catch (error) {
    console.error('Analyze resume error:', error);
    res.status(500).json({ 
      message: 'Failed to analyze resume',
      error: error.message 
    });
  }
};

// @desc    Get user's resume history
// @route   GET /api/resume/history
// @access  Private
export const getResumeHistory = async (req, res) => {
  try {
    const resumes = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-resumeText'); // Exclude full text for performance

    res.json({
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Failed to fetch resume history' });
  }
};

// @desc    Get single resume analysis
// @route   GET /api/resume/:id
// @access  Private
export const getResumeAnalysis = async (req, res) => {
  try {
    const resume = await ResumeAnalysis.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis not found' });
    }

    // Check if resume belongs to user
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this resume' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Failed to fetch resume analysis' });
  }
};

// @desc    Delete resume analysis
// @route   DELETE /api/resume/:id
// @access  Private
export const deleteResumeAnalysis = async (req, res) => {
  try {
    const resume = await ResumeAnalysis.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis not found' });
    }

    // Check if resume belongs to user
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this resume' });
    }

    await ResumeAnalysis.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resume analysis deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Failed to delete resume analysis' });
  }
};

