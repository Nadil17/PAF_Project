import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

//
function PlanSubHeader() {
  const navigate = useNavigate();
  const { userId } = useParams();
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
    <div className="flex space-x-6 mb-8 justify-center">
      <button 
        onClick={goToCreatePlan}
        className={`font-semibold text-lg pb-1 transition duration-300 ${
          isCreatePlanPage ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-600'
        }`}
      >
        Create Plan
      </button>
      <button 
        onClick={goToViewPlans}
        className={`font-semibold text-lg pb-1 transition duration-300 ${
          isViewPlansPage ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-600'
        }`}
      >
        View Plans
      </button>
    </div>
  )
}

export default PlanSubHeader;
