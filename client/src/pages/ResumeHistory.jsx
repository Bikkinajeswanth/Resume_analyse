import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const ResumeHistory = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/resume/history');
      setResumes(response.data.resumes);
    } catch (error) {
      toast.error('Failed to load resume history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await api.delete(`/resume/${id}`);
      toast.success('Analysis deleted successfully');
      fetchHistory();
    } catch (error) {
      toast.error('Failed to delete analysis');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Resume History</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">View and manage all your resume analyses</p>
          </div>
          <Link to="/upload" className="btn-primary">
            Upload New Resume
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resume Analyses Yet</h3>
            <p className="text-gray-600 mb-6">Upload your first resume to get started</p>
            <Link to="/upload" className="btn-primary inline-block">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="card hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${getScoreColor(
                          resume.resumeScore
                        )}`}
                      >
                        {resume.resumeScore}%
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {resume.fileName || 'Resume Analysis'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(resume.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">ATS Score</p>
                        <p className="font-semibold text-gray-900">{resume.atsScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Role Fit</p>
                        <p className="font-semibold text-gray-900">{resume.roleFit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Strength</p>
                        <p className="font-semibold text-gray-900">{resume.resumeStrength}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Skills Found</p>
                        <p className="font-semibold text-gray-900">
                          {resume.extractedSkills?.length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {resume.extractedSkills?.slice(0, 8).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {resume.extractedSkills?.length > 8 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{resume.extractedSkills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:min-w-[200px]">
                    <Link
                      to={`/analysis/${resume._id}`}
                      className="btn-primary text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="btn-secondary text-red-600 hover:bg-red-50 text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHistory;

