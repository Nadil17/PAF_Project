package com.example.PAF_Back_End.Controller;

import com.example.PAF_Back_End.Model.Post;
import com.example.PAF_Back_End.Model.User;
import com.example.PAF_Back_End.Service.UserService;
import com.example.PAF_Back_End.dto.PlanDTO;
import com.example.PAF_Back_End.dto.TopicDTO;
import com.example.PAF_Back_End.dto.UserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("name", principal.getAttribute("name"));
        userDetails.put("email", principal.getAttribute("email"));
        userDetails.put("picture", principal.getAttribute("picture"));
        userDetails.put("userId", principal.getAttribute("sub"));  // <-- add this line
        return userDetails;
    }

    @GetMapping("/login/oauth2/success")
    public void loginSuccess(HttpServletResponse response) throws IOException {
        System.out.println("OAuth2 login success! Redirecting to dashboard...");
        response.sendRedirect("http://localhost:3000/dashboard");
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        // Get the authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            // Perform logout
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }

        Map<String, String> result = new HashMap<>();
        result.put("status", "success");
        result.put("message", "Logged out successfully");

        return ResponseEntity.ok(result);
    }

    //get all users - Panduka
    @GetMapping("/getAllUsers")
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsers();
    }

    //add hashtags
    @PutMapping("/addHashtags")
    public UserDTO addHashtags(@RequestBody UserDTO userDTO){
        return userService.addHashtags(userDTO);
    }

    //get hashtags
    @GetMapping("/getHashtags/{id}")
    public UserDTO getHashtags(@PathVariable String id){
        return userService.getHashtags(id);
    }
}