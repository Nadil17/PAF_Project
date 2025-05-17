package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.Follow;
import com.example.PAF_Back_End.Model.Plan;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<Follow , Integer> {

    @Query(value = "SELECT * FROM follow WHERE user_id = ?1" , nativeQuery = true)
    List<Follow> findFollowingbyUserId(String userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Follow f WHERE f.userId = ?1 AND f.followerId = ?2")
    void unfollowAUser(String userId, String followerId);





}
