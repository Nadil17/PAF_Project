// package com.example.PAF_Back_End.Model;

// import com.fasterxml.jackson.annotation.JsonIgnore;
// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "answers")
// public class Answer {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @Column(nullable = false, length = 5000)
//     private String content;
    
//     @Column(nullable = false)
//     private LocalDateTime createdAt;
    
//     @Column(nullable = false)
//     private String authorEmail;
    
//     @Column(nullable = false)
//     private String authorName;
    
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "question_id", nullable = false)
//     @JsonIgnore
//     private Question question;
    
//     // Default constructor for JPA
//     public Answer() {
//         this.createdAt = LocalDateTime.now();
//     }
    
//     // Constructor with fields
//     public Answer(String content, String authorEmail, String authorName, Question question) {
//         this.content = content;
//         this.authorEmail = authorEmail;
//         this.authorName = authorName;
//         this.question = question;
//         this.createdAt = LocalDateTime.now();
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
    
//     public Question getQuestion() {
//         return question;
//     }
    
//     public void setQuestion(Question question) {
//         this.question = question;
//     }
    
//     // Helper method to extract question ID for JSON response
//     public Long getQuestionId() {
//         return question != null ? question.getId() : null;
//     }
// }




// package com.example.PAF_Back_End.Model;

// import com.fasterxml.jackson.annotation.JsonIgnore;
// import jakarta.persistence.*;
// import lombok.Data;

// import java.time.LocalDateTime;
// import java.util.ArrayList; // Import ArrayList
// import java.util.List; // Import List

// @Entity
// @Table(name = "answers")
// @Data
// @NoArgsConstructor // Lombok annotation to generate a no-args constructor
// public class Answer {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false, length = 5000)
//     private String content;

//     @Column(nullable = false)
//     private LocalDateTime createdAt;

//     @Column(nullable = false)
//     private String authorEmail;

//     @Column(nullable = false)
//     private String authorName;

//     // NEW: Field to store the vote count for the answer
//     @Column(nullable = false)
//     private int reviews; // Using 'reviews' to match Question model naming convention

//     // NEW: Field to store the list of user emails who upvoted this answer
//     @ElementCollection // Marks this as a collection of simple types
//     @CollectionTable(name = "answer_upvotes", joinColumns = @JoinColumn(name = "answer_id")) // Defines the join table
//     @Column(name = "user_email") // Defines the column name in the join table for the email
//     private List<String> upvotedBy = new ArrayList<>(); // Initialize to prevent NullPointerException

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "question_id", nullable = false)
//     @JsonIgnore // Prevent infinite recursion in JSON serialization
//     private Question question;

//     // // Default constructor for JPA
//     // public Answer() {
//     //     this.createdAt = LocalDateTime.now();
//     //     this.reviews = 0; // Initialize reviews
//     //     this.upvotedBy = new ArrayList<>(); // Initialize list
//     // }

//     // // Constructor with fields
//     // // Consider adding reviews and upvotedBy initialization here too if used
//     // public Answer(String content, String authorEmail, String authorName, Question question) {
//     //     this.content = content;
//     //     this.authorEmail = authorEmail;
//     //     this.authorName = authorName;
//     //     this.question = question;
//     //     this.createdAt = LocalDateTime.now();
//     //     this.reviews = 0; // Initialize reviews
//     //     this.upvotedBy = new ArrayList<>(); // Initialize list
//     // }

//     // // Getters and Setters

//     // public Long getId() {
//     //     return id;
//     // }

//     // public void setId(Long id) {
//     //     this.id = id;
//     // }

//     // public String getContent() {
//     //     return content;
//     // }

//     // public void setContent(String content) {
//     //     this.content = content;
//     // }

//     // public LocalDateTime getCreatedAt() {
//     //     return createdAt;
//     // }

//     // public void setCreatedAt(LocalDateTime createdAt) {
//     //     this.createdAt = createdAt;
//     // }

//     // public String getAuthorEmail() {
//     //     return authorEmail;
//     // }

