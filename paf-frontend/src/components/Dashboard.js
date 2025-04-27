import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user', {
          withCredentials: true
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try logging in again.');
        setLoading(false);
        // Redirect to login if unauthorized
        if (err.response && err.response.status === 401) {
          navigate('/');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/logout', {}, {
        withCredentials: true
      });
      // Clear any local state if needed
      setUser(null);
      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Error during logout:', err);
      // Even if the request fails, we can still redirect the user
      navigate('/');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-center gap-6 border-b border-gray-200">
          <img 
            src={user.picture} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center py-2">
              <span className="font-medium text-gray-700 w-24">Name:</span>
              <span className="text-gray-800">{user.name}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center py-2">
              <span className="font-medium text-gray-700 w-24">Email:</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;