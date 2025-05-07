import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [user, setUser] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null); // Error for answer submission
  const [answerFetchError, setAnswerFetchError] = useState(null); // Error for answer fetching

  const navigate = useNavigate();

  // New state for sorting answers
  const [answerSortBy, setAnswerSortBy] = useState('newest'); // Default sort

  useEffect(() => {
    // Check if user is logged in
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user', {
          withCredentials: true
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUser(null); 
      }
    };

    fetchUserData();
  }, []); // Run only on mount

  // Effect to fetch question details and answers based on answer sort
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setLoading(true);
      setError(null);
      setAnswerFetchError(null); // Clear previous answer fetch error

      try {
        // Fetch question details (including author email for permissions)
        const questionResponse = await axios.get(`http://localhost:8080/api/questions/${id}`, {
           withCredentials: true
        });
        // Store the question details temporarily
        const questionDetails = questionResponse.data;

        // Fetch answers separately with sorting
        let answersEndpoint = `http://localhost:8080/api/answers/question/${id}`;
        if (answerSortBy === 'upvotes') {
             answersEndpoint = `http://localhost:8080/api/answers/question/${id}/sort/upvotes`;
        } else { // 'newest'
            answersEndpoint = `http://localhost:8080/api/answers/question/${id}/sort/newest`;
        }

        const answersResponse = await axios.get(answersEndpoint, {
             withCredentials: true
        });

        // Combine question details and sorted answers
        setQuestion({
            ...questionDetails,
            answers: answersResponse.data // Backend should return List<AnswerDTO> for this endpoint
        });

        setLoading(false);

      } catch (err) {
        console.error('Error fetching question details or answers:', err);
        if (err.response && err.response.status === 404) {
             setError('Question not found.');
        } else {
             setError('Failed to load question details. Please try again.');
             
        }

        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [id, answerSortBy]); // Re-run when id or answerSortBy changes

  const handleUpvote = async (currentlyUpvoted) => {
    if (!user) {
      // Redirect to login/home if not logged in
      navigate('/');
      return;
    }

    try {
      const endpoint = currentlyUpvoted
        ? `http://localhost:8080/api/questions/${id}/remove-upvote`
        : `http://localhost:8080/api/questions/${id}/upvote`;

      const response = await axios.post(endpoint, {}, {
        withCredentials: true
      });

      // Update the question in the local state with the updated DTO
      setQuestion(response.data);

    } catch (err) {
      console.error('Error with upvote operation:', err);
    }
  };

   const handleAnswerUpvote = async (answerId, currentlyUpvoted) => {
        if (!user) {
             navigate('/');
             return;
         }

         try {
             const endpoint = currentlyUpvoted
                 ? `http://localhost:8080/api/answers/${answerId}/remove-upvote`
                 : `http://localhost:8080/api/answers/${answerId}/upvote`;

             const response = await axios.post(endpoint, {}, {
                 withCredentials: true
             });

             const updatedAnswer = response.data; 

             setQuestion(prevDetails => {
                 if (!prevDetails) return null;
                 return {
                     ...prevDetails,
                     answers: prevDetails.answers.map(answer =>
                         answer.id === answerId ? updatedAnswer : answer // Replace the old answer with the updated one
                     )
                 };
             });

         } catch (err) {
             console.error('Error with answer upvote operation:', err);
             
         }
    };


  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/');
      return;
    }

    if (!answerContent.trim()) {
      setSubmitError('Answer content cannot be empty.');
      return;
    }

    setSubmitError(null); // Clear previous submit error

    try {
      const response = await axios.post(`http://localhost:8080/api/answers/question/${id}`, {
        content: answerContent
      }, {
        withCredentials: true
      });

      
      setQuestion(prevQuestion => ({
          ...prevQuestion,
          answers: [...prevQuestion.answers, response.data]
      }));

      // Clear the answer form
      setAnswerContent('');


    } catch (err) {
      console.error('Error submitting answer:', err);
       // Check if it's an authentication error (e.g., session expired)
       if (err.response && err.response.status === 401) {
            setSubmitError('You must be logged in to submit an answer.');
            
       } else {
            setSubmitError('Failed to submit your answer. Please try again.');
       }
    }
  };

    // Basic CRUD place holders for Question (will not implement full forms here)
     const handleEditQuestion = () => {
        console.log("Edit Question:", id);
        // Edit now navigation to an edit page or open a modal
         alert(`Edit question ${id} - Edit Question`);
     };

     const handleDeleteQuestion = async () => {
         if (!user || !question || question.authorEmail !== user.email) {
              alert("You don't have permission to delete this question.");
              return;
          }
         if (window.confirm("Are you sure you want to delete this question?")) {
             try {
                 await axios.delete(`http://localhost:8080/api/questions/${id}`, {
                     withCredentials: true
                 });
                 alert("Question deleted successfully!");
                 navigate('/questions'); // Navigate back to the question list after deleting
             } catch (err) {
                 console.error('Error deleting question:', err);
                 alert("Failed to delete question. You might not have permission.");
             }
         }
     };

    // Basic CRUD place holders for Answers (will not implement full forms here)
    const handleEditAnswer = (answerId) => {
        console.log("Edit Answer:", answerId);
        // Edit now editing logic (inline form or modal)
         alert(`Edit answer ${answerId} - Edit now`);
    };

    const handleDeleteAnswer = async (answerId) => {
        // Find the answer to check authorship
        const answerToDelete = question?.answers?.find(ans => ans.id === answerId);

        if (!user || !answerToDelete || answerToDelete.authorEmail !== user.email) {
             alert("You don't have permission to delete this answer.");
             return;
         }

         if (window.confirm("Are you sure you want to delete this answer?")) {
             try {
                 await axios.delete(`http://localhost:8080/api/answers/${answerId}`, {
                     withCredentials: true
                 });
                 // Remove the answer from the state
                 setQuestion(prevDetails => {
                     if (!prevDetails) return null;
                     return {
                         ...prevDetails,
                         answers: prevDetails.answers.filter(answer => answer.id !== answerId)
                     };
                 });
                  alert("Answer deleted successfully!");
             } catch (err) {
                 console.error('Error deleting answer:', err);
                  alert("Failed to delete answer. You might not have permission.");
             }
         }
    };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading question details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

   // Ensure question and answers exist before rendering
   if (!question) {
       return <div className="text-center py-10 text-gray-600">Question data not available.</div>;
   }


  return (
    <div className="max-w-4xl mx-auto p-5">
        {/* Question Header */}
      <div className="mb-5 border-b border-gray-200 pb-4">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">{question.title}</h1>
        <div className="flex flex-wrap gap-4 text-gray-500 text-sm items-center">
          <span>Asked by {question.authorName}</span>
          <span>on {formatDate(question.createdAt)}</span>
           {/* CRUD buttons for Question if user is author */}
          {user && question.authorEmail === user.email && (
               <>
                <button className="text-xs text-blue-600 hover:underline ml-auto" onClick={handleEditQuestion}>Edit</button>
                <button className="text-xs text-red-600 hover:underline" onClick={handleDeleteQuestion}>Delete</button>
               </>
          )}
        </div>
      </div>

      {/* Question Content and Upvote */}
      <div className="flex mb-8">
        <div className="flex flex-col items-center mr-5 min-w-10">
          <button
            className={`bg-transparent border-none cursor-pointer text-2xl ${question.upvotedByCurrentUser ? 'text-orange-500' : (user ? 'text-gray-500 hover:text-orange-500' : 'text-gray-400 cursor-not-allowed')}`}
            onClick={() => handleUpvote(question.upvotedByCurrentUser)}
            disabled={!user} // Disable if not logged in
            aria-label={question.upvotedByCurrentUser ? "Remove upvote" : "Upvote question"}
          >
            ▲
          </button>
          <span className={`font-bold mt-1 text-lg ${
              question.reviews > 0
              ? 'text-orange-600'
              : 'text-gray-500'
          }`}>{question.reviews}</span> {/* Display reviews from DTO */}
        </div>

        <div className="flex-1 text-base leading-relaxed">
          <p>{question.content}</p>
        </div>
      </div>

       {/* Answers Section Header and Sorting */}
      <div className="mt-8 mb-5 pb-2 border-b border-gray-200 flex justify-between items-center">
          <h2 id="answers-section" className="text-xl font-semibold"> {/* Add ID for scrolling */}
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
           {/* Answer Sorting Controls */}
          <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm font-semibold">Sort answers by:</span>
              <select
                  className="p-1 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={answerSortBy}
                  onChange={(e) => setAnswerSortBy(e.target.value)}
              >
                  <option value="newest">Newest</option>
                  <option value="upvotes">Upvotes</option>
              </select>
          </div>
      </div>


      {/* Answers List */}
      <div className="mb-8">
        {answerFetchError && ( // Display error if fetching answers failed
             <div className="bg-red-50 text-red-700 p-3 mb-5 rounded border-l-4 border-red-700">{answerFetchError}</div>
        )}
        {/* Check if answers array exists and is not empty */}
        {question.answers && question.answers.length > 0 ? (
          question.answers.map(answer => (
            <div key={answer.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 flex">
                 {/* Answer Upvote */}
                 <div className="flex flex-col items-center mr-4 min-w-8">
                     <button
                         className={`bg-transparent border-none cursor-pointer text-lg ${
                             answer.upvotedByCurrentUser
                             ? 'text-orange-600'
                             : (user ? 'text-gray-400 hover:text-orange-600' : 'text-gray-400 cursor-not-allowed') // Dim if not logged in
                         }`}
                         onClick={() => handleAnswerUpvote(answer.id, answer.upvotedByCurrentUser)}
                         disabled={!user} // Disable if not logged in
                         aria-label={answer.upvotedByCurrentUser ? "Remove upvote" : "Upvote answer"}
                     >
                         ▲
                     </button>
                     <span className={`font-bold mt-1 text-sm ${
                         answer.reviews > 0
                         ? 'text-orange-700'
                         : 'text-gray-500'
                     }`}>
                         {answer.reviews} {/* Display reviews from DTO */}
                     </span>
                 </div>
              {/* Answer Content */}
              <div className="flex-1">
                <p className="mb-3 leading-relaxed text-gray-800">{answer.content}</p>
                <div className="flex flex-wrap items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                  <span>Answered by {answer.authorName}</span>
                  <span className="mx-1">•</span>
                  <span>on {formatDate(answer.createdAt)}</span>
                   {/* CRUD buttons for Answer if user is author */}
                   {user && answer.authorEmail === user.email && (
                        <> {/* Use a fragment */}
                         <span className="mx-1">•</span>
                         <button className="text-blue-600 hover:underline" onClick={() => handleEditAnswer(answer.id)}>Edit</button>
                          <span className="mx-1">•</span>
                          <button className="text-red-600 hover:underline" onClick={() => handleDeleteAnswer(answer.id)}>Delete</button>
                        </>
                   )}
                </div>
              </div>
            </div>
          ))
        ) : (
            // Message if answers array is empty or null after loading
          !loading && !answerFetchError && (
              <p className="text-center py-5 text-gray-600 italic">No answers yet. Be the first to answer!</p>
          )
        )}
      </div>

      {/* Answer Form / Login Prompt */}
      {user ? ( // Only show answer form if user is logged in
        <div>
          <h3 className="mb-4 text-lg font-semibold">Your Answer</h3>

          {submitError && (
            <div className="bg-red-50 text-red-700 p-3 mb-5 rounded border-l-4 border-red-700">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmitAnswer}>
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here..."
              rows="6"
              required
              className="w-full p-3 border border-gray-300 rounded text-base font-normal mb-4 resize-y"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white border-none py-2 px-5 rounded font-bold cursor-pointer transition-colors hover:bg-blue-700"
            >
              Post Your Answer
            </button>
          </form>
        </div>
      ) : ( // Show login prompt if user is not logged in
        <div className="bg-gray-100 p-5 text-center rounded-lg mt-5">
          <p>You need to <Link to="/" className="text-blue-600 font-bold hover:underline">log in</Link> to post an answer.</p>
        </div>
      )}
    </div>
  );
}

export default QuestionDetail;