package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.DTO.AnswerDTO;
import com.example.PAF_Back_End.DTO.QuestionDTO;
import com.example.PAF_Back_End.Model.Answer;
import com.example.PAF_Back_End.Model.Question;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DTOMapperService {

    public AnswerDTO mapAnswerToDTO(Answer answer, String currentUserEmail) {
        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setContent(answer.getContent());
        dto.setCreatedAt(answer.getCreatedAt());
        dto.setAuthorEmail(answer.getAuthorEmail());
        dto.setAuthorName(answer.getAuthorName());
        dto.setQuestionId(answer.getQuestion().getId());
        dto.setReviews(answer.getReviews());
        dto.setUpvotedByCurrentUser(answer.getUpvotedBy() != null &&
                currentUserEmail != null &&
                answer.getUpvotedBy().contains(currentUserEmail));
        return dto;
    }

    public QuestionDTO mapQuestionToDTO(Question question, String currentUserEmail) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setContent(question.getContent());
        dto.setCreatedAt(question.getCreatedAt());
        dto.setAuthorEmail(question.getAuthorEmail());
        dto.setAuthorName(question.getAuthorName());
        dto.setReviews(question.getReviews());
        dto.setUpvotedByCurrentUser(question.getUpvotedBy() != null &&
                currentUserEmail != null &&
                question.getUpvotedBy().contains(currentUserEmail));

        List<AnswerDTO> answerDTOs = question.getAnswers().stream()
                .map(answer -> mapAnswerToDTO(answer, currentUserEmail))
                .collect(Collectors.toList());
        dto.setAnswers(answerDTOs);

        return dto;
    }
}