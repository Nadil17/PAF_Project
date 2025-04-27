
package com.example.PAF_LearningPlans_Backend.service;
import com.example.PAF_LearningPlans_Backend.dto.PlanDTO;
import com.example.PAF_LearningPlans_Backend.dto.TopicDTO;
import com.example.PAF_LearningPlans_Backend.model.Plan;
import com.example.PAF_LearningPlans_Backend.model.Topic;
import com.example.PAF_LearningPlans_Backend.repo.PlanRepo;
import com.example.PAF_LearningPlans_Backend.repo.TopicRepo;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TopicService {
    @Autowired
    private TopicRepo topicsRepo;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PlanRepo planRepo;

    public TopicDTO saveTopic(TopicDTO topicsDTO){
        topicsRepo.save(modelMapper.map(topicsDTO , Topic.class));
        return topicsDTO;
    }

    public List<TopicDTO> getLecturesByPlanId(Integer planId){
        List<Topic> topic = topicsRepo.findTopicsByPlanId(planId);
        return topic.stream()
                .map(order -> modelMapper.map(order , TopicDTO.class))
                .collect(Collectors.toList());
    }

    public String removeTopicId(Integer topicId){
        topicsRepo.deleteById(topicId);
        return "Topic Removed";
    }

    public TopicDTO updateTopicByTopicId(TopicDTO topicDTO){
        topicsRepo.updateTopicByTopicId(topicDTO.getTopicId() , topicDTO.getTitle() , topicDTO.getUrl() , topicDTO.getContent());
        // Fetch and return the updated topic as a DTO
        Topic updatedTopic = topicsRepo.findById(topicDTO.getTopicId()).orElseThrow(() -> new RuntimeException("Topic not found"));
        return modelMapper.map(updatedTopic, TopicDTO.class);
    }

    ////Remove All existing PlanId's from Topic Id
    public String removePlansFromTopicTable(Integer planId){
        topicsRepo.removePlansFromTopicTable(planId);
        return "Item Removed";
    }
}
