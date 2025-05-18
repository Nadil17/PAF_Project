import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';
import CommentSection from './CommentSection';
import Header from './Header';

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

  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  //get userid from oauth - currently logged user
    useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(response => {
        setLoggedUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
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

  if (loading) return <div className="flex items-center justify-center h-64 text-green-700 text-xl">Loading posts...</div>;
  if (error) return <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">{error}</div>;

  return (
    <div>
      <Header user={loggedUser}/>
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 font-sans">
      

      {/* Header with Facebook-like green theme */}
      <div className="bg-green-600 text-white p-4 rounded-t-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold">Green Social</h1>
      </div>
      
      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <h2 className="text-lg font-semibold text-green-700 mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y"
              placeholder="What's on your mind?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image or Video
              <input 
                className="mt-1 block w-full border border-gray-300 shadow-sm rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          {filePreview && (
            <div className="mb-4">
              {file.type.startsWith('image/') ? (
                <img className="max-h-64 rounded-lg mx-auto" src={filePreview} alt="Preview" />
              ) : file.type.startsWith('video/') ? (
                <video className="max-h-64 rounded-lg mx-auto" src={filePreview} controls />
              ) : null}
            </div>
          )}
          
          <button 
            type="submit" 
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-green-700 mb-4">Recent Posts</h2>
        {posts.length === 0 ? (
          <p className="text-center py-8 text-gray-500 italic">No posts yet. Be the first to share!</p>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {editPostId === post.id ? (
                  <div className="p-4">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y mb-4"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="3"
                    />
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Change Image/Video
                        <input 
                          className="mt-1 block w-full border border-gray-300 shadow-sm rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleEditFileChange}
                        />
                      </label>
                    </div>
                    
                    {editFilePreview && (
                      <div className="mb-4">
                        {(editFile && editFile.type.startsWith('image/')) ||
                        (!editFile && post.contentType === 'image') ? (
                          <img className="max-h-64 rounded-lg mx-auto" src={editFilePreview} alt="Preview" />
                        ) : (editFile && editFile.type.startsWith('video/')) ||
                          (!editFile && post.contentType === 'video') ? (
                          <video className="max-h-64 rounded-lg mx-auto" src={editFilePreview} controls />
                        ) : null}
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button 
                        className="flex-1 py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={() => handleSaveEdit(post.id)}
                      >
                        Save Changes
                      </button>
                      <button 
                        className="flex-1 py-2 px-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                            {post.userName ? post.userName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{post.userName}</span>
                            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {post.userId === post.userId && (
                          <div className="flex space-x-2">
                            <button 
                              className="p-1 text-sm text-gray-500 hover:text-green-600 focus:outline-none"
                              onClick={() => handleStartEdit(post)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              className="p-1 text-sm text-gray-500 hover:text-red-600 focus:outline-none"
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
                    
                    <div className="p-4">
                      {post.description && (
                        <p className="text-gray-800 mb-4 whitespace-pre-line">{post.description}</p>
                      )}
                      
                      {post.filePath && post.contentType === 'image' && (
                        <div className="flex justify-center">
                          <img 
                            className="max-w-full rounded-lg" 
                            src={`http://localhost:8080${post.filePath}`} 
                            alt="Post content" 
                          />
                        </div>
                      )}
                      
                      {post.filePath && post.contentType === 'video' && (
                        <div className="flex justify-center">
                          <video 
                            className="max-w-full rounded-lg" 
                            src={`http://localhost:8080${post.filePath}`} 
                            controls 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                      <div className="flex justify-around">
                        <button className="flex items-center justify-center py-2 px-4 rounded-md hover:bg-gray-100 text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          Like
                        </button>
                        <button 
                          className="flex items-center justify-center py-2 px-4 rounded-md hover:bg-gray-100 text-green-600"
                          onClick={() => toggleComments(post.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {expandedComments[post.id] ? 'Hide Comments' : 'Comments'}
                        </button>
                        <button className="flex items-center justify-center py-2 px-4 rounded-md hover:bg-gray-100 text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share
                        </button>
                      </div>
                      
                      {/* Comment section */}
                      {expandedComments[post.id] && (
                        <CommentSection postId={post.id} />
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default Posts;