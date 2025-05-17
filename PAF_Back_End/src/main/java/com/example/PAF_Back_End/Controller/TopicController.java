package com.example.PAF_Back_End.Controller;
import com.example.PAF_Back_End.dto.TopicDTO;
import com.example.PAF_Back_End.Service.PlanService;
import com.example.PAF_Back_End.Service.TopicService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/topics")
public class TopicController {
    private final TopicService topicService;
    private final PlanService planService;

    public TopicController(TopicService topicService, PlanService planService) {
        this.topicService = topicService;
        this.planService = planService;
    }

    @PostMapping("/addTopics")
    public TopicDTO addTopics(@RequestBody TopicDTO topicsDTO){
        return topicService.saveTopic(topicsDTO);
    }

    @GetMapping("/getLectures/{planId}")
    public List<TopicDTO> getLecturesByPlanId(@PathVariable Integer planId){
        return topicService.getLecturesByPlanId(planId);
    }

    @DeleteMapping("/removeItem/{topicId}")
    public String removeTopicId(@PathVariable Integer topicId){
        return topicService.removeTopicId(topicId);
    }

    //Update Topics
    @PutMapping("/updateTopic")
    public TopicDTO updateOrderStatus(@RequestBody TopicDTO topicDTO){
        return topicService.updateTopicByTopicId(topicDTO);
    }

}