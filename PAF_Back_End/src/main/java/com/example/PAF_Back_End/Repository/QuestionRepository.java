package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByOrderByCreatedAtDesc();
    List<Question> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail);

    // New sorting methods
    List<Question> findAllByOrderByReviewsDesc(); // Most upvoted first
    List<Question> findAllByOrderByReviewsDescCreatedAtDesc(); // Most upvoted, then newest
    List<Question> findAllByOrderByCreatedAtAsc(); // Oldest first

    // Find questions with answers count
    @Query("SELECT q, COUNT(a) FROM Question q LEFT JOIN q.answers a GROUP BY q ORDER BY COUNT(a) DESC")
    List<Object[]> findQuestionsOrderByAnswerCountDesc();
}