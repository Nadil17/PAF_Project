package com.example.PAF_LearningPlans_Backend.repo;

import com.example.PAF_LearningPlans_Backend.model.Plan;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepo extends JpaRepository<Plan , Integer> {

    @Query(value = "SELECT * FROM plan WHERE user_id = ?1" , nativeQuery = true)
    List<Plan> findLearningPlansFromUserId(Integer userId);

    //Get plan details by userid and planid
    @Query(value = "SELECT * FROM plan WHERE plan_id = ?1" , nativeQuery = true)
    List<Plan> findPlanById(Integer planId);

    //Update Topic by Id
    @Modifying
    @Transactional
    @Query("UPDATE Plan p SET p.title = ?1 , p.description = ?2 where p.planId = ?3")
    void UpdatePlanByPlanId(String title , String description , Integer planId);

}
