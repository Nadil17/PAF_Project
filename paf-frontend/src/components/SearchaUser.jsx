import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';


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
    <div>
      <Header user={loggedUser}/>
      <div className="max-w-3xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-6 bg-gray-100 rounded-xl shadow mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{userName}</h2>
            <p className="text-gray-600 text-sm">User ID: {userId}</p>
          </div>

                    {/* Show Follow/Unfollow button only if viewing someone else's profile */}
          {loggedUser?.userId !== userId && (
            followed ? (
              <button
                onClick={handleUnfollow}
                className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                Follow
              </button>
            )
          )}

        </div>

        {/* Posts Section */}
        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts found for this user.</p>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg shadow p-4 mb-6"
            >
              <p className="text-gray-800 mb-2">
                <span className="font-semibold">Description:</span> {post.description}
              </p>

              {post.contentType === "image" && post.filePath && (
                <img
                  src={`http://localhost:8080${post.filePath}`}
                  alt={post.fileName}
                  className="max-w-full max-h-[300px] rounded-lg mt-2"
                />
              )}

              <p className="text-sm text-gray-500 mt-2">
                Created at: {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchaUser;
