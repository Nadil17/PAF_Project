// package com.example.PAF_Back_End.Service;

// import com.example.PAF_Back_End.DTO.AnswerDTO;
// import com.example.PAF_Back_End.Model.Answer;
// import com.example.PAF_Back_End.Model.Question;
// import com.example.PAF_Back_End.Repository.AnswerRepository;
// import com.example.PAF_Back_End.Repository.QuestionRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class AnswerService {
    
//     @Autowired
//     private AnswerRepository answerRepository;
    
//     @Autowired
//     private QuestionRepository questionRepository;
    
//     public List<AnswerDTO> getAnswersByQuestionId(Long questionId) {
//         List<Answer> answers = answerRepository.findByQuestion_IdOrderByCreatedAtAsc(questionId);
//         return answers.stream()
//                 .map(this::mapAnswerToDTO)
//                 .collect(Collectors.toList());
//     }
    
//     @Transactional
//     public AnswerDTO createAnswer(AnswerDTO answerDTO, Long questionId, String authorEmail, String authorName) {
//         Question question = questionRepository.findById(questionId)
//                 .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
        
//         Answer answer = new Answer();
//         answer.setContent(answerDTO.getContent());
//         answer.setAuthorEmail(authorEmail);
//         answer.setAuthorName(authorName);
//         answer.setQuestion(question);
        
//         Answer savedAnswer = answerRepository.save(answer);
//         return mapAnswerToDTO(savedAnswer);
//     }
    
//     private AnswerDTO mapAnswerToDTO(Answer answer) {
//         AnswerDTO dto = new AnswerDTO();
//         dto.setId(answer.getId());
//         dto.setContent(answer.getContent());
//         dto.setCreatedAt(answer.getCreatedAt());
//         dto.setAuthorEmail(answer.getAuthorEmail());
//         dto.setAuthorName(answer.getAuthorName());
//         dto.setQuestionId(answer.getQuestion().getId());
//         return dto;
//     }
// }

package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.DTO.AnswerDTO;
import com.example.PAF_Back_End.Exception.ResourceNotFoundException;
import com.example.PAF_Back_End.Exception.UnauthorizedAccessException;
import com.example.PAF_Back_End.Model.Answer;
import com.example.PAF_Back_End.Model.Question;
import com.example.PAF_Back_End.Repository.AnswerRepository;
import com.example.PAF_Back_End.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import com.example.PAF_Back_End.Exception.ResourceNotFoundException;
import com.example.PAF_Back_End.Exception.UnauthorizedAccessException;

@Service
public class AnswerService {

    @Autowired
private DTOMapperService dtoMapperService;
;
    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // Updated to accept currentUserEmail for mapping upvote status
    public List<AnswerDTO> getAnswersByQuestionId(Long questionId, String currentUserEmail) {
        List<Answer> answers = answerRepository.findByQuestion_IdOrderByCreatedAtAsc(questionId);
        return answers.stream()
                .map(answer -> mapAnswerToDTO(answer, currentUserEmail)) // Pass user email to mapper
                .collect(Collectors.toList());
    }

    //Method to create an answer
    @Transactional
    public AnswerDTO createAnswer(AnswerDTO answerDTO, Long questionId, String authorEmail, String authorName) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

        Answer answer = new Answer();
        answer.setContent(answerDTO.getContent());
        answer.setAuthorEmail(authorEmail);
        answer.setAuthorName(authorName);
        answer.setQuestion(question);
        answer.setReviews(0); // Initialize reviews to 0 for a new answer
        answer.setUpvotedBy(new java.util.ArrayList<>()); // Initialize the upvotedBy list

        Answer savedAnswer = answerRepository.save(answer);
        // Map the newly created answer, assuming the author is the current user
        return mapAnswerToDTO(savedAnswer, authorEmail);
    }
