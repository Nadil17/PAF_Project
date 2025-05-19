import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';

function QuestionList() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [expandedQuestionId, setExpandedQuestionId] = useState(null);
    const [expandedQuestionDetails, setExpandedQuestionDetails] = useState(null);
    const [expandingLoading, setExpandingLoading] = useState(false);
    const [expandingError, setExpandingError] = useState(null);

    // New state for sorting
    const [sortBy, setSortBy] = useState('newest'); // Default sort
    const [sortOrder, setSortOrder] = useState('desc'); // Default order

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
                // User not logged in - that's fine for viewing questions list
            }
        };

        fetchUserData();
    }, []); // Run only on mount

    // Effect to fetch initial list of questions based on sort
    useEffect(() => {
        const fetchQuestionsSummary = async () => {
            setLoading(true);
            setError(null);
            let endpoint = 'http://localhost:8080/api/questions';

            // Determine the correct endpoint based on sorting
            if (sortBy === 'upvotes') {
                 // Backend has specific endpoint for upvotes only
                 endpoint = 'http://localhost:8080/api/questions/sort/upvotes';
                 // Note: Backend doesn't seem to support asc/desc for this specific endpoint,
                 // assuming it returns highest first. Adjust if your backend differs.
            } else if (sortBy === 'upvotes-and-newest') {
                 endpoint = 'http://localhost:8080/api/questions/sort/upvotes-and-newest';
                 // Assuming this is the default hybrid sort
            } else if (sortBy === 'answer-count') {
                 endpoint = 'http://localhost:8080/api/questions/sort/answer-count';
                 // Assuming highest count first
            } else { // 'newest' is the default
                 // Backend doesn't have a specific /sort/newest,
                 // assume the default /api/questions endpoint returns newest first,
                 // or you might need a different endpoint if available.
                 // Using the base endpoint for now.
                 endpoint = 'http://localhost:8080/api/questions';
            }

             // If your backend supports order parameters on the endpoint, add them here
             // Example: endpoint = `${endpoint}?order=${sortOrder}`;

            try {
                const response = await axios.get(endpoint, {
                    withCredentials: true
                });
                // Assuming the backend response structure matches QuestionDTO
                setQuestions(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching questions summary:', err);
                setError('Failed to load questions. Please try again later.');
                setLoading(false);
            }
        };

        fetchQuestionsSummary();
    }, [sortBy, sortOrder]); // Re-run when sortBy or sortOrder changes

    // Effect to fetch full details when expandedQuestionId changes
    useEffect(() => {
        if (expandedQuestionId !== null) {
            const fetchExpandedQuestionDetails = async () => {
                setExpandingLoading(true);
                setExpandingError(null);
                try {
                    // Fetch the full details for the specific question
                    // This endpoint already returns answers based on your backend code
                    const response = await axios.get(`http://localhost:8080/api/questions/${expandedQuestionId}`, {
                        withCredentials: true
                    });
                    // Assuming the backend response structure matches QuestionDTO with populated answers
                    setExpandedQuestionDetails(response.data);
                    setExpandingLoading(false);
                } catch (err) {
                    console.error('Error fetching expanded question details:', err);
                    setExpandingError('Failed to load answers. Please try again.');
                    setExpandingLoading(false);
                }
            };
            fetchExpandedQuestionDetails();
        } else {
            setExpandedQuestionDetails(null);
            setExpandingLoading(false);
            setExpandingError(null);
        }
    }, [expandedQuestionId]);

    const handleQuestionClick = (questionId) => {
        // If clicking the same question, collapse it
        if (expandedQuestionId === questionId) {
            setExpandedQuestionId(null);
        } else {
            // Expand the clicked question
            setExpandedQuestionId(questionId);
            // If you want to scroll the question into view when expanded:
            // setTimeout(() => {
            //     document.getElementById(`question-${questionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // }, 100); // Add a small delay
        }
    };

    const handleUpvote = async (e, questionId, currentlyUpvoted) => {
        e.stopPropagation(); // Prevent the click from expanding/collapsing the question

        if (!user) {
            // Redirect to login/home if not logged in
            navigate('/');
            return;
        }

        try {
            const endpoint = currentlyUpvoted
                ? `http://localhost:8080/api/questions/${questionId}/remove-upvote`
                : `http://localhost:8080/api/questions/${questionId}/upvote`;

            const response = await axios.post(endpoint, {}, {
                withCredentials: true
            });

            const updatedQuestion = response.data; // Backend returns the updated DTO

            // Update the question in the main questions list state
            setQuestions(prevQuestions =>
                prevQuestions.map(q =>
                    q.id === questionId ? updatedQuestion : q // Replace the old question with the updated one
                )
            );

            // If the question is currently expanded, update its details state as well
            if (expandedQuestionId === questionId) {
                setExpandedQuestionDetails(updatedQuestion);
            }

        } catch (err) {
            console.error('Error with question upvote operation:', err);
             // Optionally show a user-facing error message
        }
    };

    const handleAnswerUpvote = async (e, answerId, currentlyUpvoted) => {
        e.stopPropagation(); // Prevent click from affecting the question

        if (!user) {
            // Redirect to login/home if not logged in
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

            const updatedAnswer = response.data; // Backend returns the updated DTO

            // Update the answer within the expanded question details state
            if (expandedQuestionDetails) {
                setExpandedQuestionDetails(prevDetails => {
                    if (!prevDetails) return null; // Should not happen if expandedQuestionDetails is truthy
                    return {
                        ...prevDetails,
                        answers: prevDetails.answers.map(answer =>
                            answer.id === answerId ? updatedAnswer : answer // Replace the old answer with the updated one
                        )
                    };
                });
            }
             // Note: Answers are not in the main 'questions' state summary, so no need to update 'questions' state here.

        } catch (err) {
            console.error('Error with answer upvote operation:', err);
            // Optionally show a user-facing error message
        }
    };

     // Basic CRUD place holders (will not implement full forms here)
    //  const handleEditQuestion = (e, questionId) => {
    //     e.stopPropagation(); // Prevent click from affecting the question
    //     console.log("Edit Question:", questionId);
        // Edit now navigation to an edit page or open a modal
        // navigate(`/edit-question/${questionId}`);
        const handleEditQuestion = (e, questionId) => {
            e.stopPropagation(); // Prevent click from affecting the question
            navigate(`/edit-question/${questionId}`);
            alert(`Edit question ${questionId} - Edit now`);
        };

     const handleDeleteQuestion = async (e, questionId) => {
        e.stopPropagation(); // Prevent click from affecting the question
        if (!user) {
             navigate('/');
             return;
         }
         if (window.confirm("Are you sure you want to delete this question?")) {
             try {
                 await axios.delete(`http://localhost:8080/api/questions/${questionId}`, {
                     withCredentials: true
                 });
                 // Remove the question from the list state
                 setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
                 // Collapse if it was the expanded one
                 if (expandedQuestionId === questionId) {
                     setExpandedQuestionId(null);
                 }
                 alert("Question deleted successfully!");
             } catch (err) {
                 console.error('Error deleting question:', err);
                 alert("Failed to delete question. You might not have permission."); // User might not be the author
             }
         }
     };

    //  const handleEditAnswer = (e, answerId) => {
    //     e.stopPropagation(); // Prevent click from affecting the question
    //     console.log("Edit Answer:", answerId);
        // Edit now editing logic (inline form or modal)
        const handleEditAnswer = (e, answerId) => {
    e.stopPropagation(); // Prevent click from affecting the question
    navigate(`/edit-answer/${answerId}`);
    alert(`Edit answer ${answerId} - Edit now`);
};
        
        
         

     const handleDeleteAnswer = async (e, answerId) => {
        e.stopPropagation(); // Prevent click from affecting the question
         if (!user) {
             navigate('/');
             return;
         }
         if (window.confirm("Are you sure you want to delete this answer?")) {
             try {
                 await axios.delete(`http://localhost:8080/api/answers/${answerId}`, {
                     withCredentials: true
                 });
                 // Remove the answer from the expanded question details state
                 if (expandedQuestionDetails) {
                     setExpandedQuestionDetails(prevDetails => {
                         if (!prevDetails) return null;
                         return {
                             ...prevDetails,
                             answers: prevDetails.answers.filter(answer => answer.id !== answerId)
                         };
                     });
                 }
                  alert("Answer deleted successfully!");
             } catch (err) {
                 console.error('Error deleting answer:', err);
                  alert("Failed to delete answer. You might not have permission."); // User might not be the author
             }
         }
     };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) {
        return (
            <div className="bg-emerald-50 min-h-screen font-['Montserrat',_sans-serif]">
                <Header user={user} />
                <div className="max-w-4xl mx-auto p-5">
                    <div className="text-center py-10 text-emerald-800 font-semibold bg-white rounded-lg shadow-md">
                        <svg className="animate-spin h-10 w-10 mx-auto text-emerald-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading questions...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-emerald-50 min-h-screen font-['Montserrat',_sans-serif]">
                <Header user={user} />
                <div className="max-w-4xl mx-auto p-5">
                    <div className="text-center py-10 text-red-700 font-semibold bg-red-50 rounded-lg shadow-md border border-red-200">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-emerald-50 min-h-screen font-['Montserrat',_sans-serif]">
            <Header user={user} />
            <div className="max-w-4xl mx-auto p-5">
                {/* Header with farming-themed design */}
                <div className="mb-8 text-center bg-gradient-to-r from-green-800 to-emerald-600 py-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h1 className="text-3xl font-bold text-white">Knowledge Q&A Forum</h1>
                    </div>
                    <p className="text-yellow-100 italic">Growing knowledge together</p>
                    
                    {/* New Ask Question button in header - visible to all users */}
                    <div className="mt-4">
                        <button 
                            onClick={() => user ? navigate('/ask-question') : navigate('/')} 
                            className="bg-yellow-500 text-emerald-900 px-6 py-3 rounded-full font-bold text-lg inline-block transition-all hover:bg-yellow-400 hover:shadow-lg transform hover:-translate-y-1 flex items-center mx-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {user ? "Ask New Question" : "Log In to Ask Question"}
                        </button>
                    </div>
                </div>
        
                <div className="flex justify-between items-center mb-6">
                    {user && (
                        <Link to="/ask-question" className="bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg inline-block transition-all hover:bg-emerald-800 hover:shadow-md transform hover:-translate-y-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ask a Question
                        </Link>
                    )}
    
                    {/* Sorting Controls */}
                    <div className="flex items-center space-x-2 ml-auto"> {/* Use ml-auto to push to right if user is not logged in */}
                        <span className="text-emerald-800 font-semibold">Sort by:</span>
                        <select
                            className="p-2 border border-emerald-300 rounded-md bg-white text-emerald-800 focus:ring-emerald-500 focus:border-emerald-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest</option> {/* Default behavior of /api/questions */}
                            <option value="upvotes">Upvotes</option>
                            <option value="answer-count">Answer Count</option>
                            <option value="upvotes-and-newest">Upvotes & Newest</option> {/* Assuming this is a compound sort */}
                        </select>
                        {/* Add sort order toggle if your backend endpoint supports it */}
                        {/* {sortBy !== 'upvotes' && sortBy !== 'answer-count' && (
                            <button
                                className="p-2 border border-emerald-300 rounded-md bg-white text-emerald-800 hover:bg-emerald-100"
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            >
                                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                            </button>
                        )} */}
                    </div>
                </div>
    
    
                {questions.length === 0 && !loading && (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-emerald-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <p className="text-emerald-800 font-semibold">No questions have been planted yet. Be the first to sow!</p>
                    </div>
                )}
    
                {questions.length > 0 && (
                    <div className="flex flex-col gap-6">
                        {questions.map(question => (
                            <div
                                key={question.id}
                                id={`question-${question.id}`} // Add ID for scrolling
                                className={`border-2 rounded-lg bg-white flex flex-col cursor-pointer transition-all ${
                                    expandedQuestionId === question.id
                                    ? 'shadow-lg border-emerald-500'
                                    : 'border-emerald-200 hover:shadow-md hover:-translate-y-1 hover:border-emerald-300'
                                }`}
                                onClick={() => handleQuestionClick(question.id)}
                            >
                                {/* Question header */}
                                <div className="bg-gradient-to-r from-emerald-100 to-green-50 px-4 py-2 rounded-t-lg border-b border-emerald-200 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-semibold text-emerald-900">Question</span>
                                    {/* Add CRUD buttons for the question if user is the author */}
                                    {user && question.authorEmail === user.email && (
                                            <div className="ml-auto space-x-2 flex items-center">
                                                {/* Stop propagation to prevent collapse/expand when clicking buttons */}
                                                 <button
                                                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                                    onClick={(e) => handleEditQuestion(e, question.id)}
                                                >
                                                    Edit
                                                </button>
                                                 {/* Stop propagation to prevent collapse/expand when clicking buttons */}
                                                 <button
                                                    className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                    onClick={(e) => handleDeleteQuestion(e, question.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                    )}
                                </div>
    
                                {/* Question content */}
                                <div className="p-5 flex">
                                    {/* Question Upvote */}
                                    <div className="flex flex-col items-center mr-4 min-w-10">
                                        <button
                                            className={`bg-transparent border-none cursor-pointer text-xl ${
                                                question.upvotedByCurrentUser
                                                ? 'text-emerald-600'
                                                : (user ? 'text-gray-400 hover:text-emerald-600' : 'text-gray-400 cursor-not-allowed') // Dim if not logged in
                                            }`}
                                            onClick={(e) => handleUpvote(e, question.id, question.upvotedByCurrentUser)}
                                            disabled={!user} // Disable if not logged in
                                            aria-label={question.upvotedByCurrentUser ? "Remove upvote" : "Upvote question"}
                                        >
                                            ▲
                                        </button>
                                        <span className={`font-bold mt-1 text-lg ${
                                                question.reviews > 0
                                                ? 'text-emerald-700'
                                                : 'text-gray-500'
                                            }`}>
                                            {question.reviews}
                                        </span>
                                    </div>
    
                                    {/* Question Content Summary/Full */}
                                    <div className="flex-1">
                                        <h2 className="mt-0 mb-3 text-xl font-bold text-emerald-900">
                                            {question.title}
                                        </h2>
                                        <p className="text-gray-700 mb-3 leading-relaxed text-base"> {/* Added text-base for clarity */}
                                            {expandedQuestionId === question.id && expandedQuestionDetails
                                                ? expandedQuestionDetails.content // Show full content when expanded and details loaded
                                                : (question.content && question.content.length > 200 // Show more characters in summary
                                                    ? question.content.substring(0, 200) + '...'
                                                    : question.content)
                                            }
                                        </p>
                                         {/* Link to full details page, hidden if expanded */}
                                        {expandedQuestionId !== question.id && (
                                            <Link
                                                to={`/questions/${question.id}`}
                                                className="text-blue-600 hover:underline text-sm"
                                                onClick={(e) => e.stopPropagation()} // Prevent collapsing when clicking link
                                            >
                                                Read more or Answer
                                            </Link>
                                        )}
    
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 items-center mt-4">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{question.authorName}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatDate(question.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                <span>
                                                    {question.answerCount} {question.answerCount === 1 ? 'answer' : 'answers'} {/* Use answerCount from summary */}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* Conditionally rendered Answers section when expanded */}
                                {expandedQuestionId === question.id && (
                                    <div className="bg-gray-100 p-4 border-t-2 border-gray-300"> {/* Changed background and border to gray */}
                                        {expandingLoading && (
                                            <div className="text-center py-4 text-gray-700"> {/* Changed text color to gray */}
                                                <svg className="animate-spin h-6 w-6 mx-auto text-gray-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Changed spinner color to gray */}
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Loading harvest of answers...
                                            </div>
                                        )}
    
                                        {expandingError && (
                                            <div className="text-red-700 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                                                {expandingError}
                                            </div>
                                        )}
    
                                        {/* Render answers */}
                                        {expandedQuestionDetails && expandedQuestionDetails.answers && expandedQuestionDetails.answers.length > 0 && !expandingLoading && (
                                            <div>
                                                <h3 className="mb-4 text-lg font-bold text-gray-800 flex items-center"> {/* Changed text color to gray */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* Changed icon color to gray */}
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Harvested Answers:
                                                </h3>
                                                 {/* Add Answer Sorting Controls here if needed */}
                                                 {/* Note: This requires fetching answers separately with sorting parameters */}
                                                 {/* <div className="flex items-center space-x-2 mb-4">
                                                     <span className="text-gray-800 text-sm font-semibold">Sort answers by:</span> // Changed text color
                                                     <select
                                                         className="p-1 border border-gray-300 rounded-md bg-white text-gray-800 text-sm focus:ring-gray-500 focus:border-gray-500" // Changed colors
                                                         value={answerSortBy} // Need new state for answer sorting
                                                         onChange={(e) => setAnswerSortBy(e.target.value)} // Need handler
                                                     >
                                                         <option value="newest">Newest</option>
                                                         <option value="upvotes">Upvotes</option>
                                                     </select>
                                                 </div> */}
                                                <div className="flex flex-col gap-4">
                                                     {/* Use expandedQuestionDetails.answers for rendering answers */}
                                                     {expandedQuestionDetails.answers.map(answer => (
                                                          <div key={answer.id} className="bg-gray-200 p-4 rounded-lg shadow-sm border border-gray-300 flex"> {/* Changed background and border to gray */}
                                                              {/* Answer Upvote */}
                                                              <div className="flex flex-col items-center mr-4 min-w-8">
                                                                  <button
                                                                       className={`bg-transparent border-none cursor-pointer text-lg ${
                                                                           answer.upvotedByCurrentUser
                                                                            ? 'text-amber-600' // Keep amber for answer upvotes
                                                                            : (user ? 'text-gray-400 hover:text-amber-600' : 'text-gray-400 cursor-not-allowed') // Dim if not logged in
                                                                        }`}
                                                                       onClick={(e) => handleAnswerUpvote(e, answer.id, answer.upvotedByCurrentUser)}
                                                                       disabled={!user} // Disable if not logged in
                                                                       aria-label={answer.upvotedByCurrentUser ? "Remove upvote" : "Upvote answer"}
                                                                  >
                                                                      ▲
                                                                  </button>
                                                                  <span className={`font-bold mt-1 text-sm ${
                                                                       answer.reviews > 0
                                                                        ? 'text-amber-700' // Keep amber for answer upvote count
                                                                        : 'text-gray-500'
                                                                    }`}>
                                                                      {answer.reviews}
                                                                  </span>
                                                              </div>
    
                                                               {/* Answer Content */}
                                                               <div className="flex-1">
                                                                   <p className="mb-3 leading-relaxed text-gray-800 text-base"> {/* Changed text color to gray, added text-base */}
                                                                       {answer.content}
                                                                   </p>
                                                                   <div className="flex flex-wrap items-center text-xs text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full inline-block"> {/* Changed background and text to yellow */}
                                                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                       </svg>
                                                                       <span>{answer.authorName}</span>
                                                                       <span className="mx-1">•</span>
                                                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                       </svg>
                                                                       <span>{formatDate(answer.createdAt)}</span>
                                                                        {/* Add CRUD buttons for the answer if user is the author */}
                                                                        {user && answer.authorEmail === user.email && (
                                                                             <> {/* Use a fragment */}
                                                                                <span className="mx-1">•</span>
                                                                                 <button
                                                                                    className="text-blue-600 hover:underline text-xs px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors" // Added button styles
                                                                                     onClick={(e) => handleEditAnswer(e, answer.id)}
                                                                                 >
                                                                                     Edit
                                                                                 </button>
                                                                                 <span className="mx-1">•</span>
                                                                                 <button
                                                                                     className="text-red-600 hover:underline text-xs px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" // Added button styles
                                                                                      onClick={(e) => handleDeleteAnswer(e, answer.id)}
                                                                                 >
                                                                                     Delete
                                                                                 </button>
                                                                             </>
                                                                        )}
                                                                   </div>
                                                               </div>
                                                           </div>
                                                     ))}
                                                 </div>
                                            </div>
                                        )}
    
                                         {/* Message for no answers */}
                                        {expandedQuestionDetails && expandedQuestionDetails.answers && expandedQuestionDetails.answers.length === 0 && !expandingLoading && !expandingError && (
                                             <div className="text-center py-6 text-gray-700 bg-gray-200 rounded-lg border border-gray-300"> {/* Changed colors to gray */}
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* Changed icon color to gray */}
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                 </svg>
                                                 <p className="italic">The field is empty - no answers have been harvested yet.</p>
                                             </div>
                                        )}
    
                                         {/* Post Answer button */}
                                         {user ? ( // Only show if logged in
                                            <div className="mt-6 text-right">
                                                 <button
                                                     className="bg-amber-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-amber-700 transition-colors flex items-center ml-auto" // Made button bigger/more visible
                                                     onClick={(e) => {
                                                         e.stopPropagation(); // Prevent click from affecting the question
                                                         navigate(`/questions/${question.id}`); // Navigate to detail page to answer
                                                        }}
                                                 >
                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                     </svg>
                                                     Plant Your Answer
                                                 </button>
                                            </div>
                                         ) : ( // Show login prompt if not logged in
                                                <div className="bg-gray-100 p-3 text-center rounded-lg mt-5 text-sm">
                                                    <p className="text-gray-700">
                                                        <Link to="/" className="text-blue-600 font-bold hover:underline" onClick={(e) => e.stopPropagation()}>Log in</Link> to plant your answer.
                                                    </p>
                                                </div>
                                         )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
    
                {/* Footer */}
                <div className="mt-8 text-center text-sm text-emerald-700 border-t border-emerald-200 pt-4">
                    <p>© 2025 LearnHub - Growing Together</p>
                </div>
            </div>
        </div>
    );

}

export default QuestionList;