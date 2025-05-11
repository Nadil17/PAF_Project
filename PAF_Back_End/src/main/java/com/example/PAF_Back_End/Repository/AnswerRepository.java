package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestion_IdOrderByCreatedAtAsc(Long questionId);
}