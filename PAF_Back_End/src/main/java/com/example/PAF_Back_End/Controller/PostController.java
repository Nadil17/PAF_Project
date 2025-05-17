package com.example.PAF_Back_End.Controller;

import com.example.PAF_Back_End.Model.Post;
import com.example.PAF_Back_End.Service.PostService;
import com.example.PAF_Back_End.dto.PostDTO;
import com.example.PAF_Back_End.dto.TopicDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    // Get all posts
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // Get posts for current user
    @GetMapping("/user/posts")
    public ResponseEntity<List<Post>> getCurrentUserPosts(@AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        List<Post> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    // Get post by ID
    @GetMapping("/posts/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<Post> post = postService.getPostById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Post not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Create a new post
    @PostMapping("/user/posts")
    public ResponseEntity<?> createPost(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            String userId = principal.getAttribute("sub");
            String userName = principal.getAttribute("name");

            Post newPost = postService.createPost(userId, userName, description, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(newPost);
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to create post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update a post
    @PutMapping("/user/posts/{id}")
    public ResponseEntity<?> updatePost(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable Long id,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            Optional<Post> existingPost = postService.getPostById(id);

            if (existingPost.isPresent()) {
                String userId = principal.getAttribute("sub");

                // Check if the post belongs to the current user
                if (!existingPost.get().getUserId().equals(userId)) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "You are not authorized to update this post");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }

                Post updatedPost = postService.updatePost(id, description, file);
                return ResponseEntity.ok(updatedPost);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Post not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to update post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Delete a post
    @DeleteMapping("/user/posts/{id}")
    public ResponseEntity<?> deletePost(
            @AuthenticationPrincipal OAuth2User principal,
            @PathVariable Long id) {

        try {
            Optional<Post> existingPost = postService.getPostById(id);

            if (existingPost.isPresent()) {
                String userId = principal.getAttribute("sub");

                // Check if the post belongs to the current user
                if (!existingPost.get().getUserId().equals(userId)) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "You are not authorized to delete this post");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }

                boolean deleted = postService.deletePost(id);

                if (deleted) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Post deleted successfully");
                    return ResponseEntity.ok(response);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to delete post");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Post not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to delete post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Serve files
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                String contentType = determineContentType(fileName);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String determineContentType(String fileName) {
        if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (fileName.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else if (fileName.toLowerCase().endsWith(".mp4")) {
            return "video/mp4";
        } else if (fileName.toLowerCase().endsWith(".webm")) {
            return "video/webm";
        } else if (fileName.toLowerCase().endsWith(".webp")) {
            return "image/webp";
        } else {
            return "application/octet-stream";
        }
    }

    //Get Posts by User Id - Panduka
    @GetMapping("/getPostsByUserIdNew/{userId}")
    public List<PostDTO> getPostsByUserIdNew(@PathVariable String userId){
        return postService.getPostsByUserIdNew(userId);
    }
}