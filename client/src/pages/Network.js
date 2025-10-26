import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlusIcon, CheckIcon, XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Network = () => {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [networkUsers, setNetworkUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, connectionsRes, networkRes] = await Promise.all([
        api.get('/users'),
        api.get('/connections'),
        api.get('/connections/network')
      ]);
      
      setUsers(usersRes.data.filter(u => u._id !== user._id));
      setConnections(connectionsRes.data);
      setNetworkUsers(networkRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (recipientId) => {
    try {
      await api.post('/connections/send', { recipientId });
      toast.success('Connection request sent!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const respondToConnection = async (connectionId, status) => {
    try {
      await api.post('/connections/respond', { connectionId, status });
      toast.success(`Connection ${status}!`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to respond');
    }
  };

  const getConnectionStatus = (userId) => {
    return connections.find(conn => 
      (conn.requester._id === userId || conn.recipient._id === userId)
    );
  };

  const getPendingRequests = () => {
    return connections.filter(conn => 
      conn.recipient._id === user._id && conn.status === 'pending'
    );
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Network</h1>
        <p className="text-gray-600">Connect with professionals in your industry</p>
      </div>

      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'discover' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Discover People
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'requests' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Requests ({getPendingRequests().length})
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'network' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          My Network ({networkUsers.length})
        </button>
      </div>

      {activeTab === 'discover' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((person) => {
            const connectionStatus = getConnectionStatus(person._id);
            return (
              <div key={person._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xl font-semibold text-gray-600">
                      {person.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{person.name}</h3>
                  <p className="text-gray-600 mb-2">{person.title || 'Professional'}</p>
                  <p className="text-sm text-gray-500 mb-4">{person.location}</p>
                  
                  {!connectionStatus ? (
                    <button
                      onClick={() => sendConnectionRequest(person._id)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2 mx-auto"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      <span>Connect</span>
                    </button>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {connectionStatus.status === 'pending' && 'Request Pending'}
                      {connectionStatus.status === 'accepted' && 'Connected'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {getPendingRequests().map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {request.requester.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.requester.name}</h3>
                    <p className="text-gray-600">wants to connect with you</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => respondToConnection(request._id, 'accepted')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-1"
                  >
                    <CheckIcon className="h-4 w-4" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => respondToConnection(request._id, 'declined')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {getPendingRequests().length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'network' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {networkUsers.map((person) => (
            <div key={person._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">
                    {person.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{person.name}</h3>
                <p className="text-gray-600 mb-2">{person.title || 'Professional'}</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  Message
                </button>
              </div>
            </div>
          ))}
          
          {networkUsers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
              <p className="text-gray-500">Start connecting with professionals to build your network</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Network;