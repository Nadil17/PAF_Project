import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {

    const[userId , setUserId] = useState("");
    const navigate = useNavigate();

    function handleCreateLearningPlanButton(){
        navigate(`create_a_learning_plan/${userId}`);
    }

  return (
    <div>
        <input onChange={(e) => {
            setUserId(e.target.value);
        }} placeholder='User Id'></input>
        <br></br>
        <br></br>
        <button onClick={handleCreateLearningPlanButton}>Create a Learning Plan</button>

        
    </div>
  )
}

export default Home