//     // public void setAuthorEmail(String authorEmail) {
//     //     this.authorEmail = authorEmail;
//     // }

//     // public String getAuthorName() {
//     //     return authorName;
//     // }

//     // public void setAuthorName(String authorName) {
//     //     this.authorName = authorName;
//     // }

//     // public Question getQuestion() {
//     //     return question;
//     // }

//     // public void setQuestion(Question question) {
//     //     this.question = question;
//     // }

//     // Helper method to extract question ID for JSON response
//     public Long getQuestionId() {
//         return question != null ? question.getId() : null;
//     }

//     // // NEW: Getter for reviews
//     // public int getReviews() {
//     //     return reviews;
//     // }

//     // // NEW: Setter for reviews
//     // public void setReviews(int reviews) {
//     //     this.reviews = reviews;
//     // }

//     // // NEW: Getter for upvotedBy list
//     // public List<String> getUpvotedBy() {
//     //     return upvotedBy;
//     // }

//     // // NEW: Setter for upvotedBy list (useful for JPA)
//     // public void setUpvotedBy(List<String> upvotedBy) {
//     //     this.upvotedBy = upvotedBy;
//     // }

//      // Consider adding convenience methods like addUpvotedBy(String userEmail)
//      // and removeUpvotedBy(String userEmail) if needed directly in the entity.
// }


package com.example.PAF_Back_End.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// --- Lombok Annotations ---
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;
// ------------------------

@Entity
@Table(name = "answers")
@Getter // Generates all getters
@Setter // Generates all setters
// Generates a no-argument constructor (required by JPA)
@ToString(exclude = "question") // Generate toString, excluding the 'question' field to prevent infinite recursion and potential lazy loading issues
@EqualsAndHashCode(exclude = "question") // Generate equals and hashCode, excluding 'question' for safer entity comparisons
public class Answer {
    public Answer() {

    }

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

    public int getReviews() {
        return reviews;
    }

    public void setReviews(int reviews) {
        this.reviews = reviews;
    }

    public List<String> getUpvotedBy() {
        return upvotedBy;
    }

    public void setUpvotedBy(List<String> upvotedBy) {
        this.upvotedBy = upvotedBy;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 5000)
    private String content;

    // Initialize fields directly - Lombok's NoArgsConstructor will use these defaults
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private String authorEmail;

    @Column(nullable = false)
    private String authorName;

    // NEW: Field to store the vote count for the answer
    // Initialize field directly
    @Column(nullable = false)
    private int reviews = 0; // Using 'reviews' to match Question model naming convention

    // NEW: Field to store the list of user emails who upvoted this answer
    // Initialize field directly
    @ElementCollection
    @CollectionTable(name = "answer_upvotes", joinColumns = @JoinColumn(name = "answer_id"))
    @Column(name = "user_email")
    private List<String> upvotedBy = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonIgnore // Prevent infinite recursion in JSON serialization
    private Question question;

    // Keep your specific parameterized constructor if you use it for creating instances
    // This constructor explicitly sets required fields upon creation.
    // Initialized fields (createdAt, reviews, upvotedBy) get their defaults.
    public Answer(String content, String authorEmail, String authorName, Question question) {
        this.content = content;
        this.authorEmail = authorEmail;
        this.authorName = authorName;
        this.question = question;
        // createdAt, reviews, and upvotedBy are initialized by their field defaults
    }

    // Keep this custom getter as Lombok doesn't generate it automatically
    // It's useful for mapping to DTOs or getting the ID without loading the full Question object
    public Long getQuestionId() {
        return question != null ? question.getId() : null;
    }

    // Optional: Add convenience methods for managing the upvotedBy list
    public void addUpvotedBy(String userEmail) {
        if (this.upvotedBy == null) {
            this.upvotedBy = new ArrayList<>();
        }
        if (!this.upvotedBy.contains(userEmail)) { // Prevent duplicates
             this.upvotedBy.add(userEmail);
        }
    }

     public void removeUpvotedBy(String userEmail) {
         if (this.upvotedBy != null) {
              this.upvotedBy.remove(userEmail);
         }
     }
}