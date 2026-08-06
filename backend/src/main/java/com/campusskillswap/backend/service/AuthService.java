package com.campusskillswap.backend.service;
import org.springframework.stereotype.Service;

import com.campusskillswap.backend.entity.User;
import com.campusskillswap.backend.repository.UserRepository;
import com.campusskillswap.backend.request.RegisterRequest;

@Service
public class AuthService {

    private final UserRepository userRepository;


    public AuthService(UserRepository userRepository){
        this.userRepository = userRepository;
    }


    public User register(RegisterRequest request){

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }
}
