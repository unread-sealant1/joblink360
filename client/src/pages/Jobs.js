import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { PlusIcon, BriefcaseIcon, MapPinIcon, CurrencyDollarIcon, BuildingOfficeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    availableUntil: ''
  });
  const { user } = useAuth();
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

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', formData);
      toast.success('Job posted successfully!');
      setShowCreateForm(false);
      setFormData({ title: '', company: '', description: '', location: '', salary: '', jobType: 'Full-time', availableUntil: '' });
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
              <p className="text-gray-600">Discover your next career opportunity</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PlusIcon className="h-6 w-6" />
              <span>Post a Job</span>
            </button>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-green-800 font-semibold">Are you a recruiter?</p>
                <p className="text-green-700 text-sm">Post your job openings and connect with talented professionals on JobLink360.</p>
              </div>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreateJob} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Google"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    placeholder="Describe the role, responsibilities, and requirements..."
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. New York, NY"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. $80,000 - $120,000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                      value={formData.jobType}
                      onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Until (optional)</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    value={formData.availableUntil}
                    onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 text-white py-3 rounded-xl hover:from-primary-700 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    Post Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 hover:text-primary-600 cursor-pointer transition-colors truncate" 
                          onClick={() => navigate(`/jobs/${job._id}`)}>
                        {job.title}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-700 font-medium mb-2 truncate">{job.company}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <BriefcaseIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                          {job.jobType}
                        </div>
                        {job.salary && (
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                            <span className="truncate">{job.salary}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start">
                    {job.jobType}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {job.postedBy.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{job.postedBy.name}</span>
                      <span className="mx-1">•</span>
                      {formatDistanceToNow(new Date(job.createdAt))} ago
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium w-full sm:w-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BriefcaseIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs available</h3>
              <p className="text-gray-500 mb-6">Be the first to post a job opportunity</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Post First Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;