package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.Model.Post;
import com.example.PAF_Back_End.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post createPost(String userId, String userName, String description, MultipartFile file) throws IOException {
        Post post = new Post();
        post.setUserId(userId);
        post.setUserName(userName);
        post.setDescription(description);

        if (file != null && !file.isEmpty()) {
            String contentType = fileStorageService.getContentType(file);
            String fileName = fileStorageService.storeFile(file);

            post.setContentType(contentType);
            post.setFileName(fileName);
            post.setFilePath("/api/files/" + fileName);
        }

        return postRepository.save(post);
    }

    public Post updatePost(Long id, String description, MultipartFile file) throws IOException {
        Optional<Post> existingPostOpt = postRepository.findById(id);

        if (existingPostOpt.isPresent()) {
            Post existingPost = existingPostOpt.get();

            if (description != null) {
                existingPost.setDescription(description);
            }

            if (file != null && !file.isEmpty()) {
                // Delete old file if exists
                if (existingPost.getFileName() != null) {
                    fileStorageService.deleteFile(existingPost.getFileName());
                }

                String contentType = fileStorageService.getContentType(file);
                String fileName = fileStorageService.storeFile(file);

                existingPost.setContentType(contentType);
                existingPost.setFileName(fileName);
                existingPost.setFilePath("/api/files/" + fileName);
            }

            return postRepository.save(existingPost);
        }

        return null;
    }

    public boolean deletePost(Long id) throws IOException {
        Optional<Post> postOpt = postRepository.findById(id);

        if (postOpt.isPresent()) {
            Post post = postOpt.get();

            // Delete the file if exists
            if (post.getFileName() != null) {
                fileStorageService.deleteFile(post.getFileName());
            }

            postRepository.delete(post);
            return true;
        }

        return false;
    }
}