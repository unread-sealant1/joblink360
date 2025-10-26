import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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
      fetchJob(); // Refresh to update applicant count
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Jobs
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <h2 className="text-xl text-gray-700 mb-4">{job.company}</h2>
            
            <div className="flex items-center space-x-6 text-gray-600 mb-6">
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
            </div>
          </div>

          {!isOwner && (
            <div className="ml-6">
              {hasApplied ? (
                <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold">
                  ✓ Applied
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h3>
            <ul className="list-disc list-inside space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-gray-700">{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Posted by <span className="font-medium">{job.postedBy.name}</span> • {formatDistanceToNow(new Date(job.createdAt))} ago
            </div>
            <div>
              {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;