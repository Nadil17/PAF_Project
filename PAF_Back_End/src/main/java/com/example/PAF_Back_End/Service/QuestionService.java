package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.DTO.AnswerDTO;
import com.example.PAF_Back_End.DTO.QuestionDTO;
import com.example.PAF_Back_End.Model.Answer;
import com.example.PAF_Back_End.Model.Question;
import com.example.PAF_Back_End.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    public List<QuestionDTO> getAllQuestions(String currentUserEmail) {
        List<Question> questions = questionRepository.findAllByOrderByCreatedAtDesc();
        return mapQuestionsToDTO(questions, currentUserEmail);
    }
    
    public QuestionDTO getQuestionById(Long id, String currentUserEmail) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        
        return mapQuestionToDTO(question, currentUserEmail);
    }
    
    @Transactional
    public QuestionDTO createQuestion(QuestionDTO questionDTO, String authorEmail, String authorName) {
        Question question = new Question();
        question.setTitle(questionDTO.getTitle());
        question.setContent(questionDTO.getContent());
        question.setAuthorEmail(authorEmail);
        question.setAuthorName(authorName);
        
        Question savedQuestion = questionRepository.save(question);
        return mapQuestionToDTO(savedQuestion, authorEmail);
    }
    
    @Transactional
    public QuestionDTO upvoteQuestion(Long questionId, String userEmail) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
        
        List<String> upvotedBy = question.getUpvotedBy();
        
        // Check if user has already upvoted
        if (!upvotedBy.contains(userEmail)) {
            upvotedBy.add(userEmail);
            question.setReviews(question.getReviews() + 1);
            questionRepository.save(question);
        }
        
        return mapQuestionToDTO(question, userEmail);
    }
    
    @Transactional
    public QuestionDTO removeUpvote(Long questionId, String userEmail) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
        
        List<String> upvotedBy = question.getUpvotedBy();
        
        // Check if user has upvoted
        if (upvotedBy.contains(userEmail)) {
            upvotedBy.remove(userEmail);
            question.setReviews(Math.max(0, question.getReviews() - 1)); // Ensure reviews doesn't go below 0
            questionRepository.save(question);
        }
        
        return mapQuestionToDTO(question, userEmail);
    }
    
    private List<QuestionDTO> mapQuestionsToDTO(List<Question> questions, String currentUserEmail) {
        return questions.stream()
                .map(q -> mapQuestionToDTO(q, currentUserEmail))
                .collect(Collectors.toList());
    }
    
    private QuestionDTO mapQuestionToDTO(Question question, String currentUserEmail) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setContent(question.getContent());
        dto.setCreatedAt(question.getCreatedAt());
        dto.setAuthorEmail(question.getAuthorEmail());
        dto.setAuthorName(question.getAuthorName());
        dto.setReviews(question.getReviews());
        
        // Check if current user has upvoted this question
        dto.setUpvotedByCurrentUser(question.getUpvotedBy().contains(currentUserEmail));
        
        // Map answers
        List<AnswerDTO> answerDTOs = question.getAnswers().stream()
                .map(this::mapAnswerToDTO)
                .collect(Collectors.toList());
        dto.setAnswers(answerDTOs);
        
        return dto;
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