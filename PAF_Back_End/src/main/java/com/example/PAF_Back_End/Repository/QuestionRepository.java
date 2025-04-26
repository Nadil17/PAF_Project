package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByOrderByCreatedAtDesc();
    List<Question> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail);
}