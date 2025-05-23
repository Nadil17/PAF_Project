package com.example.PAF_Back_End.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 5000)
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private String authorEmail;
    
    @Column(nullable = false)
    private String authorName;
    
    @Column(nullable = false)
    private int reviews = 0;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "question_upvotes", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "user_email")
    private List<String> upvotedBy = new ArrayList<>();
    
    // Default constructor for JPA
    public Question() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with fields
    public Question(String title, String content, String authorEmail, String authorName) {
        this.title = title;
        this.content = content;
        this.authorEmail = authorEmail;
        this.authorName = authorName;
        this.createdAt = LocalDateTime.now();
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
    
    public List<Answer> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }
    
    public List<String> getUpvotedBy() {
        return upvotedBy;
    }
    
    public void setUpvotedBy(List<String> upvotedBy) {
        this.upvotedBy = upvotedBy;
    }
}