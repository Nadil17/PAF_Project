package com.example.PAF_Back_End.Controller;

import com.example.PAF_Back_End.DTO.AnswerDTO;
import com.example.PAF_Back_End.Model.Answer;
import com.example.PAF_Back_End.Service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {
    
    @Autowired
    private AnswerService answerService;

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Answer>> getAnswersByQuestionId(@PathVariable Long questionId) {
        List<Answer> answers = answerService.getAnswersByQuestionId(questionId);
        return ResponseEntity.ok(answers);
    }
    
    @PostMapping("/question/{questionId}")
    public ResponseEntity<AnswerDTO> createAnswer(
            @RequestBody AnswerDTO answerDTO,
            @PathVariable Long questionId,
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = principal.getAttribute("email");
        String userName = principal.getAttribute("name");
        
        AnswerDTO createdAnswer = answerService.createAnswer(answerDTO, questionId, userEmail, userName);
        return ResponseEntity.ok(createdAnswer);
    }
}