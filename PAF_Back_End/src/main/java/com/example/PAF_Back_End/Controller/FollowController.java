package com.example.PAF_Back_End.Controller;

import com.example.PAF_Back_End.Service.FollowService;
import com.example.PAF_Back_End.Service.PlanService;
import com.example.PAF_Back_End.Service.TopicService;
import com.example.PAF_Back_End.dto.FollowDTO;
import com.example.PAF_Back_End.dto.PlanDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/follow")
public class FollowController {
    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping("/addFollower")
    public FollowDTO addFollower(@RequestBody FollowDTO followDTO){
        return followService.savePlan(followDTO);
    }

    //get already follow users
    @GetMapping("/getAlreadyFollowUsers/{userId}")
    public List<FollowDTO> getAlreadyFollowUsers(@PathVariable String userId){
        return followService.getAlreadyFollowUsers(userId);
    }

    //Unfollow a user
    @DeleteMapping("/unfollow/{userId}/{followerId}")
    public String unfollowUser(@PathVariable String userId , @PathVariable String followerId){
        return followService.unfollowAUser(userId , followerId);
    }
}
