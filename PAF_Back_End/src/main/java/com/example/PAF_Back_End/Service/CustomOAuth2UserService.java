package com.example.PAF_Back_End.Service;

import com.example.PAF_Back_End.Model.User;
import com.example.PAF_Back_End.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauthUser = super.loadUser(userRequest);

        // Extract info from Google
        Map<String, Object> attributes = oauthUser.getAttributes();
        String id = (String) attributes.get("sub");
        String name = (String) attributes.get("name");
        String email = (String) attributes.get("email");
        String imageUrl = (String) attributes.get("picture");

        // Save to DB if not exists
        if (!userRepository.existsById(id)) {
            User user = new User();
            user.setId(id);
            user.setName(name);
            user.setEmail(email);
            user.setImageUrl(imageUrl);
            userRepository.save(user);
        }

        return oauthUser;
    }
}
