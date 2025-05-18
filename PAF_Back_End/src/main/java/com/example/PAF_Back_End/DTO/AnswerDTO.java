// package com.example.PAF_Back_End.DTO;

// import java.time.LocalDateTime;

// public class AnswerDTO {
//     private Long id;
//     private String content;
//     private LocalDateTime createdAt;
//     private String authorEmail;
//     private String authorName;
//     private Long questionId;

//     // Default constructor
//     public AnswerDTO() {
//     }

//     // Getters and Setters
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getContent() {
//         return content;
//     }

//     public void setContent(String content) {
//         this.content = content;
//     }

//     public LocalDateTime getCreatedAt() {
//         return createdAt;
//     }

//     public void setCreatedAt(LocalDateTime createdAt) {
//         this.createdAt = createdAt;
//     }

//     public String getAuthorEmail() {
//         return authorEmail;
//     }

//     public void setAuthorEmail(String authorEmail) {
//         this.authorEmail = authorEmail;
//     }

//     public String getAuthorName() {
//         return authorName;
//     }

//     public void setAuthorName(String authorName) {
//         this.authorName = authorName;
//     }

//     public Long getQuestionId() {
//         return questionId;
//     }

//     public void setQuestionId(Long questionId) {
//         this.questionId = questionId;
//     }
// }

package com.example.PAF_Back_End.DTO;

import java.time.LocalDateTime;
// Assuming you don't need a list of AnswerDTOs inside AnswerDTO itself
// import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AnswerDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private String authorEmail;
    private String authorName;
    private Long questionId;
    private int reviews; // <-- NEW: Vote count for the answer
    private boolean upvotedByCurrentUser; // <-- NEW: Whether the current user upvoted

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public int getReviews() {
        return reviews;
    }

    public void setReviews(int reviews) {
        this.reviews = reviews;
    }

    public boolean isUpvotedByCurrentUser() {
        return upvotedByCurrentUser;
    }

    public void setUpvotedByCurrentUser(boolean upvotedByCurrentUser) {
        this.upvotedByCurrentUser = upvotedByCurrentUser;
    }

    // // Default constructor
    // public AnswerDTO() {
    // }

    // // Getters and Setters
    // public Long getId() {
    //     return id;
    // }

    // public void setId(Long id) {
    //     this.id = id;
    // }

    // public String getContent() {
    //     return content;
    // }

    // public void setContent(String content) {
    //     this.content = content;
    // }

    // public LocalDateTime getCreatedAt() {
    //     return createdAt;
    // }

    // public void setCreatedAt(LocalDateTime createdAt) {
    //     this.createdAt = createdAt;
    // }

    // public String getAuthorEmail() {
    //     return authorEmail;
    // }

    // public void setAuthorEmail(String authorEmail) {
    //     this.authorEmail = authorEmail;
    // }

    // public String getAuthorName() {
    //     return authorName;
    // }

    // public void setAuthorName(String authorName) {
    //     this.authorName = authorName;
    // }

    // public Long getQuestionId() {
    //     return questionId;
    // }

    // public void setQuestionId(Long questionId) {
    //     this.questionId = questionId;
    // }

    // // NEW: Getter for reviews
    // public int getReviews() {
    //     return reviews;
    // }

    // // NEW: Setter for reviews
    // public void setReviews(int reviews) {
    //     this.reviews = reviews;
    // }

    // // NEW: Getter for upvotedByCurrentUser
    // public boolean isUpvotedByCurrentUser() {
    //     return upvotedByCurrentUser;
    // }

    // // NEW: Setter for upvotedByCurrentUser
    // public void setUpvotedByCurrentUser(boolean upvotedByCurrentUser) {
    //     this.upvotedByCurrentUser = upvotedByCurrentUser;
    // }

    // You might also want to override toString(), equals(), hashCode() for good practice
}