import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, ArrowLeftIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`);
      toast.success('Application submitted successfully!');
      fetchJob();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
          <p className="text-gray-600">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const hasApplied = job.applicants?.some(applicant => applicant._id === user._id);
  const isOwner = job.postedBy._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-8 font-medium hover:bg-primary-50 px-3 py-2 rounded-lg transition-all"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 px-4 sm:px-8 py-6 sm:py-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <BuildingOfficeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{job.title}</h1>
                  <h2 className="text-lg sm:text-xl font-medium opacity-90">{job.company}</h2>
                </div>
              </div>

              {!isOwner && (
                <div className="flex-shrink-0 w-full sm:w-auto">
                  {hasApplied ? (
                    <div className="bg-green-500 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 w-full sm:w-auto">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Applied</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="bg-white text-primary-600 px-6 sm:px-8 py-3 rounded-xl hover:bg-gray-50 font-semibold disabled:opacity-50 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
                    >
                      {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 text-white text-opacity-90 text-sm sm:text-base">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                {job.jobType}
              </div>
              {job.salary && (
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  {job.salary}
                </div>
              )}
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Job Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">{job.description}</p>
              </div>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {job.postedBy.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{job.postedBy.name}</p>
                    <p className="text-sm text-gray-500">
                      Posted {formatDistanceToNow(new Date(job.createdAt))} ago
                    </p>
                  </div>
                </div>
                
                {!isOwner && !hasApplied && (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 sm:px-8 py-3 rounded-xl hover:from-primary-700 hover:to-blue-700 font-semibold disabled:opacity-50 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;