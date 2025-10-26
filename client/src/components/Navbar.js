import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/feed" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800">
              <HomeIcon className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link to="/jobs" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800">
              <BriefcaseIcon className="h-5 w-5" />
              <span className="font-medium">Jobs</span>
            </Link>
            
            <Link to="/my-jobs" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800">
              <BriefcaseIcon className="h-5 w-5" />
              <span className="font-medium">My Jobs</span>
            </Link>
            
            <Link to="/network" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800">
              <UserGroupIcon className="h-5 w-5" />
              <span className="font-medium">Network</span>
            </Link>
            
            <Link to="/messages" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span className="font-medium">Messages</span>
            </Link>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to={`/profile/${user._id}`} className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
              </Link>
              
              {user.isAdmin && (
                <Link to="/admin" className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-pink-700 transition-all shadow-sm">
                  Admin
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-1">
              <Link to="/feed" className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <HomeIcon className="h-6 w-6" />
              </Link>
              <Link to="/jobs" className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <BriefcaseIcon className="h-6 w-6" />
              </Link>
              <Link to="/network" className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <UserGroupIcon className="h-6 w-6" />
              </Link>
              <Link to="/messages" className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </Link>
              <Link to={`/profile/${user._id}`} className="p-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <UserCircleIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;