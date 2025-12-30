import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary-700 dark:group-hover:bg-primary-600 transition-colors">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Resume Analyzer</span>
          </Link>

          <div className="flex items-center space-x-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="nav-link"
                >
                  Upload Resume
                </Link>
                <Link
                  to="/history"
                  className="nav-link"
                >
                  History
                </Link>
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm py-1.5 px-4"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link
                  to="/login"
                  className="nav-link"
                >
                  Log In
                </Link>
                <Link to="/register" className="btn-primary ml-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

