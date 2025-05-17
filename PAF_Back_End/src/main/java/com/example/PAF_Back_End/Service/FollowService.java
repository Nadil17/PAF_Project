package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.Model.Follow;
import com.example.PAF_Back_End.Model.Plan;
import com.example.PAF_Back_End.Repository.FollowRepository;
import com.example.PAF_Back_End.dto.FollowDTO;
import com.example.PAF_Back_End.dto.PlanDTO;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FollowService {
    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private ModelMapper modelMapper;

    //save a user follow one
    public FollowDTO savePlan(FollowDTO followDTO){
        followRepository.save(modelMapper.map(followDTO , Follow.class));
        return followDTO;
    }

    //get already follow users
    public List<FollowDTO> getAlreadyFollowUsers(String userId){
        List<Follow> follow = followRepository.findFollowingbyUserId(userId);
        return follow.stream()
                .map(order -> modelMapper.map(order , FollowDTO.class))
                .collect(Collectors.toList());
    }

    //unfollow a user
    public String unfollowAUser(String userId , String followerId){
        followRepository.unfollowAUser(userId , followerId);
        return "User Unfollowed";
    }
}
