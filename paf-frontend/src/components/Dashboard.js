import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [hashtags, setHashtags] = useState('');
  const [newHashtags, setNewHashtags] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user', {
          withCredentials: true,
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try logging in again.');
        setLoading(false);
        if (err.response && err.response.status === 401) {
          navigate('/');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // New useEffect to fetch hashtags separately after user is loaded
  useEffect(() => {
    if (!user) return;

    const fetchHashtags = async () => {
      try {
        // Replace the ID below with your actual user ID or relevant id from user if applicable
        const id = user.userId
        const res = await axios.get(`http://localhost:8080/api/getHashtags/${user.userId}`, {
          withCredentials: true,
        });
        // Assuming response has a field 'hashtags' containing the string
        setHashtags(res.data.hashtags || '');
      } catch (err) {
        console.error('Error fetching hashtags:', err);
      }
    };

    fetchHashtags();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8080/api/logout',
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Error during logout:', err);
      navigate('/');
    }
  };

  const handleUpdateHashtags = async () => {
    if (!newHashtags.trim()) return; // Don't send empty hashtags
    try {
      await axios.put(
        'http://localhost:8080/api/addHashtags',
        {
          id: user.userId, 
          hashtags: newHashtags,
        },
        {
          withCredentials: true,
        }
      );
      setHashtags(newHashtags);
      setNewHashtags('');
    } catch (err) {
      console.error('Error updating hashtags:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Header user={user} />
      <div className="dashboard-container p-6">
        <header className="dashboard-header flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        <div className="profile-card bg-white rounded shadow p-6 max-w-md mx-auto">
          <div className="profile-header flex items-center mb-6">
            <img
              src={user.picture}
              alt="Profile"
              className="profile-picture w-20 h-20 rounded-full mr-4"
            />
            <div className="profile-info">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="profile-details">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="info-row flex justify-between py-2 border-b border-gray-200">
              <span className="label font-medium text-gray-600">Name:</span>
              <span className="value">{user.name}</span>
            </div>
            <div className="info-row flex justify-between py-2 border-b border-gray-200">
              <span className="label font-medium text-gray-600">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-row flex justify-between py-2 border-b border-gray-200">
              <span className="label font-medium text-gray-600">Hashtags:</span>
              <span className="value">{hashtags || 'No hashtags available'}</span>
            </div>

            <div className="hashtag-update mt-4 flex space-x-3">
              <input
                type="text"
                placeholder="#new #hashtags"
                value={newHashtags}
                onChange={(e) => setNewHashtags(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUpdateHashtags}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Update Hashtags
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
