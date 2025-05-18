// src/components/HomeSubHeader.jsx
import React from 'react';

function HomeSubHeader({ view, setView }) {
  return (
    <div className="flex justify-center space-x-6 mb-6">
      <button
        onClick={() => setView('posts')}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          view === 'posts'
            ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
            : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
        }`}
      >
        Posts
      </button>
      <button
        onClick={() => setView('learning')}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          view === 'learning'
            ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
            : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
        }`}
      >
        Learning Plans
      </button>
    </div>
  );
}

export default HomeSubHeader;
