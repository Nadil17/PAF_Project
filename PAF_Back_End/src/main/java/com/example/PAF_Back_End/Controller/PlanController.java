package com.example.PAF_Back_End.Controller;

import com.example.PAF_Back_End.dto.PlanDTO;
import com.example.PAF_Back_End.Service.PlanService;
import com.example.PAF_Back_End.Service.TopicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/learningplans")
public class PlanController {
    private final PlanService planService;
    private final TopicService topicService;

    public PlanController(PlanService planService , TopicService topicService) {
        this.planService = planService;
        this.topicService = topicService;
    }

    @GetMapping("/")
    public String getTest(){
        return "Backend is running";
    }

    //Create Learning Plan
    @PostMapping("/addLearningPlan")
    public PlanDTO addLearningPlan(@RequestBody PlanDTO planDTO) {
        return planService.savePlan(planDTO);
    }

    //Get Plans userid
    @GetMapping("/getLearningPlans/{userId}")
    public List<PlanDTO> getAllLearningPlans(@PathVariable String userId){
        return planService.getPlansByUserId(userId);
    }

    //Get plan details by userid and planid
    @GetMapping("/getPlanByPlanId/{planId}")
    public List<PlanDTO> getPlanByPlanId(@PathVariable Integer planId){
        return planService.getPlanByPlanId(planId);
    }

    //Update Plan by Id
    @PutMapping("/updatePlan")
    public PlanDTO UpdatePlanByPlanId(@RequestBody PlanDTO planDTO){
        return planService.UpdatePlanByPlanId(planDTO);
    }

    //Remove Plan
    @DeleteMapping("/removePlan/{planId}")
    public String removePlan(@PathVariable Integer planId){
        topicService.removePlansFromTopicTable(planId);
        return planService.removePlan(planId);
    }
}
