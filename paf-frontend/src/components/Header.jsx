import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaSearch } from 'react-icons/fa';

function Header({ user }) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch all users when component mounts
    axios.get('http://localhost:8080/api/getAllUsers')
      .then((res) => {
        setAllUsers(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch users', err);
      });
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== '') {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // You might need to implement proper logout functionality
      // For now, just navigate to login page
      navigate("/login");
    }
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo and brand name */}
        <Link className="text-3xl font-bold text-white hover:text-green-200 transition-all" to="/home">
          <span className="text-yellow-400">Learn</span>Hub
        </Link>

        {/* Search bar */}
        <div className="relative w-1/3">
          <div className="flex items-center relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            />
            <FaSearch className="absolute right-3 text-gray-500" />
          </div>
          {showDropdown && filteredUsers.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow max-h-60 overflow-y-auto">
              {filteredUsers.map((u) => (
                <li
                  key={u.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2 text-gray-700"
                  onClick={() => {
                    setSearchTerm('');
                    setShowDropdown(false);
                    navigate(`/searchauser/${u.id}`);
                  }}
                >
                  <img src={u.imageUrl} alt={u.name} className="w-6 h-6 rounded-full" />
                  <span>{u.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desktop navigation links */}
        <div className="flex space-x-8 items-center">
          <Link className="text-lg hover:text-yellow-200 transition-all" to="/home">
            <FaHome />
          </Link>
          
          {user ? (
            <>
              {/* AI Dropdown */}
              <div className="relative">
                <button
                  className="text-lg hover:text-yellow-200 transition-all"
                  onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
                >
                  Learning ▼
                </button>
                {aiDropdownOpen && (
                  <div className="absolute bg-white text-gray-800 shadow-lg rounded-lg mt-2 w-48">
                    <Link
                      to="/createPost"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setAiDropdownOpen(false)}
                    >
                      Create Post
                    </Link>
                    <Link
                      to="/create_a_learning_plan"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setAiDropdownOpen(false)}
                    >
                      Create Learning Plan
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                className="text-lg hover:text-yellow-200 transition-all" 
                to="/dashboard"
              >
                Dashboard
              </Link>

              <Link 
                className="text-lg hover:text-yellow-200 transition-all" 
                to="/questions"
              >
                Questions
              </Link>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-green-800 font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user?.name || 'User'}</span>
              </div>

              {/* <button 
                className="text-lg hover:text-yellow-200 transition-all"
                onClick={handleLogout}
              >
                Logout
              </button> */}
            </>
          ) : (
            <>
              <Link className="text-lg hover:text-yellow-200 transition-all" to="/login">Login</Link>
              <Link className="text-lg hover:text-yellow-200 transition-all" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
