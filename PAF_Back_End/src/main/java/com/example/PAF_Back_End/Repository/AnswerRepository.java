package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestion_IdOrderByCreatedAtAsc(Long questionId);
    List<Answer> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail);
    
    // New sorting methods
    List<Answer> findByQuestion_IdOrderByReviewsDesc(Long questionId); // Most upvoted first
    List<Answer> findByQuestion_IdOrderByReviewsDescCreatedAtDesc(Long questionId); // Most upvoted, then newest
    List<Answer> findByQuestion_IdOrderByCreatedAtDesc(Long questionId); // Newest first
}