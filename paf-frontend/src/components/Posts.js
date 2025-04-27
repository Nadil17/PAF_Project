import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';
import CommentSection from './CommentSection';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editPostId, setEditPostId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editFilePreview, setEditFilePreview] = useState(null);
  
  // Track which posts have their comments section expanded
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/posts', {
        withCredentials: true
      });
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts.');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description && !file) {
      alert('Please add a description or upload a file.');
      return;
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }
      const response = await axios.post('http://localhost:8080/api/user/posts', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts([response.data, ...posts]);
      setDescription('');
      setFile(null);
      setFilePreview(null);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (post) => {
    setEditPostId(post.id);
    setEditDescription(post.description);
    setEditFilePreview(post.filePath ? `http://localhost:8080${post.filePath}` : null);
    setEditFile(null);
  };

  const handleCancelEdit = () => {
    setEditPostId(null);
    setEditDescription('');
    setEditFile(null);
    setEditFilePreview(null);
  };

  const handleSaveEdit = async (postId) => {
    try {
      const formData = new FormData();
      formData.append('description', editDescription);
      if (editFile) {
        formData.append('file', editFile);
      }
      const response = await axios.put(`http://localhost:8080/api/user/posts/${postId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts(posts.map(post => post.id === postId ? response.data : post));
      handleCancelEdit();
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:8080/api/user/posts/${postId}`, {
          withCredentials: true
        });
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  // Toggle comment section visibility
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-center">
      <p className="text-red-700 font-medium">{error}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-50 font-sans">
      {/* Modern Header with Gradient */}
      <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Green Social</h1>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 bg-white rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Social • Connected</span>
          </div>
        </div>
      </div>
      
      {/* Create Post Form with Improved UI */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Create a Post
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y transition-all bg-gray-50"
                placeholder="What's on your mind?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:bg-green-50 transition-colors">
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-green-600 font-medium">Upload Image or Video</span>
                </div>
                <input 
                  className="hidden"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            {filePreview && (
              <div className="mb-4 relative">
                <button 
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  onClick={() => {setFile(null); setFilePreview(null)}}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="bg-gray-100 p-2 rounded-xl overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img className="max-h-64 rounded-lg mx-auto object-contain" src={filePreview} alt="Preview" />
                  ) : file.type.startsWith('video/') ? (
                    <video className="max-h-64 rounded-lg mx-auto" src={filePreview} controls />
                  ) : null}
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-md transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500'}`}
              disabled={isSubmitting}
              
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : 'Publish Post'}
            </button>
          </form>
        </div>
      </div>

      {/* Posts List with Modern Design */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Recent Posts
        </h2>
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                {editPostId === post.id ? (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Your Post</h3>
                    <textarea
                      className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y transition-all bg-gray-50 mb-4"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="3"
                    />
                    
                    <div className="mb-4">
                      <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:bg-green-50 transition-colors">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-green-600 font-medium">Change Image or Video</span>
                        </div>
                        <input 
                          className="hidden"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleEditFileChange}
                        />
                      </label>
                    </div>
                    
                    {editFilePreview && (
                      <div className="mb-4 relative">
                        <button 
                          className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                          onClick={() => {setEditFile(null); setEditFilePreview(null)}}
                          type="button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="bg-gray-100 p-2 rounded-xl overflow-hidden">
                          {(editFile && editFile.type.startsWith('image/')) || 
                          (!editFile && post.contentType === 'image') ? (
                            <img className="max-h-64 rounded-lg mx-auto object-contain" src={editFilePreview} alt="Preview" />
                          ) : (editFile && editFile.type.startsWith('video/')) || 
                            (!editFile && post.contentType === 'video') ? (
                            <video className="max-h-64 rounded-lg mx-auto" src={editFilePreview} controls />
                          ) : null}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button 
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-md hover:from-green-600 hover:to-emerald-700 focus:outline-none transition-colors"
                        onClick={() => handleSaveEdit(post.id)}
                      >
                        Save Changes
                      </button>
                      <button 
                        className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl shadow-md hover:bg-gray-300 focus:outline-none transition-colors"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-inner">
                            {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">{post.userName}</span>
                            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {post.userId === post.userId && (
                          <div className="flex space-x-1">
                            <button 
                              className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors focus:outline-none"
                              onClick={() => handleStartEdit(post)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors focus:outline-none"
                              onClick={() => handleDelete(post.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      {post.description && (
                        <p className="text-gray-800 mb-6 whitespace-pre-line text-lg">{post.description}</p>
                      )}
                      
                      {post.filePath && post.contentType === 'image' && (
                        <div className="flex justify-center mb-4">
                          <div className="rounded-xl overflow-hidden shadow-md transition-transform hover:scale-[1.01]">
                            <img 
                              className="max-w-full" 
                              src={`http://localhost:8080${post.filePath}`} 
                              alt="Post content" 
                            />
                          </div>
                        </div>
                      )}
                      
                      {post.filePath && post.contentType === 'video' && (
                        <div className="flex justify-center mb-4">
                          <div className="rounded-xl overflow-hidden shadow-md w-full">
                            <video 
                              className="w-full" 
                              src={`http://localhost:8080${post.filePath}`} 
                              controls 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-around">
                        <button className="flex items-center justify-center py-2 px-4 rounded-xl hover:bg-gray-100 text-green-600 transition-colors font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          Like
                        </button>
                        <button 
                          className={`flex items-center justify-center py-2 px-4 rounded-xl hover:bg-gray-100 transition-colors font-medium ${expandedComments[post.id] ? 'text-emerald-600 bg-green-50' : 'text-green-600'}`}
                          onClick={() => toggleComments(post.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {expandedComments[post.id] ? 'Hide Comments' : 'Comments'}
                        </button>
                        <button className="flex items-center justify-center py-2 px-4 rounded-xl hover:bg-gray-100 text-green-600 transition-colors font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share
                        </button>
                      </div>
                      
                      {/* Comment section */}
                      {expandedComments[post.id] && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <CommentSection postId={post.id} />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-center text-gray-500 text-sm py-4">
        <p>© 2025 Green Social • Connect with the Earth</p>
      </div>
    </div>
  );
}

export default Posts;