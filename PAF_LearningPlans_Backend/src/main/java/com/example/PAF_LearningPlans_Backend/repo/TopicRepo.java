package com.example.PAF_LearningPlans_Backend.repo;
import com.example.PAF_LearningPlans_Backend.model.Plan;
import com.example.PAF_LearningPlans_Backend.model.Topic;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepo extends JpaRepository<Topic, Integer> {

    @Query(value = "SELECT * FROM topic WHERE plan_id = ?1" , nativeQuery = true)
    List<Topic> findTopicsByPlanId(Integer planId);

    //Update Topic by Id
    @Modifying
    @Transactional
    @Query("UPDATE Topic t SET t.title = ?2 , t.url = ?3 , t.content = ?4 where t.topicId = ?1")
    void updateTopicByTopicId(Integer topicId , String title , String url , String context);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM topic WHERE plan_id = ?1", nativeQuery = true)
    void removePlansFromTopicTable(Integer planId);

}



