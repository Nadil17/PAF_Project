import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditQuestion() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingQuestion, setFetchingQuestion] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get question ID from URL
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user', {
          withCredentials: true
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('You must be logged in to edit a question.');
        setLoading(false);
        // Redirect to login after a short delay
        setTimeout(() => navigate('/'), 2000);
      }
    };
    fetchUserData();
  }, [navigate]);

  // Fetch question data
  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!user) return; // Wait for user data first
      
      setFetchingQuestion(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/questions/${id}`, {
          withCredentials: true
        });
        
        const question = response.data;
        
        // Check if the current user is the author
        if (question.authorEmail !== user.email) {
          setError("You don't have permission to edit this question.");
          setTimeout(() => navigate(`/questions/${id}`), 2000);
          return;
        }
        
        // Set form data
        setTitle(question.title);
        setContent(question.content);
        setFetchingQuestion(false);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load question data. Please try again.');
        setFetchingQuestion(false);
      }
    };
    
    if (user) {
      fetchQuestionData();
    }
  }, [id, user, navigate]);

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
      // Send PUT request to update the question
      const response = await axios.put(`http://localhost:8080/api/questions/${id}`, {
        title: title,
        content: content
      }, {
        withCredentials: true // Include cookies/session
      });

      // Redirect to the question's detail page
      navigate(`/questions/${id}`);

    } catch (err) {
      console.error('Error updating question:', err);
      // Check for specific error types
      if (err.response && err.response.status === 401) {
        setError('You must be logged in to edit a question. Please log in and try again.');
      } else if (err.response && err.response.status === 403) {
        setError("You don't have permission to edit this question.");
      } else {
        setError('Failed to update your question. Please try again.');
      }
    }
  };

  // Display loading state
  if (loading || fetchingQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-5 bg-emerald-50 min-h-screen font-['Montserrat',_sans-serif]">
        <div className="mb-8 text-center bg-gradient-to-r from-green-800 to-emerald-600 py-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Edit Question</h1>
          </div>
          <p className="text-yellow-100 italic">Improving your harvest of knowledge</p>
        </div>
        <div className="text-center py-10 text-emerald-800 font-semibold">
          <svg className="animate-spin h-10 w-10 mx-auto text-emerald-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading question data...
        </div>
      </div>
    );
  }

  // Display error and prevent form if there's an issue
  if (error && !user) {
    return (
      <div className="max-w-4xl mx-auto p-5 bg-emerald-50 min-h-screen font-['Montserrat',_sans-serif]">
        <div className="mb-8 text-center bg-gradient-to-r from-green-800 to-emerald-600 py-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Edit Question</h1>
          </div>
          <p className="text-yellow-100 italic">Improving your harvest of knowledge</p>
        </div>
        <div className="text-center py-10 text-red-700 font-semibold bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5 bg-emerald-50 min-h-screen font-['Montserrat',_sans-serif]">
      {/* Header with farming-themed design */}
      <div className="mb-8 text-center bg-gradient-to-r from-green-800 to-emerald-600 py-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h1 className="text-3xl font-bold text-white">Edit Question</h1>
        </div>
        <p className="text-yellow-100 italic">Nurturing your planted question</p>
      </div>

      {/* Display general error messages */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-lg border-l-4 border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md">
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-bold text-emerald-900">Question Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question? Be specific."
            required
            className="w-full p-4 border border-emerald-300 rounded-lg text-base font-normal focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block mb-2 font-bold text-emerald-900">Question Details</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide details about your question. Include any relevant context or examples."
            rows="10"
            required
            className="w-full p-4 border border-emerald-300 rounded-lg text-base font-normal resize-y min-h-40 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-100 text-gray-800 border border-gray-300 py-3 px-6 rounded-full font-semibold transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            onClick={() => navigate(`/questions/${id}`)} // Navigate back to the question
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold text-lg transition-all hover:bg-emerald-800 hover:shadow-md transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Update Question
          </button>
        </div>
      </form>
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-emerald-700 border-t border-emerald-200 pt-4">
        <p>© 2025 Farm Knowledge Exchange - Growing Together</p>
      </div>
    </div>
  );
}

export default EditQuestion;