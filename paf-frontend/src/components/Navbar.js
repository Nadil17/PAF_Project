// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-6">
        <li>
          <Link to="/home" className="text-white hover:underline font-semibold">
            Home
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="text-white hover:underline font-semibold">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/createpost" className="text-white hover:underline font-semibold">
            Create Post
          </Link>
        </li>
        <li>
          <Link to="/comment" className="text-white hover:underline font-semibold">
            Comment
          </Link>
        </li>
        <li>
          <Link to="/commentsection" className="text-white hover:underline font-semibold">
            Comment Section
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
