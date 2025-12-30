import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Section - Marketing */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Optimize your resume to get more interviews
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Resume Analyzer helps you optimize your resume for any job, highlighting the key experience and skills recruiters need to see.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary text-center text-lg py-4 px-8">
                Scan Your Resume For Free
              </Link>
              <Link to="/login" className="btn-secondary text-center text-lg py-4 px-8">
                Already have an account?
              </Link>
            </div>

            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4">Trusted by professionals at:</p>
              <div className="flex flex-wrap gap-6 items-center opacity-60">
                <span className="text-gray-600 font-semibold">Google</span>
                <span className="text-gray-600 font-semibold">Microsoft</span>
                <span className="text-gray-600 font-semibold">Amazon</span>
                <span className="text-gray-600 font-semibold">Meta</span>
                <span className="text-gray-600 font-semibold">Apple</span>
              </div>
            </div>
          </div>

          {/* Right Section - Preview */}
          <div className="card animate-slide-up">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block">
                  <div className="w-32 h-32 mx-auto bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">85%</span>
                  </div>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Resume Match Score</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Searchability</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">✓ Optimized</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Hard Skills</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">12 matched</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Work Experience</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Well detailed</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">ATS Compatibility</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">Advanced algorithms analyze your resume section-by-section for comprehensive insights.</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Section-Wise Scoring</h3>
            <p className="text-gray-600">Get detailed scores for each section with actionable feedback to improve.</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ATS Compatibility</h3>
            <p className="text-gray-600">Ensure your resume passes through Applicant Tracking Systems with high scores.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

