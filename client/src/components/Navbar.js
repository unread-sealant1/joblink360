import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div>
            <Link to="/feed" className="text-2xl font-bold text-primary-600">
              JobLink360
            </Link>
            <p className="text-xs text-gray-500">by Cassidy Mahlatse Masila</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/feed" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link to="/jobs" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
              <BriefcaseIcon className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            
            <Link to="/my-jobs" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
              <BriefcaseIcon className="h-5 w-5" />
              <span>My Jobs</span>
            </Link>
            
            <Link to="/network" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
              <UserGroupIcon className="h-5 w-5" />
              <span>Network</span>
            </Link>
            
            <Link to="/messages" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to={`/profile/${user._id}`} className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-600" />
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              
              {user.isAdmin && (
                <Link to="/admin" className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                  Admin
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;