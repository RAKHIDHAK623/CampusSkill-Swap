package com.campusskillswap.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusskillswap.backend.entity.User;
import com.campusskillswap.backend.repository.UserRepository;


@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserRepository userRepository;


    public UserController(UserRepository userRepository){
        this.userRepository=userRepository;
    }


    @GetMapping("/profile")
    public User profile(Authentication authentication){

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow();

    }

}
