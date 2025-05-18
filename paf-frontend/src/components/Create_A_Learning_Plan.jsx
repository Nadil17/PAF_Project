import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import PlanSubHeader from '../components/PlanSubHeader';
import Header from './Header';
import { FaBookOpen, FaPencilAlt } from 'react-icons/fa';

function Create_A_Learning_Plan() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const[title,setTitle] = useState("");
    const[description , setDescription] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);
    

    function createPlan(){
      const savePlan = {
        userId : user.userId,
        title,
        description
      }

       console.log("Sending data:", savePlan); // <-- check this output

      axios.post("http://localhost:8080/api/learningplans/addLearningPlan",savePlan).then(() => {
        alert("Plan Created")
      }).catch((err) => {
        alert(err);
      })
    }

    function handleViewplanButton () {
      navigate(`/viewPlans/${userId}`);
    } 

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Header user={user} />
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800">
              Create Learning Plan
            </h1>
            <p className="text-xl text-green-700 leading-relaxed">
              Design your own educational roadmap and share knowledge with others.
            </p>
          </div>
          <div className="hidden md:block">
            <img 
              src="/images/create-plan.jpg" 
              alt="Create Plan" 
              className="rounded-xl shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Create+Learning+Plan";
              }}
            />
          </div>
        </div>

        <PlanSubHeader />

        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md mt-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <FaBookOpen className="text-green-600 text-2xl" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
            Create New Plan
          </h2>

          <div className="mb-5">
            <label className="block text-green-800 font-medium mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter learning plan title"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-green-800 font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows="4"
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <button
            onClick={createPlan}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
          >
            <FaPencilAlt className="mr-2" />
            Create Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default Create_A_Learning_Plan