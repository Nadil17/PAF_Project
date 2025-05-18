import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import { FaPencilAlt, FaTrash, FaBook, FaPlus } from "react-icons/fa"; 
import PlanSubHeader from '../components/PlanSubHeader';
import Header from './Header';


function ViewPlans() {

    const {userId} = useParams();
    const navigate = useNavigate();
    const [plansForUserId , setPlansForUserId] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState({ planId: '', title: '', description: '' });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [user, setUser] = useState(null);


    //get userid from oauth
    useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);


    //get all learning plans from userid
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:8080/api/learningplans/getLearningPlans/${user.userId}`)
            .then((res) => {
                setPlansForUserId(res.data);
                console.log(res.data);
            })
            .catch((error) => {
                console.error("Error fetching plans:", error);
            });
        }
    }, [user]); 


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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Header user={user} />
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-green-800">
                        Your Learning Plans
                    </h1>
                    <p className="text-xl text-green-700 leading-relaxed">
                        Organize your educational journey with custom learning plans and track your progress.
                    </p>
                </div>
                <div className="hidden md:block">
                    <img 
                        src="/images/learning-plans.jpg" 
                        alt="Learning Plans" 
                        className="rounded-xl shadow-xl"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/600x400?text=Learning+Plans";
                        }}
                    />
                </div>
            </div>

            <PlanSubHeader />

            <div className="mt-8">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
                    Your Learning Plans
                </h2>

                {plansForUserId.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md mx-auto">
                        <div className="text-green-500 text-6xl mb-4 flex justify-center">
                            <FaBook />
                        </div>
                        <p className="text-xl text-green-700 mb-4">No plans found.</p>
                        <p className="text-green-600 mb-6">Create your first learning plan to get started!</p>
                        <button
                            onClick={() => navigate('/create_a_learning_plan')}
                            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center"
                        >
                            <FaPlus className="mr-2" /> Create New Plan
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plansForUserId.map((plan) => (
                            <div
                                key={plan.planId}
                                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 relative"
                            >
                                <h3 className="text-xl font-semibold text-green-800 mb-3">{plan.title}</h3>
                                <p className="text-green-700 mb-6">{plan.description}</p>
                                <p className="text-sm text-green-500 mb-4">Plan ID: {plan.planId}</p>

                                <button
                                    onClick={() => handleModify(plan.planId)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 inline-flex items-center"
                                >
                                    <FaPlus className="mr-2" /> Add Lectures
                                </button>

                                {/* Actions */}
                                <div className="absolute top-4 right-4 flex space-x-3">
                                    <button 
                                        onClick={() => openEditPopup(plan)} 
                                        className="text-yellow-500 hover:text-yellow-600 p-2 bg-yellow-50 rounded-full"
                                        title="Edit Plan"
                                    >
                                        <FaPencilAlt size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(plan.planId)} 
                                        className="text-red-500 hover:text-red-600 p-2 bg-red-50 rounded-full"
                                        title="Delete Plan"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Edit Modal - Keep this part of the code unchanged */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center text-green-700">Edit Plan</h2>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-600">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentPlan.title}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-600">Description</label>
                            <textarea
                                name="description"
                                value={currentPlan.description}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
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
                                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal - Keep this part of the code unchanged but update colors */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center text-green-700">Confirm Deletion</h2>
                        <p className="text-center text-gray-600 mb-6">Are you sure you want to delete this plan?</p>
                        <div className="flex justify-end space-x-3">
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
    </div>
  )
}

export default ViewPlans