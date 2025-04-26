package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.DTO.AnswerDTO;
import com.example.PAF_Back_End.Model.Answer;
import com.example.PAF_Back_End.Model.Question;
import com.example.PAF_Back_End.Repository.AnswerRepository;
import com.example.PAF_Back_End.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnswerService {
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    public List<AnswerDTO> getAnswersByQuestionId(Long questionId) {
        List<Answer> answers = answerRepository.findByQuestionIdOrderByCreatedAtAsc(questionId);
        return answers.stream()
                .map(this::mapAnswerToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AnswerDTO createAnswer(AnswerDTO answerDTO, Long questionId, String authorEmail, String authorName) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
        
        Answer answer = new Answer();
        answer.setContent(answerDTO.getContent());
        answer.setAuthorEmail(authorEmail);
        answer.setAuthorName(authorName);
        answer.setQuestion(question);
        
        Answer savedAnswer = answerRepository.save(answer);
        return mapAnswerToDTO(savedAnswer);
    }
    
    private AnswerDTO mapAnswerToDTO(Answer answer) {
        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setContent(answer.getContent());
        dto.setCreatedAt(answer.getCreatedAt());
        dto.setAuthorEmail(answer.getAuthorEmail());
        dto.setAuthorName(answer.getAuthorName());
        dto.setQuestionId(answer.getQuestion().getId());
        return dto;
    }
}