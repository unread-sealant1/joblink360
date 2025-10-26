import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import StatsCard from '../components/StatsCard';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    myApplications: 0,
    networkSize: 0,
    profileViews: 0,
    messagesCount: 0,
    jobsPosted: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [jobsRes, connectionsRes, messagesRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/connections'),
        api.get('/messages/conversations')
      ]);

      const myJobs = jobsRes.data.filter(job => job.postedBy._id === user._id);
      const myApplications = jobsRes.data.filter(job => 
        job.applicants && job.applicants.some(applicant => applicant._id === user._id)
      );

      setStats({
        totalJobs: jobsRes.data.length,
        myApplications: myApplications.length,
        networkSize: connectionsRes.data.filter(conn => conn.status === 'accepted').length,
        profileViews: Math.floor(Math.random() * 100) + 50, // Mock data
        messagesCount: messagesRes.data.length,
        jobsPosted: myJobs.length
      });

      // Mock recent activity
      setRecentActivity([
        { type: 'application', message: 'Applied to Software Engineer at TechCorp', time: '2 hours ago' },
        { type: 'connection', message: 'Connected with John Doe', time: '1 day ago' },
        { type: 'job_post', message: 'Posted new job: Frontend Developer', time: '3 days ago' },
        { type: 'message', message: 'Received message from Jane Smith', time: '1 week ago' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Here's what's happening with your career journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={BriefcaseIcon}
            title="Available Jobs"
            value={stats.totalJobs}
            change={12}
            color="primary"
          />
          <StatsCard
            icon={ArrowTrendingUpIcon}
            title="My Applications"
            value={stats.myApplications}
            change={8}
            color="green"
          />
          <StatsCard
            icon={UserGroupIcon}
            title="Network Size"
            value={stats.networkSize}
            change={15}
            color="purple"
          />
          <StatsCard
            icon={EyeIcon}
            title="Profile Views"
            value={stats.profileViews}
            change={-3}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.type === 'application' ? 'bg-blue-500' :
                      activity.type === 'connection' ? 'bg-green-500' :
                      activity.type === 'job_post' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5">
                  Browse Jobs
                </button>
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5">
                  Post a Job
                </button>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5">
                  Find Connections
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Strength</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Completion</span>
                    <span className="font-semibold text-gray-900 dark:text-white">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add skills and experience to reach 100%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;