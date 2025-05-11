package com.example.PAF_Back_End.Controller;

import com.example.PAF_Back_End.Model.Comment;
import com.example.PAF_Back_End.Model.Post;
import com.example.PAF_Back_End.Service.CommentService;
import com.example.PAF_Back_End.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private PostService postService;

    // Get comments for a specific post
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // Get comments for current user


    // Create a new comment
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<?> createComment(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable Long postId,
            @RequestParam(value = "text", required = false) String text,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            // Verify the post exists
            Optional<Post> post = postService.getPostById(postId);
            if (!post.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Post not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Ensure at least text or file is provided
            if ((text == null || text.trim().isEmpty()) && (file == null || file.isEmpty())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Comment must have text or an image");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            String userId = principal.getAttribute("sub");
            String userName = principal.getAttribute("name");

            Comment newComment = commentService.createComment(postId, userId, userName, text, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(newComment);
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to create comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update a comment
    @PutMapping("/comments/{id}")
    public ResponseEntity<?> updateComment(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable Long id,
            @RequestParam(value = "text", required = false) String text,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            Optional<Comment> existingComment = commentService.getCommentById(id);

            if (existingComment.isPresent()) {
                String userId = principal.getAttribute("sub");

                // Check if the comment belongs to the current user
                if (!existingComment.get().getUserId().equals(userId)) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "You are not authorized to update this comment");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }

                // Ensure at least text or existing file is present
                boolean hasText = text != null && !text.trim().isEmpty();
                boolean hasExistingFile = existingComment.get().getFileName() != null;
                boolean hasNewFile = file != null && !file.isEmpty();

                if (!hasText && !hasExistingFile && !hasNewFile) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Comment must have text or an image");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }

                Comment updatedComment = commentService.updateComment(id, text, file);
                return ResponseEntity.ok(updatedComment);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Comment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to update comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Delete a comment
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable Long id) {

        try {
            Optional<Comment> existingComment = commentService.getCommentById(id);

            if (existingComment.isPresent()) {
                String userId = principal.getAttribute("sub");

                // Check if the comment belongs to the current user
                if (!existingComment.get().getUserId().equals(userId)) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "You are not authorized to delete this comment");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }

                boolean deleted = commentService.deleteComment(id);

                if (deleted) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Comment deleted successfully");
                    return ResponseEntity.ok(response);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to delete comment");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Comment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to delete comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}