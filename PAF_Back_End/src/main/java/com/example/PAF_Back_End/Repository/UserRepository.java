package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, String> {
    //Put hashtags User by Id
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.hashtags = ?2 where u.id = ?1")
    void saveHashtags(String userId , String hashtags);
}
