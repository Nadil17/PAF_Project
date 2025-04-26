import React, { useState } from 'react';
import axios from 'axios';

function CommentForm({ postId, onCommentAdded }) {
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setCommentFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least text or file is provided
    if (!commentText && !commentFile) {
      alert('Please add text or upload a file for your comment.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      if (commentText) {
        formData.append('text', commentText);
      }
      
      if (commentFile) {
        formData.append('file', commentFile);
      }
      
      const response = await axios.post(
        `http://localhost:8080/api/posts/${postId}/comments`, 
        formData, 
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      // Reset form
      setCommentText('');
      setCommentFile(null);
      setFilePreview(null);
      setIsSubmitting(false);
      
      // Notify parent component about the new comment
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      alert(`Failed to create comment: ${err.response?.data?.message || 'Please try again.'}`);
      setIsSubmitting(false);
    }
  };
  
  const toggleCommentForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="mt-2">
      <button 
        onClick={toggleCommentForm}
        className="flex items-center justify-center py-2 px-4 rounded-md hover:bg-gray-100 text-green-600 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {showForm ? 'Cancel Comment' : 'Add Comment'}
      </button>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-3 bg-gray-50 p-3 rounded-lg">
          <div className="mb-3">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent resize-y"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="2"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Image
              <input 
                className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          {filePreview && (
            <div className="mb-3">
              <img className="h-24 rounded-lg" src={filePreview} alt="Preview" />
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`py-1 px-4 rounded-lg text-white font-medium ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CommentForm;