package com.example.PAF_Back_End.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class QuestionDTO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String authorEmail;
    private String authorName;
    private int reviews;
    private List<AnswerDTO> answers;
    private boolean upvotedByCurrentUser;
    
    // Default constructor
    public QuestionDTO() {
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getAuthorEmail() {
        return authorEmail;
    }
    
    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }
    
    public String getAuthorName() {
        return authorName;
    }
    
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    
    public int getReviews() {
        return reviews;
    }
    
    public void setReviews(int reviews) {
        this.reviews = reviews;
    }
    
    public List<AnswerDTO> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }
    
    public boolean isUpvotedByCurrentUser() {
        return upvotedByCurrentUser;
    }
    
    public void setUpvotedByCurrentUser(boolean upvotedByCurrentUser) {
        this.upvotedByCurrentUser = upvotedByCurrentUser;
    }
}