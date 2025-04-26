package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Post> findAllByOrderByCreatedAtDesc();
}