import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import ScoreGauge from '../components/ScoreGauge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResumes: 0,
    averageScore: 0,
    latestResume: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/resume/history');
      const resumes = response.data.resumes;

      if (resumes.length > 0) {
        const totalScore = resumes.reduce((sum, r) => sum + (r.resumeScore || 0), 0);
        const avgScore = Math.round(totalScore / resumes.length);
        
        setStats({
          totalResumes: resumes.length,
          averageScore: avgScore,
          latestResume: resumes[0],
        });
      } else {
        setStats({
          totalResumes: 0,
          averageScore: 0,
          latestResume: null,
        });
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Track your resume analysis progress</p>
        </div>

        {stats.totalResumes === 0 ? (
          <div className="card text-center py-12">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resumes Analyzed Yet</h3>
            <p className="text-gray-600 mb-6">Upload your first resume to get started with AI-powered analysis</p>
            <Link to="/upload" className="btn-primary inline-block">
              Upload Resume
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Resumes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalResumes}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageScore}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Latest Score</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.latestResume?.resumeScore || 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Resume Analysis */}
            {stats.latestResume && (
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Analysis</h2>
                  <ScoreGauge score={stats.latestResume.resumeScore} size={180} />
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">ATS Score</span>
                      <span className="font-semibold text-gray-900">{stats.latestResume.atsScore}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Role Fit</span>
                      <span className="font-semibold text-gray-900">{stats.latestResume.roleFit}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Strength Level</span>
                      <span className="font-semibold text-gray-900">{stats.latestResume.resumeStrength}</span>
                    </div>
                  </div>
                  <Link
                    to={`/analysis/${stats.latestResume._id}`}
                    className="btn-primary w-full mt-6 text-center block"
                  >
                    View Full Analysis
                  </Link>
                </div>

                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Section Scores</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Skills', score: stats.latestResume.sectionScores?.skills || 0 },
                      { name: 'Experience', score: stats.latestResume.sectionScores?.workExperience || 0 },
                      { name: 'Education', score: stats.latestResume.sectionScores?.education || 0 },
                      { name: 'Summary', score: stats.latestResume.sectionScores?.summary || 0 },
                      { name: 'Projects', score: stats.latestResume.sectionScores?.projects || 0 },
                      { name: 'Formatting', score: stats.latestResume.sectionScores?.formatting || 0 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Link to="/upload" className="btn-primary">
                  Upload New Resume
                </Link>
                <Link to="/history" className="btn-secondary">
                  View History
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

