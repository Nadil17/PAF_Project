import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo and brand name */}
        <Link className="text-3xl font-bold text-white hover:text-green-200 transition-all" to="/">
          <span className="text-yellow-400">Farme</span>Sense
        </Link>

        {/* Desktop navigation links */}
        <div className="flex space-x-8 items-center">
          
          {!currentUser && (
            <Link className="text-lg hover:text-yellow-200 transition-all" to="/about">About Us</Link>
          )}
          <Link className="text-lg hover:text-yellow-200 transition-all" to="/contact">Contact</Link>

          {currentUser ? (
            <>
              <Link className="text-lg hover:text-yellow-200 transition-all" to="/products">Products</Link>

              {/* AI Dropdown */}
              <div className="relative">
                <button
                  className="text-lg hover:text-yellow-200 transition-all"
                  onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
                >
                  AI ▼
                </button>
                {aiDropdownOpen && (
                  <div className="absolute bg-white text-gray-800 shadow-lg rounded-lg mt-2 w-40">
                    <Link
                      to="/ImgAi"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setAiDropdownOpen(false)}
                    >
                      Image Analyzer
                    </Link>
                    <Link
                      to="/TxtAi"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => setAiDropdownOpen(false)}
                    >
                      Text Analyzer
                    </Link>
                  </div>
                )}
              </div>

              <Link className="text-lg hover:text-yellow-200 transition-all" to="/order">Order</Link>
              <button 
                className="text-lg hover:text-yellow-200 transition-all"
                onClick={handleLogout}
              >
                Logout
              </button>
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
};

export default Navbar;
