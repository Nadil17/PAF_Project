import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Header from './Header';
import HomeSubHeader from './HomeSubHeader';

function Home() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followedUsersPosts, setFollowedUsersPosts] = useState([]);
  const [view, setView] = useState('posts');
  const [learningPlans, setLearningPlans] = useState([]);
  const [planTopics, setPlanTopics] = useState({});
  const [userHashtags, setUserHashtags] = useState([]);
  const [userHashtagList, setUserHashtagList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(response => {
        setLoggedUser(response.data);//
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);

  useEffect(() => {
    if (loggedUser) {
      axios.get(`http://localhost:8080/api/follow/getAlreadyFollowUsers/${loggedUser.userId}`)
        .then((res) => {
          setFollowingUsers(res.data);
        })
        .catch((err) => {
          console.error('Error fetching followings:', err);
        });
    }
  }, [loggedUser]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const allPosts = [];
      for (const followObj of followingUsers) {
        try {
          const res = await axios.get(`http://localhost:8080/api/getPostsByUserIdNew/${followObj.followerId}`);
          allPosts.push(...res.data);
        } catch (err) {
          console.error(`Failed to fetch posts for followerId ${followObj.followerId}`, err);
        }
      }
      setFollowedUsersPosts(allPosts);
    };

    if (followingUsers.length > 0) {
      fetchAllPosts();
    }
  }, [followingUsers]);

  useEffect(() => {
    const fetchAllLearningPlans = async () => {
      const allPlans = [];
      for (const followObj of followingUsers) {
        try {
          const res = await axios.get(`http://localhost:8080/api/learningplans/getLearningPlans/${followObj.followerId}`);
          allPlans.push(...res.data);
        } catch (err) {
          console.error(`Failed to fetch learning plans for followerId ${followObj.followerId}`, err);
        }
      }
      setLearningPlans(allPlans);
    };

    if (view === 'learning' && followingUsers.length > 0) {
      fetchAllLearningPlans();
    }
  }, [view, followingUsers]);

  useEffect(() => {
    const fetchTopicsForPlans = async () => {
      const topicsMap = {};
      for (const plan of learningPlans) {
        try {
          const res = await axios.get(`http://localhost:8080/api/topics/getLectures/${plan.planId}`);
          topicsMap[plan.planId] = res.data;
        } catch (err) {
          console.error(`Failed to fetch topics for planId ${plan.planId}`, err);
          topicsMap[plan.planId] = [];
        }
      }
      setPlanTopics(topicsMap);
    };

    if (learningPlans.length > 0) {
      fetchTopicsForPlans();
    }
  }, [learningPlans]);

  useEffect(() => {
    if (loggedUser) {
      axios.get(`http://localhost:8080/api/getHashtags/${loggedUser.userId}`)
        .then((res) => {
          setUserHashtags(res.data);
          if (res.data.hashtags) {
            const hashtagsArray = res.data.hashtags
              .split(' ')
              .filter(tag => tag.trim().startsWith('#'))
              .map(tag => tag.trim().toLowerCase());
            setUserHashtagList(hashtagsArray);
          }
        })
        .catch((err) => {
          console.error("Error fetching user hashtags:", err);
        });
    }
  }, [loggedUser]);

  const sortedLearningPlans = useMemo(() => {
    if (!learningPlans.length || !userHashtagList.length) return learningPlans;
    
    return [...learningPlans].sort((a, b) => {
      const getMatchScore = (plan) => {
        return userHashtagList.reduce((score, tag) => {
          return score + (plan.description.toLowerCase().includes(tag) ? 1 : 0);
        }, 0);
      };
      
      const aScore = getMatchScore(a);
      const bScore = getMatchScore(b);
      
      return bScore - aScore || new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [learningPlans, userHashtagList]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const highlightHashtags = (text) => {
    if (!text || userHashtagList.length === 0) return text;

    return text.split(/(\s+)/).map((part, index) => {
      const cleanPart = part.trim().toLowerCase();
      return (part.startsWith('#') && userHashtagList.includes(cleanPart)) ? (
        <span key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : part;
    });
  };

  return (
    <div>
      <Header user={loggedUser} />
      <HomeSubHeader view={view} setView={setView} />

      <div className="p-4 max-w-3xl mx-auto">
        {view === 'posts' && (
          <>
            <h1 className="text-3xl font-bold mb-6">Posts</h1>
            {followedUsersPosts.length === 0 ? (
              <p className="text-gray-600">No posts from followed users yet.</p>
            ) : (
              followedUsersPosts.map((post) => (
                <div key={post.id} className="mb-6 p-5 border rounded-lg shadow-md bg-white">
                  <div className="mb-2 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{post.userName}</h2>
                    <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                  </div>
                  <p className="mb-3 text-gray-800">{post.description}</p>

                  {post.contentType === 'image' && post.filePath && (
                    <img
                      src={`http://localhost:8080${post.filePath}`}
                      alt={post.fileName}
                      className="w-full max-h-96 object-cover rounded"
                    />
                  )}
                </div>
              ))
            )}
          </>
        )}

        {view === 'learning' && (
          <>
            <h1 className="text-3xl font-bold mb-6">Learning Plans</h1>
            {sortedLearningPlans.length === 0 ? (
              <p className="text-gray-600">No learning plans available yet.</p>
            ) : (
              sortedLearningPlans.map((plan) => {
                const matchingHashtags = userHashtagList.filter(tag => 
                  plan.description.toLowerCase().includes(tag)
                );
                const hasMatchingHashtags = matchingHashtags.length > 0;

                return (
                  <div key={plan.planId} className={`mb-6 p-5 border rounded-lg shadow-md bg-white ${
                    hasMatchingHashtags ? 'border-blue-300' : ''
                  }`}>
                    {hasMatchingHashtags && (
                      <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-blue-700 font-medium">
                          {matchingHashtags.length > 1 
                            ? `Matches ${matchingHashtags.length} of your interests!` 
                            : 'Matches your interest!'}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {matchingHashtags.map((tag, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
                    <p className="text-gray-800 whitespace-pre-line mb-3">
                      {highlightHashtags(plan.description)}
                    </p>

                    <h3 className="text-lg font-medium mb-2">Subtopics:</h3>
                    {planTopics[plan.planId] && planTopics[plan.planId].length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {planTopics[plan.planId].map((topic) => (
                          <li key={topic.topicId}>
                            <p className="font-semibold">{topic.title}</p>
                            <p>{topic.content}</p>
                            {topic.url && (
                              <div className="mt-2">
                                {(() => {
                                  const match = topic.url.match(
                                    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/
                                  );
                                  const videoId = match ? match[1] : null;

                                  return videoId ? (
                                    <a
                                      href={topic.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block w-full max-w-md"
                                    >
                                      <img
                                        src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                                        alt="YouTube Video Thumbnail"
                                        className="rounded-md shadow hover:opacity-80 transition duration-200"
                                      />
                                      <p className="text-blue-600 mt-1 underline text-sm">Watch Video</p>
                                    </a>
                                  ) : (
                                    <p className="text-red-500 text-sm">Invalid YouTube URL</p>
                                  );
                                })()}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No subtopics available.</p>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;