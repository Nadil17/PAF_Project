package com.example.PAF_Back_End.Repository;

import com.example.PAF_Back_End.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
