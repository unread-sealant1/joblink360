import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { PencilIcon, MapPinIcon, LinkIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    location: '',
    skills: [],
    links: { github: '', linkedin: '', website: '' }
  });

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        title: response.data.title || '',
        bio: response.data.bio || '',
        location: response.data.location || '',
        skills: response.data.skills || [],
        links: response.data.links || { github: '', linkedin: '', website: '' }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/users/${id}`, formData);
      setUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData({ ...formData, skills });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-32"></div>
        
        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          <div className="flex items-end space-x-6 -mt-16">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1 pt-16">
              <div className="flex justify-between items-start">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Your title"
                      className="text-lg text-gray-600 mt-1 border-b border-gray-300 focus:outline-none focus:border-primary-500"
                    />
                  ) : (
                    <p className="text-lg text-gray-600 mt-1">{user.title || 'Professional'}</p>
                  )}
                  
                  {user.location && (
                    <div className="flex items-center mt-2 text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="border-b border-gray-300 focus:outline-none focus:border-primary-500"
                        />
                      ) : (
                        <span>{user.location}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {isOwnProfile && (
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-gray-600">
                {user.bio || 'No bio available.'}
              </p>
            )}
          </div>

          {/* Skills Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            {isEditing ? (
              <input
                type="text"
                value={formData.skills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="Enter skills separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed.</p>
                )}
              </div>
            )}
          </div>

          {/* Links Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Links</h2>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="url"
                  value={formData.links.github}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    links: { ...formData.links, github: e.target.value }
                  })}
                  placeholder="GitHub URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  type="url"
                  value={formData.links.linkedin}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    links: { ...formData.links, linkedin: e.target.value }
                  })}
                  placeholder="LinkedIn URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  type="url"
                  value={formData.links.website}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    links: { ...formData.links, website: e.target.value }
                  })}
                  placeholder="Website URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            ) : (
              <div className="space-y-2">
                {user.links?.github && (
                  <a
                    href={user.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                )}
                {user.links?.linkedin && (
                  <a
                    href={user.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                )}
                {user.links?.website && (
                  <a
                    href={user.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Website
                  </a>
                )}
                {(!user.links?.github && !user.links?.linkedin && !user.links?.website) && (
                  <p className="text-gray-500">No links available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;