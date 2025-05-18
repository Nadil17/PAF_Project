import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import { FaUserCircle, FaCalendarAlt, FaUserPlus, FaUserMinus } from 'react-icons/fa';

function SearchaUser() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);
  const [followed, setFollowed] = useState(false);

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

  //check if logged user already follows the user
  useEffect(() => {
  if (loggedUser?.userId && userId) {
    axios.get(`http://localhost:8080/api/follow/getAlreadyFollowUsers/${loggedUser.userId}`)
      .then(response => {
        // Check if loggedUser is following the userId (profile user)
        const isFollowing = response.data.some(entry => entry.followerId === userId);
        setFollowed(isFollowing);
      })
      .catch(error => {
        console.error('Error checking follow status:', error);
      });
  }
}, [loggedUser, userId]);

    //get all posts
  useEffect(() => {
    axios.get(`http://localhost:8080/api/getPostsByUserIdNew/${userId}`)
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, [userId]);

  //Unfollow a User 
  const handleUnfollow = () => {
  if (!loggedUser) return;

  axios.delete(`http://localhost:8080/api/follow/unfollow/${loggedUser.userId}/${userId}`)
    .then(() => {
      setFollowed(false); // Update UI
    })
    .catch(err => {
      console.error('Error unfollowing user:', err);
    });
};


  const userName = posts.length > 0 ? posts[0].userName : "Unknown User";

  const handleFollow = () => {
    if (!loggedUser) return;

    const followData = {
      userId: loggedUser.userId,
      followerId: userId,
    };

    axios.post('http://localhost:8080/api/follow/addFollower', followData)
      .then(() => {
        setFollowed(true);
      })
      .catch(err => {
        console.error('Error following user:', err);
      });
  };

  if (loading) return <div className="text-center py-10">Loading posts...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Header user={loggedUser} />
      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="bg-green-600 h-40 relative"></div>
          <div className="px-6 py-4 flex flex-col md:flex-row gap-6 items-start md:items-center relative">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl absolute -top-12 left-6">
              <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center text-4xl font-bold text-green-700">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="mt-14 md:mt-0 md:ml-28 flex-1">
              <h2 className="text-2xl font-bold text-green-800">{userName}</h2>
              <p className="text-green-600 text-sm">User ID: {userId}</p>
            </div>

            {/* Show Follow/Unfollow button only if viewing someone else's profile */}
            {loggedUser?.userId !== userId && (
              <div className="md:self-center">
                {followed ? (
                  <button
                    onClick={handleUnfollow}
                    className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 inline-flex items-center"
                  >
                    <FaUserMinus className="mr-2" />
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 inline-flex items-center"
                  >
                    <FaUserPlus className="mr-2" />
                    Follow
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Posts Section */}
        <h3 className="text-2xl font-bold text-green-800 mb-6">Posts</h3>
        {posts.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <p className="text-xl text-green-700">No posts found for this user.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FaUserCircle className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">{post.userName}</p>
                    <div className="flex items-center text-green-600 text-sm">
                      <FaCalendarAlt className="mr-1" size={12} />
                      <span>{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-green-700 mb-4">{post.description}</p>

                {post.contentType === "image" && post.filePath && (
                  <img
                    src={`http://localhost:8080${post.filePath}`}
                    alt={post.fileName}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchaUser;
