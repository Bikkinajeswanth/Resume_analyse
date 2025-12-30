import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import ScoreGauge from '../components/ScoreGauge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalysisResults = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await api.get(`/resume/${id}`);
      setAnalysis(response.data);
    } catch (error) {
      toast.error('Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await api.delete(`/resume/${id}`);
      toast.success('Analysis deleted successfully');
      window.location.href = '/history';
    } catch (error) {
      toast.error('Failed to delete analysis');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Loading analysis...</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Analysis not found</p>
            <Link to="/history" className="btn-primary">
              View History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sectionData = [
    { name: 'Personal Info', score: analysis.sectionScores?.personalInfo || 0 },
    { name: 'Summary', score: analysis.sectionScores?.summary || 0 },
    { name: 'Skills', score: analysis.sectionScores?.skills || 0 },
    { name: 'Experience', score: analysis.sectionScores?.workExperience || 0 },
    { name: 'Education', score: analysis.sectionScores?.education || 0 },
    { name: 'Projects', score: analysis.sectionScores?.projects || 0 },
    { name: 'Certifications', score: analysis.sectionScores?.certifications || 0 },
    { name: 'Formatting', score: analysis.sectionScores?.formatting || 0 },
  ];

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '•';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Resume Analysis Results</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
              {analysis.jobTitle && (
                <span className="ml-2">
                  • {analysis.jobTitle}
                  {analysis.jobCompany && ` at ${analysis.jobCompany}`}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/upload" className="btn-secondary">
              Upload & Rescan
            </Link>
            <button onClick={handleDelete} className="btn-secondary text-red-600 hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Score */}
          <div className="md:col-span-1">
            <div className="card">
              <ScoreGauge score={analysis.resumeScore} size={200} />
              <div className="mt-8 space-y-4">
                {analysis.jobMatchScore !== null && analysis.jobMatchScore !== undefined && (
                  <div className={`p-4 rounded-lg border-2 ${
                    analysis.jobMatchScore >= 75 
                      ? 'bg-green-50 border-green-200' 
                      : analysis.jobMatchScore >= 50 
                      ? 'bg-amber-50 border-amber-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className="text-sm text-gray-600 mb-1">Job Match Score</p>
                    <p className={`text-2xl font-bold ${
                      analysis.jobMatchScore >= 75 
                        ? 'text-green-700' 
                        : analysis.jobMatchScore >= 50 
                        ? 'text-amber-700' 
                        : 'text-red-700'
                    }`}>
                      {analysis.jobMatchScore}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analysis.jobMatchScore >= 75 
                        ? 'Excellent match!' 
                        : analysis.jobMatchScore >= 50 
                        ? 'Good match' 
                        : 'Needs improvement'}
                    </p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ATS Compatibility</p>
                  <p className="text-2xl font-bold text-gray-900">{analysis.atsScore}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Role Fit</p>
                  <p className="text-2xl font-bold text-gray-900">{analysis.roleFit}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Resume Strength</p>
                  <p className="text-2xl font-bold text-gray-900">{analysis.resumeStrength}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Section Scores */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Section Scores</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Section Breakdown */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Section Breakdown</h2>
              <div className="space-y-4">
                {sectionData.map((section) => (
                  <div key={section.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{section.name}</span>
                      <span
                        className="font-bold"
                        style={{ color: getScoreColor(section.score) }}
                      >
                        {section.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${section.score}%`,
                          backgroundColor: getScoreColor(section.score),
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Match Details */}
            {analysis.jobMatchScore !== null && analysis.jobMatchScore !== undefined && (
              <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Match Analysis</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Matched Skills ({analysis.matchedSkills?.length || 0})</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchedSkills?.slice(0, 12).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Missing Skills ({analysis.missingSkills?.length || 0})</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills?.slice(0, 12).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                        >
                          ✗ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Extracted Skills ({analysis.extractedSkills?.length || 0})</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.extractedSkills?.slice(0, 15).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {(!analysis.jobMatchScore && analysis.missingSkills && analysis.missingSkills.length > 0) && (
                <div className="card">
                  <h3 className="font-bold text-gray-900 mb-4">Suggested Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.slice(0, 10).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feedback */}
            {analysis.feedback && analysis.feedback.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Improvement Suggestions</h2>
                <div className="space-y-4">
                  {analysis.feedback.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${
                        item.type === 'error'
                          ? 'bg-red-50 border-red-500'
                          : item.type === 'warning'
                          ? 'bg-amber-50 border-amber-500'
                          : item.type === 'success'
                          ? 'bg-green-50 border-green-500'
                          : 'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getFeedbackIcon(item.type)}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{item.section}</p>
                          <p className="text-gray-700">{item.message}</p>
                          {item.priority && (
                            <span
                              className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                                item.priority === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : item.priority === 'medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {item.priority} priority
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detected Sections */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detected Sections</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analysis.detectedSections || {}).map(([section, detected]) => (
                  <div
                    key={section}
                    className={`p-3 rounded-lg ${
                      detected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {detected ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;

