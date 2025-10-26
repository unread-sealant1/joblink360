import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { PlusIcon, BriefcaseIcon, MapPinIcon, CurrencyDollarIcon, BuildingOfficeIcon, XMarkIcon, HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [likedJobs, setLikedJobs] = useState(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    availableUntil: '',
    skills: ''
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
      setFilteredJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    let filtered = jobs;
    
    if (filters.keyword) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }
    
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }
    
    setFilteredJobs(filtered);
  };

  const handleSaveJob = (jobId) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
      toast.success('Job removed from saved');
    } else {
      newSaved.add(jobId);
      toast.success('Job saved successfully');
    }
    setSavedJobs(newSaved);
  };

  const handleLikeJob = (jobId) => {
    const newLiked = new Set(likedJobs);
    if (newLiked.has(jobId)) {
      newLiked.delete(jobId);
    } else {
      newLiked.add(jobId);
      toast.success('Job liked!');
    }
    setLikedJobs(newLiked);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      await api.post('/jobs', jobData);
      toast.success('Job posted successfully!');
      setShowCreateForm(false);
      setFormData({ title: '', company: '', description: '', location: '', salary: '', jobType: 'Full-time', availableUntil: '', skills: '' });
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Discover Opportunities
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {filteredJobs.length} jobs available • Find your perfect match
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <PlusIcon className="h-6 w-6" />
            <span>Post Job</span>
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Job Grid */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <div 
              key={job._id} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <BuildingOfficeIcon className="h-7 w-7 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors line-clamp-1" 
                          onClick={() => navigate(`/jobs/${job._id}`)}>
                        {job.title}
                      </h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300 font-semibold line-clamp-1">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => handleLikeJob(job._id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      {likedJobs.has(job._id) ? 
                        <HeartSolid className="h-5 w-5 text-red-500" /> : 
                        <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                      }
                    </button>
                    <button
                      onClick={() => handleSaveJob(job._id)}
                      className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    >
                      {savedJobs.has(job._id) ? 
                        <BookmarkSolid className="h-5 w-5 text-primary-600" /> : 
                        <BookmarkIcon className="h-5 w-5 text-gray-400 hover:text-primary-600" />
                      }
                    </button>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <MapPinIcon className="h-4 w-4 mr-1.5" />
                    {job.location}
                  </div>
                  <div className="flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full">
                    <BriefcaseIcon className="h-4 w-4 mr-1.5" />
                    {job.jobType}
                  </div>
                  {job.salary && (
                    <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1.5" />
                      {job.salary}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {job.postedBy.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{job.postedBy.name}</span>
                      <div className="text-xs">{formatDistanceToNow(new Date(job.createdAt))} ago</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 py-2 rounded-xl transition-colors duration-200 font-semibold group-hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BriefcaseIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Try adjusting your search filters or be the first to post a job</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Post First Job
            </button>
          </div>
        )}

        {/* Create Job Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Post New Job</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreateJob} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Google"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Description</label>
                  <textarea
                    placeholder="Describe the role, responsibilities, and requirements..."
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Required Skills</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Python (comma separated)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. New York, NY"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salary</label>
                    <input
                      type="text"
                      placeholder="e.g. $80,000 - $120,000"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
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
                
                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Post Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 py-4 rounded-xl font-bold text-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;