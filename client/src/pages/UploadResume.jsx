import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload Resume, 2: Add Job (optional)
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [skipJob, setSkipJob] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    setStep(2); // Move to job description step
  };

  const handleSkipJob = async () => {
    setSkipJob(true);
    await analyzeResume();
  };

  const analyzeResume = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription && !skipJob) {
        formData.append('jobDescription', jobDescription);
      }
      if (jobTitle && !skipJob) {
        formData.append('jobTitle', jobTitle);
      }
      if (jobCompany && !skipJob) {
        formData.append('jobCompany', jobCompany);
      }

      const response = await api.post('/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Resume analyzed successfully!');
      navigate(`/analysis/${response.data.analysis._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    await analyzeResume();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Upload Resume</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Upload your resume in PDF format for AI-powered analysis</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center font-semibold`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`w-10 h-10 ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center font-semibold`}>
              2
            </div>
            <div className="w-24 h-1 bg-gray-300"></div>
            <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
              3
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-16 mb-12">
          <span className={`text-sm font-medium ${step >= 1 ? 'text-primary-600' : 'text-gray-500'}`}>Upload Resume</span>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-primary-600' : 'text-gray-500'}`}>Add Job</span>
          <span className="text-sm font-medium text-gray-500">View Results</span>
        </div>

        {step === 1 ? (
          <form onSubmit={handleFileSubmit}>
          <div
            className={`card border-2 border-dashed transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : file
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-primary-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center py-12">
              {file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Drag & Drop or <span className="text-primary-600 underline">Choose file</span> to upload
                    </p>
                    <p className="text-sm text-gray-600 mt-2">PDF files only (max 5MB)</p>
                  </div>
                  <label className="btn-primary inline-block cursor-pointer">
                    Choose File
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={!file || loading}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Add Job Description
            </button>
          </div>
        </form>
        ) : (
          <form onSubmit={handleJobSubmit} className="card">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Job Description (Optional)</h2>
              <p className="text-gray-600">Add a job description to see how well your resume matches the requirements</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Senior Full Stack Developer"
                />
              </div>

              <div>
                <label htmlFor="jobCompany" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="jobCompany"
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Google, Microsoft"
                />
              </div>

              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="input-field min-h-[200px] resize-y"
                  placeholder="Paste the job description here... Include requirements, skills needed, responsibilities, etc."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Tip: Include the full job description with requirements and skills for better matching
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSkipJob}
                disabled={loading}
                className="btn-secondary"
              >
                Skip & Analyze
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <div className="mt-8 card bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">What we analyze:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Section detection (Personal Info, Summary, Skills, Experience, Education, Projects)</li>
              <li>Section-wise scoring (0-100 for each section)</li>
              <li>ATS compatibility score</li>
              <li>Skill extraction and role fit analysis</li>
              <li>Actionable feedback and improvement suggestions</li>
              {step === 1 && <li className="font-semibold text-primary-700">Job match score (if job description provided)</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;

