package com.example.PAF_LearningPlans_Backend.service;

import com.example.PAF_LearningPlans_Backend.dto.PlanDTO;
import com.example.PAF_LearningPlans_Backend.model.Plan;
import com.example.PAF_LearningPlans_Backend.repo.PlanRepo;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PlanService {
    @Autowired
    private PlanRepo planRepo;

    @Autowired
    private ModelMapper modelMapper;

    public PlanDTO savePlan(PlanDTO planDTO){
        planRepo.save(modelMapper.map(planDTO , Plan.class));
        return planDTO;
    }

    public List<PlanDTO> getPlansByUserId(Integer userId){
        List<Plan> plan = planRepo.findLearningPlansFromUserId(userId);
        return plan.stream()
                .map(order -> modelMapper.map(order , PlanDTO.class))
                .collect(Collectors.toList());
    }

    //Get plan details by userid and planid
    public List<PlanDTO> getPlanByPlanId(Integer planId){
        List<Plan> plan = planRepo.findPlanById(planId);
        return plan.stream()
                .map(order -> modelMapper.map(order , PlanDTO.class))
                .collect(Collectors.toList());
    }

    public PlanDTO UpdatePlanByPlanId(PlanDTO planDTO){
        planRepo.UpdatePlanByPlanId(planDTO.getTitle() , planDTO.getDescription() , planDTO.getPlanId());
        // Fetch and return the updated topic as a DTO
        Plan updatedPlan = planRepo.findById(planDTO.getPlanId()).orElseThrow(() -> new RuntimeException("Plan not found"));
        return modelMapper.map(updatedPlan, PlanDTO.class);
    }

    public String removePlan(Integer planId){
        planRepo.deleteById(planId);
        return "Item Removed";
    }
}
