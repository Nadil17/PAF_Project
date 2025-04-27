import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

function AddTopics() {
    const { planId } = useParams();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [planDetails, setPlanDetails] = useState(null);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [existingLectures, setExistingLectures] = useState([]);
    const [topicData, setTopicData] = useState({
        title: '',
        content: '',
        url: '',
        planId: planId
      });

      
    

    useEffect(() => {
        axios.get(`http://localhost:8080/api/learningplans/getPlanByPlanId/${planId}`)
          .then((res) => {
            if (Array.isArray(res.data) && res.data.length > 0) {
              setPlanDetails(res.data[0]);    
            } else {
              console.warn("No plan found");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }, [planId]);

      useEffect(() => {
        axios.get(`http://localhost:8080/api/topics/getLectures/${planId}`)
          .then((res) => {
            setExistingLectures(res.data);
            console.log(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }, [planId]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setTopicData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8080/api/topics/addTopics`, {
          ...topicData,
          topicId: 0, // backend auto-generates
        })
        .then(() => {
          alert("Topic added successfully!");
          navigate(-1); // 👈 Go back to previous page
        })
        .catch(err => {
          console.error(err);
          alert("Failed to add topic!");
        });
      };

      const handleAddLectureClick = () => {
        setShowForm(true);
      };

      const extractYouTubeId = (url) => {
        try {
          if (url.includes("youtube.com")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            return urlParams.get("v");
          } else if (url.includes("youtu.be")) {
            return url.split("/").pop();
          }
        } catch (error) {
          console.error("Invalid URL");
        }
        return null;
      };

      const handleDeleteLecture = (topicId) => {
        setSelectedTopicId(topicId);
        setShowDeletePopup(true);
      };
      
      //Delete Topic by TopicId 
      const confirmDeleteLecture = () => {
        axios.delete(`http://localhost:8080/api/topics/removeItem/${selectedTopicId}`)
          .then(() => {
            alert("Lecture deleted successfully!");
            setExistingLectures(prev => prev.filter(lecture => lecture.topicId !== selectedTopicId));
          })
          .catch(err => {
            console.error(err);
            alert("Failed to delete lecture!");
          })
          .finally(() => {
            setShowDeletePopup(false);
            setSelectedTopicId(null);
          });
      };
      
      const cancelDeleteLecture = () => {
        setShowDeletePopup(false);
        setSelectedTopicId(null);
      };
      

      const handleUpdateLecture = (lecture) => {
        navigate(`/updateLecture/${lecture.topicId}`, { state: { lecture } });
      };

      

  return (
    <div className="p-8 min-h-screen bg-gray-100">
        
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Plan Details
      </h2>

      {planDetails ? (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          {/* Plan Info */}
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {planDetails.title}
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            {planDetails.description}
          </p>
          <div className="text-sm text-gray-500 mb-8">
            <p><span className="font-semibold">Plan ID:</span> {planDetails.planId}</p>
            <p><span className="font-semibold">User ID:</span> {planDetails.userId}</p>
          </div>

          {/* Add Lecture Section */}
          {!showForm ? (
            <div className="text-center">
              <button
                onClick={handleAddLectureClick}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
              >
                <span className="text-xl">➕</span> Add a Lecture
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8">
              <h4 className="text-xl font-bold text-gray-700 mb-4 text-center">New Lecture Details</h4>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2" htmlFor="title">Lecture Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={topicData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-2" htmlFor="content">Lecture Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={topicData.content}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 mb-2" htmlFor="url">Reference URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={topicData.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Save Lecture
              </button>
            </form>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading plan details...</p>
      )}

      {/* Lectures List */}
      <div className="max-w-4xl mx-auto mt-12 flex flex-col gap-8">
        {existingLectures.map((lecture, index) => {
          const youtubeId = lecture.url ? extractYouTubeId(lecture.url) : null;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-blue-600 mb-2">
                Lecture {index + 1}: {lecture.title}
              </h3>
              <p className="text-gray-700 mb-4">{lecture.content}</p>

              {youtubeId ? (
                <a href={lecture.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative">
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      className="w-full rounded-lg shadow-md hover:opacity-90 transition"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 p-3 rounded-full">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                lecture.url && (
                  <a
                    href={lecture.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Visit Reference
                  </a>
                )
              )}
                {/* 👉 Buttons to update and delete */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleUpdateLecture(lecture)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Update
        </button>
        <button
          onClick={() => handleDeleteLecture(lecture.topicId)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
              
            </div>
          );
        })}
      </div>



      {showDeletePopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Confirm Delete</h2>
      <p className="text-gray-600">Are you sure you want to delete this lecture?</p>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={confirmDeleteLecture}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Yes, Delete
        </button>
        <button
          onClick={cancelDeleteLecture}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  )
}

export default AddTopics