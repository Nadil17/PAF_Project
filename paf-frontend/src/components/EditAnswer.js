import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditAnswer() {
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingAnswer, setFetchingAnswer] = useState(true);
  const [error, setError] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const { id } = useParams(); // Get answer ID from URL
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
        setError('You must be logged in to edit an answer.');
        setLoading(false);
        // Redirect to login after a short delay
        setTimeout(() => navigate('/'), 2000);
      }
    };
    fetchUserData();
  }, [navigate]);

  // Fetch answer data
  useEffect(() => {
    const fetchAnswerData = async () => {
      if (!user) return; // Wait for user data first
      
      setFetchingAnswer(true);
      try {
        // You'll need to create an endpoint to fetch a single answer by ID
        const response = await axios.get(`http://localhost:8080/api/answers/${id}`, {
          withCredentials: true
        });
        
        const answer = response.data;
        
        // Store the question ID for navigation
        setQuestionId(answer.questionId);
        
        // Check if the current user is the author
        if (answer.authorEmail !== user.email) {
          setError("You don't have permission to edit this answer.");
          setTimeout(() => navigate(`/questions/${answer.questionId}`), 2000);
          return;
        }
        
        // Set form data
        setContent(answer.content);
        setFetchingAnswer(false);
      } catch (err) {
        console.error('Error fetching answer:', err);
        setError('Failed to load answer data. Please try again.');
        setFetchingAnswer(false);
      }
    };
    
    if (user) {
      fetchAnswerData();
    }
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!content.trim()) {
      setError('Please provide content for your answer.');
      return;
    }

    // Clear previous errors before submitting
    setError(null);

    try {
      // Send PUT request to update the answer
      await axios.put(`http://localhost:8080/api/answers/${id}`, {
        content: content
      }, {
        withCredentials: true // Include cookies/session
      });

      // Redirect to the question's detail page
      navigate(`/questions/${questionId}`);

    } catch (err) {
      console.error('Error updating answer:', err);
      // Check for specific error types
      if (err.response && err.response.status === 401) {
        setError('You must be logged in to edit an answer. Please log in and try again.');
      } else if (err.response && err.response.status === 403) {
        setError("You don't have permission to edit this answer.");
      } else {
        setError('Failed to update your answer. Please try again.');
      }
    }
  };

  // Display loading state
  if (loading || fetchingAnswer) {
    return (
      <div className="max-w-4xl mx-auto p-5 bg-emerald-50 min-h-screen font-['Montserrat',_sans-serif]">
        <div className="mb-8 text-center bg-gradient-to-r from-green-800 to-emerald-600 py-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Edit Answer</h1>
          </div>
          <p className="text-yellow-100 italic">Improving your harvest of knowledge</p>
        </div>
        <div className="text-center py-10 text-emerald-800 font-semibold">
          <svg className="animate-spin h-10 w-10 mx-auto text-emerald-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading answer data...
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
            <h1 className="text-3xl font-bold text-white">Edit Answer</h1>
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
      <div className="mb-8 text-center bg-gradient-to-r from-amber-600 to-yellow-500 py-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold text-white">Edit Answer</h1>
        </div>
        <p className="text-white italic">Refining your knowledge contribution</p>
      </div>

      {/* Display general error messages */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 mb-6 rounded-lg border-l-4 border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md">
        <div className="mb-6">
          <label htmlFor="content" className="block mb-2 font-bold text-amber-800">Your Answer</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your knowledge or expertise to help answer this question."
            rows="10"
            required
            className="w-full p-4 border border-amber-300 rounded-lg text-base font-normal resize-y min-h-40 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-100 text-gray-800 border border-gray-300 py-3 px-6 rounded-full font-semibold transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            onClick={() => navigate(`/questions/${questionId}`)} // Navigate back to the question
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold text-lg transition-all hover:bg-amber-700 hover:shadow-md transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Update Answer
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

export default EditAnswer;