import React , {useEffect , useState} from 'react'
import axios from 'axios';
import Header from './Header';
import HomeSubHeader from './HomeSubHeader';

function Home() {

    const [loggedUser, setLoggedUser] = useState(null);
    const [followingUsers , setFollowingUsers] = useState([]);
    const [followedUsersPosts, setFollowedUsersPosts] = useState([]);
    const [view, setView] = useState('posts');
    const [learningPlans, setLearningPlans] = useState([]);
    const [planTopics, setPlanTopics] = useState({});


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

  //get the followings from user id
  useEffect(() => {
  if (loggedUser) {
    axios.get(`http://localhost:8080/api/follow/getAlreadyFollowUsers/${loggedUser.userId}`)
      .then((res) => {
        setFollowingUsers(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error('Error fetching followings:', err);
      });
  }
}, [loggedUser]); // Dependency array includes loggedUser

// Fetch posts from each followed user
  useEffect(() => {
    const fetchAllPosts = async () => {
      const allPosts = [];

      for (const followObj of followingUsers) {
        try {
          const res = await axios.get(`http://localhost:8080/api/getPostsByUserIdNew/${followObj.followerId}`);
          console.log(res.data);
          allPosts.push(...res.data); // Combine posts from all followed users
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

  //Get All Learning plans - user followed users ones
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

//Get all Topics from planId
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


  // Format date nicely
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  

  return (
    <div>
        <Header user={loggedUser} />
        <HomeSubHeader view={view} setView={setView} />

   <div className="p-4 max-w-3xl mx-auto">
    {/* Ensure user on posts */}
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
    {learningPlans.length === 0 ? (
      <p className="text-gray-600">No learning plans available yet.</p>
    ) : (
      learningPlans.map((plan) => (
        <div key={plan.planId} className="mb-6 p-5 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
          <p className="text-gray-800 whitespace-pre-line mb-3">{plan.description}</p>

          <h3 className="text-lg font-medium mb-2">Subtopics:</h3>
          {planTopics[plan.planId] && planTopics[plan.planId].length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {planTopics[plan.planId].map((topic) => (
                <li key={topic.topicId}>
                  <p className="font-semibold">{topic.title}</p>
                  <p>{topic.content}</p>
                  {topic.url && (
                    <div className="mt-2">
                        {/* Extract video ID from URL */}
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
      ))
    )}
  </>
)}




    </div>
    </div>
  )
}

export default Home