import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
 

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
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <Header user={user} />
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={user.picture} 
            alt="Profile" 
            className="profile-picture" 
          />
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        
        <div className="profile-details">
          <h3>Account Information</h3>
          <div className="info-row">
            <span className="label">Name:</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;