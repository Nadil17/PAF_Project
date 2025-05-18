import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

//
function PlanSubHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCreatePlanPage = location.pathname.includes("/create_a_learning_plan");
  const isViewPlansPage = location.pathname.includes("/viewPlans");

  function goToCreatePlan() {
    navigate(`/create_a_learning_plan`);
  }

  function goToViewPlans() {
    navigate(`/viewPlans`);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8 mx-auto max-w-md">
      <h3 className="text-xl font-semibold text-green-700 text-center mb-4">Learning Plans</h3>
      
      <div className="flex space-x-4">
        <button 
          onClick={goToCreatePlan}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
            isCreatePlanPage 
              ? 'bg-green-600 text-white shadow-sm' 
              : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
          }`}
        >
          Create Plan
        </button>
        <button 
          onClick={goToViewPlans}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
            isViewPlansPage 
              ? 'bg-green-600 text-white shadow-sm' 
              : 'bg-white text-green-700 border border-green-200 hover:bg-green-50'
          }`}
        >
          View Plans
        </button>
      </div>
    </div>
  )
}

export default PlanSubHeader;
