package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.Model.Comment;
import com.example.PAF_Back_End.Repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    public List<Comment> getCommentsByUserId(String userId) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    public Comment createComment(Long postId, String userId, String userName, String text, MultipartFile file) throws IOException {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setUserName(userName);
        comment.setText(text);

        if (file != null && !file.isEmpty()) {
            String contentType = fileStorageService.getContentType(file);
            String fileName = fileStorageService.storeFile(file);

            comment.setContentType(contentType);
            comment.setFileName(fileName);
            comment.setFilePath("/api/files/" + fileName);
        }

        return commentRepository.save(comment);
    }

    public Comment updateComment(Long id, String text, MultipartFile file) throws IOException {
        Optional<Comment> existingCommentOpt = commentRepository.findById(id);

        if (existingCommentOpt.isPresent()) {
            Comment existingComment = existingCommentOpt.get();

            if (text != null) {
                existingComment.setText(text);
            }

            if (file != null && !file.isEmpty()) {
                // Delete old file if exists
                if (existingComment.getFileName() != null) {
                    fileStorageService.deleteFile(existingComment.getFileName());
                }

                String contentType = fileStorageService.getContentType(file);
                String fileName = fileStorageService.storeFile(file);

                existingComment.setContentType(contentType);
                existingComment.setFileName(fileName);
                existingComment.setFilePath("/api/files/" + fileName);
            }

            return commentRepository.save(existingComment);
        }

        return null;
    }

    public boolean deleteComment(Long id) throws IOException {
        Optional<Comment> commentOpt = commentRepository.findById(id);

        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();

            // Delete the file if exists
            if (comment.getFileName() != null) {
                fileStorageService.deleteFile(comment.getFileName());
            }

            commentRepository.delete(comment);
            return true;
        }

        return false;
    }
}