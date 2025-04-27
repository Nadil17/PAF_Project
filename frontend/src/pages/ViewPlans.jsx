import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa"; 
import PlanSubHeader from '../components/PlanSubHeader';

function ViewPlans() {

    const {userId} = useParams();
    const navigate = useNavigate();
    const [plansForUserId , setPlansForUserId] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState({ planId: '', title: '', description: '' });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);


    useEffect(() => {
        axios.get(`http://localhost:8080/api/learningplans/getLearningPlans/${userId}`).then((res) => {
            setPlansForUserId(res.data);
            console.log(res.data);
        })
    } ,[]);

    const handleModify = (planId) => {
        navigate(`/addTopics/${planId}`);
      };


    const openEditPopup = (plan) => {
        setCurrentPlan(plan);
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentPlan(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdatePlan = () => {
        axios.put(`http://localhost:8080/api/learningplans/updatePlan`, {
            planId : currentPlan.planId,
            title: currentPlan.title,
            description: currentPlan.description
        })
            .then(() => {
                setPlansForUserId(plansForUserId.map(plan => (
                    plan.planId === currentPlan.planId ? { ...plan, title: currentPlan.title, description: currentPlan.description } : plan
                )));
                setIsEditing(false);
                alert("Plan updated successfully!");
            })
            .catch(error => {
                console.error("Error updating plan:", error);
                alert("Failed to update the plan.");
            });
    };

    const handleDelete = (planId) => {
        setPlanToDelete(planId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (planToDelete) {
            axios.delete(`http://localhost:8080/api/learningplans/removePlan/${planToDelete}`)
                .then(() => {
                    setPlansForUserId(plansForUserId.filter(plan => plan.planId !== planToDelete));
                    setShowDeleteModal(false);
                    alert("Plan deleted successfully!");
                })
                .catch(error => {
                    console.error("Error deleting plan:", error);
                    alert("Failed to delete the plan.");
                });
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPlanToDelete(null);
    };

  return (
    <div className="p-8">
        {/* Subheader */}
        <PlanSubHeader/>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                Learning Plans for User {userId}
            </h2>

            {plansForUserId.length === 0 ? (
                <p className="text-center text-gray-500">No plans found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plansForUserId.map((plan) => (
                        <div
                            key={plan.planId}
                            className="border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 bg-white relative"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.title}</h3>
                            <p className="text-gray-600 mb-4">{plan.description}</p>
                            <p className="text-sm text-gray-400 mb-4">Plan ID: {plan.planId}</p>

                            <button
                                onClick={() => handleModify(plan.planId)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Add Lectures
                            </button>

                            {/* Icons section */}
                            <div className="absolute top-4 right-4 flex space-x-3">
                                <button onClick={() => openEditPopup(plan)} className="text-yellow-500 hover:text-yellow-600">
                                    <FaPencilAlt size={18} />
                                </button>

                                <button onClick={() => handleDelete(plan.planId)} className="text-red-500 hover:text-red-600">
                                    <FaTrash size={18} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Popup Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center text-gray-700">Edit Plan</h2>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-600">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentPlan.title}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-600">Description</label>
                            <textarea
                                name="description"
                                value={currentPlan.description}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePlan}
                                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center text-gray-700">Confirm Deletion</h2>
                        <p className="text-center text-gray-600">Are you sure you want to delete this plan?</p>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
  )
}

export default ViewPlans