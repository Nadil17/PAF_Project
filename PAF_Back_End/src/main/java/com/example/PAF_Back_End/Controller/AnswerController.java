// package com.example.PAF_Back_End.Controller;

// import com.example.PAF_Back_End.DTO.AnswerDTO;
// import com.example.PAF_Back_End.Service.AnswerService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/answers")
// public class AnswerController {
    
//     @Autowired
//     private AnswerService answerService;
    
//     @GetMapping("/question/{questionId}")
//     public ResponseEntity<List<AnswerDTO>> getAnswersByQuestionId(@PathVariable Long questionId) {
//         List<AnswerDTO> answers = answerService.getAnswersByQuestionId(questionId);
//         return ResponseEntity.ok(answers);
//     }
    
//     @PostMapping("/question/{questionId}")
//     public ResponseEntity<AnswerDTO> createAnswer(
//             @RequestBody AnswerDTO answerDTO,
//             @PathVariable Long questionId,
//             @AuthenticationPrincipal OAuth2User principal) {
//         if (principal == null) {
//             return ResponseEntity.status(401).build();
//         }
        
//         String userEmail = principal.getAttribute("email");
//         String userName = principal.getAttribute("name");
        
//         AnswerDTO createdAnswer = answerService.createAnswer(answerDTO, questionId, userEmail, userName);
//         return ResponseEntity.ok(createdAnswer);
//     }
// }

package com.example.PAF_Back_End.Controller;


import com.example.PAF_Back_End.Service.AnswerService;
import com.example.PAF_Back_End.dto.AnswerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @GetMapping("/question/{questionId}")
public ResponseEntity<List<AnswerDTO>> getAnswersByQuestionId(
        @PathVariable Long questionId,
        @AuthenticationPrincipal OAuth2User principal) {
    
    String userEmail = principal != null ? principal.getAttribute("email") : null;
    List<AnswerDTO> answers = answerService.getAnswersByQuestionId(questionId, userEmail);
    return ResponseEntity.ok(answers);
}

@GetMapping("/{id}")
public ResponseEntity<AnswerDTO> getAnswerById(
        @PathVariable Long id,
        @AuthenticationPrincipal OAuth2User principal) {
    if (principal == null) {
        return ResponseEntity.status(401).build();
    }
    
    String userEmail = principal.getAttribute("email");
    AnswerDTO answer = answerService.getAnswerById(id, userEmail);
    return ResponseEntity.ok(answer);
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

    // NEW: Endpoint for upvoting an answer
    @PostMapping("/{id}/upvote") // <--- Matches the frontend POST URL
    public ResponseEntity<AnswerDTO> upvoteAnswer(
            @PathVariable Long id, // <--- This is the Answer ID
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String userEmail = principal.getAttribute("email");
        // You will need to add an upvoteAnswer method to your AnswerService
        AnswerDTO updatedAnswer = answerService.upvoteAnswer(id, userEmail);
        return ResponseEntity.ok(updatedAnswer); // Return the updated answer DTO
    }

    // NEW: Endpoint for removing upvote from an answer
    @PostMapping("/{id}/remove-upvote") // <--- Matches the frontend POST URL
    public ResponseEntity<AnswerDTO> removeUpvoteAnswer(
            @PathVariable Long id, // <--- This is the Answer ID
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String userEmail = principal.getAttribute("email");
         // You will need to add a removeUpvoteAnswer method to your AnswerService
        AnswerDTO updatedAnswer = answerService.removeUpvoteAnswer(id, userEmail);
        return ResponseEntity.ok(updatedAnswer); // Return the updated answer DTO
    }


    @PutMapping("/{id}")
public ResponseEntity<AnswerDTO> updateAnswer(
        @PathVariable Long id,
        @RequestBody AnswerDTO answerDTO,
        @AuthenticationPrincipal OAuth2User principal) {
    if (principal == null) {
        return ResponseEntity.status(401).build();
    }
    
    String userEmail = principal.getAttribute("email");
    AnswerDTO updatedAnswer = answerService.updateAnswer(id, answerDTO, userEmail);
    return ResponseEntity.ok(updatedAnswer);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteAnswer(
        @PathVariable Long id,
        @AuthenticationPrincipal OAuth2User principal) {
    if (principal == null) {
        return ResponseEntity.status(401).build();
    }
    
    String userEmail = principal.getAttribute("email");
    answerService.deleteAnswer(id, userEmail);
    return ResponseEntity.noContent().build();
}

@GetMapping("/question/{questionId}/sort/upvotes")
public ResponseEntity<List<AnswerDTO>> getAnswersByQuestionIdSortedByUpvotes(
        @PathVariable Long questionId,
        @AuthenticationPrincipal OAuth2User principal) {
    String userEmail = principal != null ? principal.getAttribute("email") : null;
    List<AnswerDTO> answers = answerService.getAnswersByQuestionIdSortedByUpvotes(questionId, userEmail);
    return ResponseEntity.ok(answers);
}

@GetMapping("/question/{questionId}/sort/newest")
public ResponseEntity<List<AnswerDTO>> getAnswersByQuestionIdSortedByNewest(
        @PathVariable Long questionId,
        @AuthenticationPrincipal OAuth2User principal) {
    String userEmail = principal != null ? principal.getAttribute("email") : null;
    List<AnswerDTO> answers = answerService.getAnswersByQuestionIdSortedByNewest(questionId, userEmail);
    return ResponseEntity.ok(answers);
}
}