import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { formatDistanceToNow } from 'date-fns';
import { BriefcaseIcon, MapPinIcon, CurrencyDollarIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Feed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest Opportunities</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover your next career move</p>
        </div>

        {/* Job Cards */}
        <div className="space-y-4 sm:space-y-6">
          {jobs.map((job, index) => (
            <div 
              key={job._id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-4 sm:p-6">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors truncate" 
                            onClick={() => navigate(`/jobs/${job._id}`)}>
                          {job.title}
                        </h3>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium truncate">{job.company}</p>
                      </div>
                    </div>
                  </div>
                  <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ml-3 flex-shrink-0">
                    {job.jobType}
                  </span>
                </div>

                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <BriefcaseIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 flex-shrink-0" />
                    {job.jobType}
                  </div>
                  {job.salary && (
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 flex-shrink-0" />
                      <span className="truncate">{job.salary}</span>
                    </div>
                  )}
                </div>

                {/* Job Description */}
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs sm:text-sm font-semibold">
                        {job.postedBy.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 min-w-0">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{job.postedBy.name}</span>
                      <span className="mx-1">•</span>
                      <span className="truncate">{formatDistanceToNow(new Date(job.createdAt))} ago</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base w-full sm:w-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-12 sm:py-16 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BriefcaseIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs available</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Be the first to discover new opportunities</p>
              <button
                onClick={() => navigate('/jobs')}
                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Browse All Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;