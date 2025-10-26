import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary-600">JobLink360</div>
            <div className="space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-primary-600">Login</Link>
              <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect. Network. <span className="text-primary-600">Grow.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Join JobLink360, the professional networking platform where opportunities meet talent. 
            Build your network, find your dream job, and advance your career.
          </p>
          <p className="text-sm text-gray-500 mb-12">
            Created by <span className="font-semibold">Cassidy Mahlatse Masila</span>
          </p>
          
          <div className="space-x-4 mb-8">
            <Link to="/register" className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition">
              Join as Job Seeker
            </Link>
            <Link to="/register" className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
              Sign Up as Recruiter
            </Link>
          </div>
          <div className="mb-16">
            <Link to="/jobs" className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition">
              Browse Jobs
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-6">
              <BriefcaseIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Jobs</h3>
              <p className="text-gray-600">Discover opportunities from top companies and startups</p>
            </div>
            
            <div className="text-center p-6">
              <UserGroupIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Build Network</h3>
              <p className="text-gray-600">Connect with professionals in your industry</p>
            </div>
            
            <div className="text-center p-6">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Message and collaborate with your connections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;