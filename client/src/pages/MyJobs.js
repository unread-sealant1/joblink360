import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { BriefcaseIcon, MapPinIcon, CurrencyDollarIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await api.get('/jobs');
      const myJobs = response.data.filter(job => job.postedBy._id === user._id);
      setJobs(myJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      fetchMyJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Job Postings</h1>
        <p className="text-gray-600">Manage your job listings and track applications</p>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => {
          const isExpired = job.availableUntil && new Date(job.availableUntil) < new Date();
          
          return (
            <div key={job._id} className={`bg-white rounded-lg shadow-md p-6 border ${isExpired ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    {isExpired && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                        EXPIRED
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-1" />
                      {job.jobType}
                    </div>
                    {job.salary && (
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <div>Posted {formatDistanceToNow(new Date(job.createdAt))} ago</div>
                      {job.availableUntil && (
                        <div className={isExpired ? 'text-red-600' : ''}>
                          Available until: {new Date(job.availableUntil).toLocaleDateString()}
                        </div>
                      )}
                      <div className="font-medium text-primary-600">
                        {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="flex items-center space-x-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-4">Start by posting your first job opportunity</p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Post a Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;