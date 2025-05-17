package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.Post;
import com.example.PAF_Back_End.Model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Post> findAllByOrderByCreatedAtDesc();

    @Query(value = "SELECT * FROM posts WHERE user_id = ?1" , nativeQuery = true)
    List<Post> findPostsByUserId(String userId);
}