// Method to update an answer
    @Transactional
    public AnswerDTO updateAnswer(Long answerId, AnswerDTO answerDTO, String currentUserEmail) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));
        
        // Check if the current user is the author
        if (!answer.getAuthorEmail().equals(currentUserEmail)) {
            throw new UnauthorizedAccessException("You are not authorized to update this answer");
        }
        
        answer.setContent(answerDTO.getContent());
        Answer updatedAnswer = answerRepository.save(answer);
        return mapAnswerToDTO(updatedAnswer, currentUserEmail);
    }

    // Method to delete an answer
    @Transactional
    public void deleteAnswer(Long answerId, String currentUserEmail) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + answerId));
        
        // Check if the current user is the author
        if (!answer.getAuthorEmail().equals(currentUserEmail)) {
            throw new UnauthorizedAccessException("You are not authorized to delete this answer");
        }
        
        answerRepository.delete(answer);
    }



    // NEW: Method for upvoting an answer
    @Transactional
    public AnswerDTO upvoteAnswer(Long answerId, String userEmail) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found with id: " + answerId));

        // Ensure the upvotedBy list is not null
        if (answer.getUpvotedBy() == null) {
            answer.setUpvotedBy(new java.util.ArrayList<>());
        }

        List<String> upvotedBy = answer.getUpvotedBy();

        // Check if user has already upvoted
        if (!upvotedBy.contains(userEmail)) {
            upvotedBy.add(userEmail);
            answer.setReviews(answer.getReviews() + 1);
            Answer updatedAnswer = answerRepository.save(answer);
             // Map the updated answer, passing the user email
            return mapAnswerToDTO(updatedAnswer, userEmail);
        } else {
             // User already upvoted, return current state without change
             // Or you might throw an exception depending on desired behavior
             return mapAnswerToDTO(answer, userEmail);
        }
    }

    // NEW: Method for removing upvote from an answer
    @Transactional
    public AnswerDTO removeUpvoteAnswer(Long answerId, String userEmail) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found with id: " + answerId));

         // Ensure the upvotedBy list is not null
        if (answer.getUpvotedBy() == null) {
            answer.setUpvotedBy(new java.util.ArrayList<>());
        }

        List<String> upvotedBy = answer.getUpvotedBy();

        // Check if user has upvoted
        if (upvotedBy.contains(userEmail)) {
            upvotedBy.remove(userEmail);
            answer.setReviews(Math.max(0, answer.getReviews() - 1)); // Ensure reviews doesn't go below 0
            Answer updatedAnswer = answerRepository.save(answer);
            // Map the updated answer, passing the user email
            return mapAnswerToDTO(updatedAnswer, userEmail);
        } else {
             // User hasn't upvoted, return current state without change
             return mapAnswerToDTO(answer, userEmail);
        }
    }

    public AnswerDTO getAnswerById(Long id, String userEmail) {
        // Find the answer in your database
        Answer answer = answerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id: " + id));
        
        // Convert to DTO and return - use the same pattern as your other methods
        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setContent(answer.getContent());
        dto.setAuthorEmail(answer.getAuthorEmail());
        dto.setAuthorName(answer.getAuthorName());
        dto.setQuestionId(answer.getQuestion().getId());
        dto.setCreatedAt(answer.getCreatedAt());
        dto.setReviews(answer.getReviews()); // Map vote count instead of getUpvotes().size()
        
        // Check if current user has upvoted (handle null list gracefully)
        dto.setUpvotedByCurrentUser(answer.getUpvotedBy() != null && 
                                   userEmail != null && 
                                   answer.getUpvotedBy().contains(userEmail));
        
        return dto;
    }
    
    public List<AnswerDTO> getAnswersByQuestionIdSortedByUpvotes(Long questionId, String currentUserEmail) {
        List<Answer> answers = answerRepository.findByQuestion_IdOrderByReviewsDesc(questionId);
        return answers.stream()
                .map(answer -> mapAnswerToDTO(answer, currentUserEmail))
                .collect(Collectors.toList());
    }
    
    public List<AnswerDTO> getAnswersByQuestionIdSortedByNewest(Long questionId, String currentUserEmail) {
        List<Answer> answers = answerRepository.findByQuestion_IdOrderByCreatedAtDesc(questionId);
        return answers.stream()
                .map(answer -> mapAnswerToDTO(answer, currentUserEmail))
                .collect(Collectors.toList());
    }


    // Updated mapAnswerToDTO to include vote count and check user upvote status
   // This method needs to be PUBLIC so QuestionService can call it
   public AnswerDTO mapAnswerToDTO(Answer answer, String currentUserEmail) {
    AnswerDTO dto = new AnswerDTO();
    dto.setId(answer.getId());
    dto.setContent(answer.getContent());
    dto.setCreatedAt(answer.getCreatedAt());
    dto.setAuthorEmail(answer.getAuthorEmail());
    dto.setAuthorName(answer.getAuthorName());
    // Assuming Question is loaded or accessible from the Answer entity
    // You might need to ensure the question relationship is fetched or use answer.getQuestionId() if mapped
    dto.setQuestionId(answer.getQuestion().getId());
    dto.setReviews(answer.getReviews()); // Map vote count

    // Check if current user has upvoted (handle null list gracefully)
    dto.setUpvotedByCurrentUser(answer.getUpvotedBy() != null && currentUserEmail != null && answer.getUpvotedBy().contains(currentUserEmail));

    return dto;
}

// This overloaded method can also be public or protected if needed elsewhere,
// but changing the main one to public is essential for QuestionService.
 public AnswerDTO mapAnswerToDTO(Answer answer) {
     return mapAnswerToDTO(answer, null); // Call the main mapper with null user
 }

    // Note: You might need to update QuestionService's mapQuestionToDTO
    // to use the correct mapAnswerToDTO method when mapping the answers list
    // within a question.

    /*
     // Example in QuestionService's mapQuestionToDTO:
     private QuestionDTO mapQuestionToDTO(Question question, String currentUserEmail) {
        // ... other mappings ...

        // Map answers using the AnswerService mapper
        List<AnswerDTO> answerDTOs = question.getAnswers().stream()
                .map(answer -> this.answerService.mapAnswerToDTO(answer, currentUserEmail)) // <--- Use injected AnswerService
                .collect(Collectors.toList());
        dto.setAnswers(answerDTOs);

        // ... rest of mapping ...
        return dto;
     }
     // This would require injecting AnswerService into QuestionService
     // @Autowired private AnswerService answerService;
    */
}