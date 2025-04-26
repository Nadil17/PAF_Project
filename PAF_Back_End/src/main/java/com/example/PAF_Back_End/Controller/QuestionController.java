package com.example.PAF_Back_End.Controller;

import com.example.PAF_Back_End.DTO.QuestionDTO;
import com.example.PAF_Back_End.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    
    @Autowired
    private QuestionService questionService;
    
    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions(@AuthenticationPrincipal OAuth2User principal) {
        String userEmail = principal != null ? principal.getAttribute("email") : null;
        List<QuestionDTO> questions = questionService.getAllQuestions(userEmail);
        return ResponseEntity.ok(questions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {
        String userEmail = principal != null ? principal.getAttribute("email") : null;
        QuestionDTO question = questionService.getQuestionById(id, userEmail);
        return ResponseEntity.ok(question);
    }
    
    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(
            @RequestBody QuestionDTO questionDTO,
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = principal.getAttribute("email");
        String userName = principal.getAttribute("name");
        
        QuestionDTO createdQuestion = questionService.createQuestion(questionDTO, userEmail, userName);
        return ResponseEntity.ok(createdQuestion);
    }
    
    @PostMapping("/{id}/upvote")
    public ResponseEntity<QuestionDTO> upvoteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = principal.getAttribute("email");
        QuestionDTO updatedQuestion = questionService.upvoteQuestion(id, userEmail);
        return ResponseEntity.ok(updatedQuestion);
    }
    
    @PostMapping("/{id}/remove-upvote")
    public ResponseEntity<QuestionDTO> removeUpvote(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = principal.getAttribute("email");
        QuestionDTO updatedQuestion = questionService.removeUpvote(id, userEmail);
        return ResponseEntity.ok(updatedQuestion);
    }
}