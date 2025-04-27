// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function AskQuestion() {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user is logged in
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/user', {
//           withCredentials: true
//         });
//         setUser(response.data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//         setError('You must be logged in to ask a question.');
//         setLoading(false);
//         // Redirect to login after a short delay
//         setTimeout(() => navigate('/'), 2000);
//       }
//     };
//     fetchUserData();
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!title.trim() || !content.trim()) {
//       setError('Please provide both a title and content for your question.');
//       return;
//     }
    
//     try {
//       const response = await axios.post('http://localhost:8080/api/questions', {
//         title: title,
//         content: content
//       }, {
//         withCredentials: true
//       });
      
//       // Redirect to the newly created question
//       navigate(`/questions/${response.data.id}`);
//     } catch (err) {
//       console.error('Error submitting question:', err);
//       setError('Failed to submit your question. Please try again.');
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-10 text-gray-600">Loading...</div>;
//   }

//   if (error && !user) {
//     return <div className="text-center py-10 text-red-600">{error}</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-5">
//       <h1 className="mb-5 text-center text-gray-800 text-2xl font-bold">Ask a Question</h1>
      
//       {error && <div className="bg-red-50 text-red-700 p-3 mb-5 rounded border-l-4 border-red-700">{error}</div>}
      
//       <form onSubmit={handleSubmit} className="bg-white rounded-lg p-5 shadow-md">
//         <div className="mb-5">
//           <label htmlFor="title" className="block mb-2 font-bold text-gray-700">Question Title</label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="What's your question? Be specific."
//             required
//             className="w-full p-3 border border-gray-300 rounded text-base font-normal"
//           />
//         </div>
        
//         <div className="mb-5">
//           <label htmlFor="content" className="block mb-2 font-bold text-gray-700">Question Details</label>
//           <textarea
//             id="content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Provide details about your question. Include any relevant context or examples."
//             rows="10"
//             required
//             className="w-full p-3 border border-gray-300 rounded text-base font-normal resize-y min-h-40"
//           />
//         </div>
        
//         <div className="flex justify-end gap-3">
//           <button type="submit" className="bg-blue-600 text-white border-none py-2 px-5 rounded font-bold cursor-pointer transition-colors hover:bg-blue-700">
//             Post Your Question
//           </button>
//           <button 
//             type="button" 
//             className="bg-gray-100 text-gray-800 border border-gray-300 py-2 px-5 rounded cursor-pointer transition-colors hover:bg-gray-200"
//             onClick={() => navigate('/questions')}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default AskQuestion;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AskQuestion() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user', {
          withCredentials: true
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('You must be logged in to ask a question.');
        setLoading(false);
        // Redirect to login after a short delay
        // Note: In a real app, navigating to '/' might not be the login page.
        // You might navigate to a dedicated login route like '/login'.
        setTimeout(() => navigate('/'), 2000);
      }
    };
    fetchUserData();
  }, [navigate]); // Depend on navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!title.trim() || !content.trim()) {
      setError('Please provide both a title and content for your question.');
      return;
    }

    // Clear previous errors before submitting
    setError(null);

    try {
      // Send POST request to create the question
      const response = await axios.post('http://localhost:8080/api/questions', {
        title: title,
        content: content
      }, {
        withCredentials: true // Include cookies/session
      });

      // Redirect to the newly created question's detail page
      // Assumes the backend returns the created question with its ID
      navigate(`/questions/${response.data.id}`);

    } catch (err) {
      console.error('Error submitting question:', err);
       // Check for specific error types if needed (e.g., validation errors from backend)
       if (err.response && err.response.status === 401) {
            setError('You must be logged in to post a question. Please log in and try again.');
            // Optionally redirect to login
            // setTimeout(() => navigate('/'), 2000);
       } else {
            setError('Failed to submit your question. Please try again.');
       }
    }
  };

  // Display loading state
  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  // Display error and prevent form if user is not logged in
  if (error && !user) {
      // The useEffect already handles redirection, but this ensures the message is shown first
      return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  // Render the form only if user is loaded (implies logged in based on useEffect logic)
  // Although the check `!user` above handles the not-logged-in case,
  // rendering the form is safe here because loading is false and no error was set that would prevent render.
  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="mb-5 text-center text-gray-800 text-2xl font-bold">Ask a Question</h1>

      {/* Display general error messages */}
      {error && <div className="bg-red-50 text-red-700 p-3 mb-5 rounded border-l-4 border-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-5 shadow-md">
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 font-bold text-gray-700">Question Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question? Be specific."
            required
            className="w-full p-3 border border-gray-300 rounded text-base font-normal focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="content" className="block mb-2 font-bold text-gray-700">Question Details</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide details about your question. Include any relevant context or examples."
            rows="10"
            required
            className="w-full p-3 border border-gray-300 rounded text-base font-normal resize-y min-h-40 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button type="submit" className="bg-blue-600 text-white border-none py-2 px-5 rounded font-bold cursor-pointer transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Post Your Question
          </button>
          <button
            type="button"
            className="bg-gray-100 text-gray-800 border border-gray-300 py-2 px-5 rounded cursor-pointer transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            onClick={() => navigate('/questions')} // Navigate back to the questions list
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AskQuestion;