package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.Model.Topic;
import com.example.PAF_Back_End.Model.User;
import com.example.PAF_Back_End.Repository.UserRepository;
import com.example.PAF_Back_End.dto.TopicDTO;
import com.example.PAF_Back_End.dto.UserDTO;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<UserDTO> getAllUsers(){
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(order -> modelMapper.map(order , UserDTO.class))
                .collect(Collectors.toList());
    }

}
