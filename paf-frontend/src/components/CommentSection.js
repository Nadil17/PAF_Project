import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Edit state
  const [editCommentId, setEditCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editFilePreview, setEditFilePreview] = useState(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/posts/${postId}/comments`, {
        withCredentials: true
      });
      setComments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments.');
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };
  
  // Edit functions
  const handleStartEdit = (comment) => {
    setEditCommentId(comment.id);
    setEditText(comment.text || '');
    setEditFilePreview(comment.filePath ? `http://localhost:8080${comment.filePath}` : null);
    setEditFile(null);
  };
  
  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditText('');
    setEditFile(null);
    setEditFilePreview(null);
  };
  
  const handleEditFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setEditFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setEditFilePreview(null);
    }
  };

  const handleSaveEdit = async (commentId) => {
    // Validate that at least text or file is provided
    if (!editText && !editFile && !editFilePreview) {
      alert('Please add text or upload a file for your comment.');
      return;
    }
    
    try {
      setIsSubmittingEdit(true);
      const formData = new FormData();
      
      if (editText) {
        formData.append('text', editText);
      }
      
      if (editFile) {
        formData.append('file', editFile);
      }
      
      const response = await axios.put(
        `http://localhost:8080/api/comments/${commentId}`, 
        formData, 
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      // Update comments list with edited comment
      setComments(comments.map(comment => 
        comment.id === commentId ? response.data : comment
      ));
      
      handleCancelEdit();
      setIsSubmittingEdit(false);
    } catch (err) {
      console.error('Error updating comment:', err);
      alert(`Failed to update comment: ${err.response?.data?.message || 'Please try again.'}`);
      setIsSubmittingEdit(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(
          `http://localhost:8080/api/comments/${commentId}`, 
          { withCredentials: true }
        );
        
        // Remove deleted comment from state
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert(`Failed to delete comment: ${err.response?.data?.message || 'Please try again.'}`);
      }
    }
  };

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      
      {loading ? (
        <div className="text-center py-3 text-gray-500">Loading comments...</div>
      ) : error ? (
        <div className="text-center py-3 text-red-500">{error}</div>
      ) : (
        <div className="mt-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-2 text-gray-500 text-sm italic">No comments yet</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm">
                {editCommentId === comment.id ? (
                  // Edit comment form
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent resize-y"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows="2"
                    />
                    
                    <div className="mt-2 mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Change Image
                        <input 
                          className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          type="file"
                          accept="image/*"
                          onChange={handleEditFileChange}
                        />
                      </label>
                    </div>
                    
                    {editFilePreview && (
                      <div className="mb-2">
                        <img className="h-24 rounded-lg" src={editFilePreview} alt="Preview" />
                      </div>
                    )}
                    
                    <div className="flex space-x-2 justify-end mt-2">
                      <button 
                        className="py-1 px-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button 
                        className={`py-1 px-3 rounded-md text-white text-sm ${isSubmittingEdit ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={isSubmittingEdit}
                      >
                        {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal comment display
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                      {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-900 text-sm">{comment.userName}</span>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">{new Date(comment.createdAt).toLocaleString()}</span>
                          
                          {/* Comment actions (update/delete) */}
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => handleStartEdit(comment)}
                              className="p-1 text-xs text-gray-400 hover:text-green-600 focus:outline-none"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 text-xs text-gray-400 hover:text-red-600 focus:outline-none"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {comment.text && (
                        <p className="text-gray-800 text-sm mt-1">{comment.text}</p>
                      )}
                      
                      {comment.filePath && comment.contentType === 'image' && (
                        <div className="mt-2">
                          <img 
                            className="max-h-40 rounded-lg" 
                            src={`http://localhost:8080${comment.filePath}`} 
                            alt="Comment" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CommentSection;