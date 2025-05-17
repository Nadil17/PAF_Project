import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function RetriveAllPlans() {
  const { userId } = useParams();
  const [allPlans, setAllLearningPlans] = useState([]);
  const nagivate = useNavigate();

  useEffect(() => {
    async function fetchPlansAndTopics() {
      try {
        const plansResponse = await axios.get(`http://localhost:8080/api/learningplans/getAllPlans`);
        const plansData = plansResponse.data;

        const plansWithTopics = await Promise.all(
          plansData.map(async (plan) => {
            const topicsResponse = await axios.get(
              `http://localhost:8080/api/topics/getLectures/${plan.planId}`
            );
            return {
              ...plan,
              topics: topicsResponse.data,
            };
          })
        );

        setAllLearningPlans(plansWithTopics);
      } catch (error) {
        console.error('Error fetching plans or topics:', error);
      }
    }

    fetchPlansAndTopics();
  }, []);

  // Helper function to extract YouTube video ID
  const getYouTubeId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return match ? match[1] : null;
  };

  function handleCreateNewLearningPlan(){
    nagivate(`/create_a_learning_plan/${userId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6">
        <button
          onClick={handleCreateNewLearningPlan}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          Create New learning Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allPlans.map((plan) => (
          <div
            key={plan.planId}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.title}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">Topics:</h3>
            <ul className="space-y-4">
              {plan.topics && plan.topics.length > 0 ? (
                plan.topics.map((topic) => {
                  const videoId = getYouTubeId(topic.url);
                  const thumbnailUrl = videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : null;

                  return (
                    <li
                      key={topic.topicId}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <p className="font-medium text-gray-800">{topic.title}</p>
                      <p className="text-sm text-gray-600 mb-2">{topic.content}</p>
                      {thumbnailUrl ? (
                        <a
                          href={topic.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          <img
                            src={thumbnailUrl}
                            alt="YouTube Thumbnail"
                            className="rounded-lg shadow-md hover:opacity-90 transition"
                          />
                        </a>
                      ) : (
                        <p className="text-red-500 text-sm">Invalid YouTube URL</p>
                      )}
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-gray-500">No topics found.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RetriveAllPlans;
