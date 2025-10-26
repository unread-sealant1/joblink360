import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { BriefcaseIcon, UserGroupIcon, ChatBubbleLeftRightIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                JobLink360
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm sm:text-base px-3 sm:px-4 py-2 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <div className="text-center">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Connect. Network. <span className="text-primary-600 dark:text-primary-400">Grow.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto px-4">
              Join JobLink360, the professional networking platform where opportunities meet talent. 
              Build your network, find your dream job, and advance your career.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8 sm:mb-12">
              Created by <span className="font-semibold">CMM Multiverse</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 mb-8 sm:mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Join as Job Seeker
            </Link>
            <Link to="/register" className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Sign Up as Recruiter
            </Link>
          </div>
          
          <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/jobs" className="border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-6 py-3 rounded-xl font-semibold transition-all duration-200 inline-block">
              Browse Jobs
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20 px-4">
            {[
              {
                icon: BriefcaseIcon,
                title: "Find Jobs",
                description: "Discover opportunities from top companies and startups",
                delay: "0.6s"
              },
              {
                icon: UserGroupIcon,
                title: "Build Network",
                description: "Connect with professionals in your industry",
                delay: "0.8s"
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: "Real-time Chat",
                description: "Message and collaborate with your connections",
                delay: "1s"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center p-4 sm:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;