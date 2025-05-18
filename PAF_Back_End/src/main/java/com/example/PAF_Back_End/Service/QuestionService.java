// package com.example.PAF_Back_End.Service;

// import com.example.PAF_Back_End.DTO.AnswerDTO;
// import com.example.PAF_Back_End.DTO.QuestionDTO;
// import com.example.PAF_Back_End.Model.Answer;
// import com.example.PAF_Back_End.Model.Question;
// import com.example.PAF_Back_End.Repository.QuestionRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// // import java.util.ArrayList;
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class QuestionService {
    
//     @Autowired
//     private QuestionRepository questionRepository;
    
//     public List<QuestionDTO> getAllQuestions(String currentUserEmail) {
//         List<Question> questions = questionRepository.findAllByOrderByCreatedAtDesc();
//         return mapQuestionsToDTO(questions, currentUserEmail);
//     }
    
//     public QuestionDTO getQuestionById(Long id, String currentUserEmail) {
//         Question question = questionRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        
//         return mapQuestionToDTO(question, currentUserEmail);
//     }
    
//     @Transactional
//     public QuestionDTO createQuestion(QuestionDTO questionDTO, String authorEmail, String authorName) {
//         Question question = new Question();
//         question.setTitle(questionDTO.getTitle());
//         question.setContent(questionDTO.getContent());
//         question.setAuthorEmail(authorEmail);
//         question.setAuthorName(authorName);
        
//         Question savedQuestion = questionRepository.save(question);
//         return mapQuestionToDTO(savedQuestion, authorEmail);
//     }
    
//     @Transactional
//     public QuestionDTO upvoteQuestion(Long questionId, String userEmail) {
//         Question question = questionRepository.findById(questionId)
//                 .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
        
//         List<String> upvotedBy = question.getUpvotedBy();
        
//         // Check if user has already upvoted
//         if (!upvotedBy.contains(userEmail)) {
//             upvotedBy.add(userEmail);
//             question.setReviews(question.getReviews() + 1);
//             questionRepository.save(question);
//         }
        
//         return mapQuestionToDTO(question, userEmail);
//     }
    
//     @Transactional
//     public QuestionDTO removeUpvote(Long questionId, String userEmail) {
//         Question question = questionRepository.findById(questionId)
//                 .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
        
//         List<String> upvotedBy = question.getUpvotedBy();
        
//         // Check if user has upvoted
//         if (upvotedBy.contains(userEmail)) {
//             upvotedBy.remove(userEmail);
//             question.setReviews(Math.max(0, question.getReviews() - 1)); // Ensure reviews doesn't go below 0
//             questionRepository.save(question);
//         }
        
//         return mapQuestionToDTO(question, userEmail);
//     }
    
//     private List<QuestionDTO> mapQuestionsToDTO(List<Question> questions, String currentUserEmail) {
//         return questions.stream()
//                 .map(q -> mapQuestionToDTO(q, currentUserEmail))
//                 .collect(Collectors.toList());
//     }
    
//     private QuestionDTO mapQuestionToDTO(Question question, String currentUserEmail) {
//         QuestionDTO dto = new QuestionDTO();
//         dto.setId(question.getId());
//         dto.setTitle(question.getTitle());
//         dto.setContent(question.getContent());
//         dto.setCreatedAt(question.getCreatedAt());
//         dto.setAuthorEmail(question.getAuthorEmail());
//         dto.setAuthorName(question.getAuthorName());
//         dto.setReviews(question.getReviews());
        
//         // Check if current user has upvoted this question
//         dto.setUpvotedByCurrentUser(question.getUpvotedBy().contains(currentUserEmail));
        
//         // Map answers
//         List<AnswerDTO> answerDTOs = question.getAnswers().stream()
//                 .map(this::mapAnswerToDTO)
//                 .collect(Collectors.toList());
//         dto.setAnswers(answerDTOs);
        
//         return dto;
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

// package com.example.PAF_Back_End.Service;

// import com.example.PAF_Back_End.DTO.AnswerDTO;
// import com.example.PAF_Back_End.DTO.QuestionDTO;
// import com.example.PAF_Back_End.Model.Answer; // Assuming Answer model exists
// import com.example.PAF_Back_End.Model.Question; // Assuming Question model exists
// import com.example.PAF_Back_End.Repository.QuestionRepository; // Assuming QuestionRepository exists
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.ArrayList; // Make sure ArrayList is imported if used for new list
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class QuestionService {

//     @Autowired
//     private QuestionRepository questionRepository;

//     @Autowired
//     private AnswerService answerService; // <--- NEW: Inject AnswerService

//     public List<QuestionDTO> getAllQuestions(String currentUserEmail) {
//         List<Question> questions = questionRepository.findAllByOrderByCreatedAtDesc();
//         // When mapping questions for the list, we pass the user email
//         return mapQuestionsToDTO(questions, currentUserEmail);
//     }

//     public QuestionDTO getQuestionById(Long id, String currentUserEmail) {
//         Question question = questionRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

//         // When mapping a single question, we pass the user email
//         return mapQuestionToDTO(question, currentUserEmail);
//     }

//     @Transactional
//     public QuestionDTO createQuestion(QuestionDTO questionDTO, String authorEmail, String authorName) {
//         Question question = new Question();
//         question.setTitle(questionDTO.getTitle());
//         question.setContent(questionDTO.getContent());
//         question.setAuthorEmail(authorEmail);
//         question.setAuthorName(authorName);
//         question.setReviews(0); // Initialize reviews for a new question
//         question.setUpvotedBy(new ArrayList<>()); // Initialize the upvotedBy list
//         // Assuming 'answers' list is initialized by default or handled by JPA relationships

//         Question savedQuestion = questionRepository.save(question);
//         // Map the newly created question, assuming the author is the current user
//         return mapQuestionToDTO(savedQuestion, authorEmail);
//     }

//     @Transactional
//     public QuestionDTO upvoteQuestion(Long questionId, String userEmail) {
//         Question question = questionRepository.findById(questionId)
//                 .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

//         // Ensure the upvotedBy list is not null
//          if (question.getUpvotedBy() == null) {
//             question.setUpvotedBy(new ArrayList<>());
//         }

//         List<String> upvotedBy = question.getUpvotedBy();

//         // Check if user has already upvoted
//         if (!upvotedBy.contains(userEmail)) {
//             upvotedBy.add(userEmail);
//             question.setReviews(question.getReviews() + 1);
//             Question updatedQuestion = questionRepository.save(question);
//             // Map the updated question, passing the user email
//             return mapQuestionToDTO(updatedQuestion, userEmail);
//         } else {
//             // User already upvoted, return current state without change
//             // Or you might throw an exception depending on desired behavior
//             return mapQuestionToDTO(question, userEmail);
//         }
//     }

//     @Transactional
//     public QuestionDTO removeUpvote(Long questionId, String userEmail) {
//         Question question = questionRepository.findById(questionId)
//                 .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

//          // Ensure the upvotedBy list is not null
//          if (question.getUpvotedBy() == null) {
//             question.setUpvotedBy(new ArrayList<>());
//         }

//         List<String> upvotedBy = question.getUpvotedBy();

//         // Check if user has upvoted
//         if (upvotedBy.contains(userEmail)) {
//             upvotedBy.remove(userEmail);
//             question.setReviews(Math.max(0, question.getReviews() - 1)); // Ensure reviews doesn't go below 0
//             Question updatedQuestion = questionRepository.save(question);
//             // Map the updated question, passing the user email
//             return mapQuestionToDTO(updatedQuestion, userEmail);
//         } else {
//             // User hasn't upvoted, return current state without change
//             return mapQuestionToDTO(question, userEmail);
//         }
//     }

//     private List<QuestionDTO> mapQuestionsToDTO(List<Question> questions, String currentUserEmail) {
//         return questions.stream()
//                 .map(q -> mapQuestionToDTO(q, currentUserEmail)) // Pass user email to mapper
//                 .collect(Collectors.toList());
//     }

//     // Main mapping method for a single Question entity to QuestionDTO
//     private QuestionDTO mapQuestionToDTO(Question question, String currentUserEmail) {
//         QuestionDTO dto = new QuestionDTO();
//         dto.setId(question.getId());
//         dto.setTitle(question.getTitle());
//         dto.setContent(question.getContent());
//         dto.setCreatedAt(question.getCreatedAt());
//         dto.setAuthorEmail(question.getAuthorEmail());
//         dto.setAuthorName(question.getAuthorName());
//         dto.setReviews(question.getReviews()); // Map question vote count

//         // Check if current user has upvoted this question (handle null list gracefully)
//         dto.setUpvotedByCurrentUser(question.getUpvotedBy() != null && currentUserEmail != null && question.getUpvotedBy().contains(currentUserEmail));

//         // Map answers using the injected AnswerService's mapper
//         // This ensures answer vote counts and user upvote status are included in AnswerDTOs
//         List<AnswerDTO> answerDTOs = question.getAnswers().stream()
//                 .map(answer -> answerService.mapAnswerToDTO(answer, currentUserEmail)) // <--- Use AnswerService mapper
//                 .collect(Collectors.toList());
//         dto.setAnswers(answerDTOs);

//         return dto;
//     }

//      // Note: You might need to update Answer model (entity)
//      // to include fields for reviews and upvotedBy (List<String>)
//      // and ensure it has getters/setters for them.
//      // And ensure JPA annotations are correct for upvotedBy list (@ElementCollection).
// }

package com.example.PAF_Back_End.Service;


import com.example.PAF_Back_End.Exception.ResourceNotFoundException;
import com.example.PAF_Back_End.Exception.UnauthorizedAccessException;
import com.example.PAF_Back_End.Model.Answer; // Assuming Answer model exists
import com.example.PAF_Back_End.Model.Question; // Assuming Question model exists
import com.example.PAF_Back_End.Repository.QuestionRepository; // Assuming QuestionRepository exists
import com.example.PAF_Back_End.dto.AnswerDTO;
import com.example.PAF_Back_End.dto.QuestionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList; // Make sure ArrayList is imported if used for new list
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    @Autowired
private DTOMapperService dtoMapperService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerService answerService; // <--- Correctly injected AnswerService

    public List<QuestionDTO> getAllQuestions(String currentUserEmail) {
        List<Question> questions = questionRepository.findAllByOrderByCreatedAtDesc();
        // When mapping questions for the list, we pass the user email
        return mapQuestionsToDTO(questions, currentUserEmail);
    }

    public QuestionDTO getQuestionById(Long id, String currentUserEmail) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

        // When mapping a single question, we pass the user email
        return mapQuestionToDTO(question, currentUserEmail);
    }

    @Transactional
    public QuestionDTO createQuestion(QuestionDTO questionDTO, String authorEmail, String authorName) {
        Question question = new Question();
        question.setTitle(questionDTO.getTitle());
        question.setContent(questionDTO.getContent());
        question.setAuthorEmail(authorEmail);
        question.setAuthorName(authorName);
        question.setReviews(0); // Initialize reviews for a new question
        question.setUpvotedBy(new ArrayList<>()); // Initialize the upvotedBy list
        // Assuming 'answers' list is initialized by default or handled by JPA relationships

        Question savedQuestion = questionRepository.save(question);
        // Map the newly created question, assuming the author is the current user
        return mapQuestionToDTO(savedQuestion, authorEmail);
    }

    //Method to update a question
    @Transactional
public QuestionDTO updateQuestion(Long questionId, QuestionDTO questionDTO, String currentUserEmail) {
    Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
    
    // Check if the current user is the author
    if (!question.getAuthorEmail().equals(currentUserEmail)) {
        throw new UnauthorizedAccessException("You are not authorized to update this question");
    }
    
    question.setTitle(questionDTO.getTitle());
    question.setContent(questionDTO.getContent());
    Question updatedQuestion = questionRepository.save(question);
    return mapQuestionToDTO(updatedQuestion, currentUserEmail);
}

//Method to delete a question
@Transactional
public void deleteQuestion(Long questionId, String currentUserEmail) {
    Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
    
    // Check if the current user is the author
    if (!question.getAuthorEmail().equals(currentUserEmail)) {
        throw new UnauthorizedAccessException("You are not authorized to delete this question");
    }
    
    questionRepository.delete(question);
}


    @Transactional
    public QuestionDTO upvoteQuestion(Long questionId, String userEmail) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

         // Ensure the upvotedBy list is not null
         if (question.getUpvotedBy() == null) {
             question.setUpvotedBy(new ArrayList<>());
         }

        List<String> upvotedBy = question.getUpvotedBy();

        // Check if user has already upvoted
        if (!upvotedBy.contains(userEmail)) {
            upvotedBy.add(userEmail);
            question.setReviews(question.getReviews() + 1);
            Question updatedQuestion = questionRepository.save(question);
            // Map the updated question, passing the user email
            return mapQuestionToDTO(updatedQuestion, userEmail);
        } else {
            // User already upvoted, return current state without change
            return mapQuestionToDTO(question, userEmail);
        }
    }

    @Transactional
    public QuestionDTO removeUpvote(Long questionId, String userEmail) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

          // Ensure the upvotedBy list is not null
          if (question.getUpvotedBy() == null) {
              question.setUpvotedBy(new ArrayList<>());
          }

        List<String> upvotedBy = question.getUpvotedBy();

        // Check if user has upvoted
        if (upvotedBy.contains(userEmail)) {
            upvotedBy.remove(userEmail);
            question.setReviews(Math.max(0, question.getReviews() - 1)); // Ensure reviews doesn't go below 0
            Question updatedQuestion = questionRepository.save(question);
            // Map the updated question, passing the user email
            return mapQuestionToDTO(updatedQuestion, userEmail);
        } else {
            // User hasn't upvoted, return current state without change
            return mapQuestionToDTO(question, userEmail);
        }
    }

    private List<QuestionDTO> mapQuestionsToDTO(List<Question> questions, String currentUserEmail) {
        return questions.stream()
                .map(q -> mapQuestionToDTO(q, currentUserEmail)) // Pass user email to mapper
                .collect(Collectors.toList());
    }


    public List<QuestionDTO> getAllQuestionsSortedByUpvotes(String currentUserEmail) {
        List<Question> questions = questionRepository.findAllByOrderByReviewsDesc();
        return mapQuestionsToDTO(questions, currentUserEmail);
    }
    
    public List<QuestionDTO> getAllQuestionsSortedByUpvotesAndNewest(String currentUserEmail) {
        List<Question> questions = questionRepository.findAllByOrderByReviewsDescCreatedAtDesc();
        return mapQuestionsToDTO(questions, currentUserEmail);
    }
    
    public List<QuestionDTO> getAllQuestionsSortedByAnswerCount(String currentUserEmail) {
        List<Object[]> questionsWithCounts = questionRepository.findQuestionsOrderByAnswerCountDesc();
        List<Question> questions = questionsWithCounts.stream()
            .map(obj -> (Question) obj[0])
            .collect(Collectors.toList());
        return mapQuestionsToDTO(questions, currentUserEmail);
    }


    // Main mapping method for a single Question entity to QuestionDTO
    private QuestionDTO mapQuestionToDTO(Question question, String currentUserEmail) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setContent(question.getContent());
        dto.setCreatedAt(question.getCreatedAt());
        dto.setAuthorEmail(question.getAuthorEmail());
        dto.setAuthorName(question.getAuthorName());
        dto.setReviews(question.getReviews()); // Map question vote count

        // Check if current user has upvoted this question (handle null list gracefully)
        dto.setUpvotedByCurrentUser(question.getUpvotedBy() != null && currentUserEmail != null && question.getUpvotedBy().contains(currentUserEmail));

        // Map answers using the injected AnswerService's mapper
        // This ensures answer vote counts and user upvote status are included in AnswerDTOs
        List<AnswerDTO> answerDTOs = question.getAnswers().stream()
                 // Using answerService.mapAnswerToDTO which should now be public and accept currentUserEmail
                .map(answer -> answerService.mapAnswerToDTO(answer, currentUserEmail))
                .collect(Collectors.toList());
        dto.setAnswers(answerDTOs);

        return dto;
    }
}