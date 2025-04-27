import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import PlanSubHeader from '../components/PlanSubHeader';

function Create_A_Learning_Plan() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const[title,setTitle] = useState("");
    const[description , setDescription] = useState("");


    function createPlan(){
      const savePlan = {
        userId,
        title,
        description
      }

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <PlanSubHeader/>
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    Create a New Learning Plan
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter learning plan title"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={createPlan}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Create Plan
                    </button>

                    
                </div>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Logged in as User ID: <span className="text-gray-600 font-semibold">{userId}</span>
                </p>
            </div>
        </div>
  )
}

export default Create_A_Learning_Plan