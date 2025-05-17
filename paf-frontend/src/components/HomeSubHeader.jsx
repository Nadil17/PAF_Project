// src/components/HomeSubHeader.jsx
import React from 'react';

function HomeSubHeader({ view, setView }) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => setView('posts')}
        className={`px-4 py-2 rounded-full ${
          view === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        Posts
      </button>
      <button
        onClick={() => setView('learning')}
        className={`px-4 py-2 rounded-full ${
          view === 'learning' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        Learning Plans
      </button>
    </div>
  );
}

export default HomeSubHeader;
