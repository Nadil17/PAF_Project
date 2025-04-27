import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

function UpdateTopic() {
    const location = useLocation();
  const navigate = useNavigate();
  const { lecture } = location.state;

  const [formData, setFormData] = React.useState({
    topicId: lecture.topicId,
    title: lecture.title,
    content: lecture.content,
    url: lecture.url,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/api/topics/updateTopic`, formData)
      .then(() => {
        alert("Lecture updated successfully!");
        navigate(-1); // Go back to the previous page
      })
      .catch(err => {
        console.error(err);
        alert("Failed to update lecture!");
      });
  };
  return (
    <div className="p-8 min-h-screen bg-gray-100">
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Update Lecture</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-gray-600">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-600">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            required
            className="w-full border px-4 py-2 rounded"
          ></textarea>
        </div>

        <div>
          <label className="block mb-2 text-gray-600">URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Update Lecture
        </button>
      </form>
    </div>
  </div>
  )
}

export default UpdateTopic