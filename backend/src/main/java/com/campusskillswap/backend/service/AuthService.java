package com.campusskillswap.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campusskillswap.backend.entity.User;
import com.campusskillswap.backend.repository.UserRepository;
import com.campusskillswap.backend.request.LoginRequest;
import com.campusskillswap.backend.request.RegisterRequest;
import com.campusskillswap.backend.security.JwtService;


@Service
public class AuthService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService){

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }



    // REGISTER
    public User register(RegisterRequest request){


        if(userRepository.findByEmail(request.getEmail()).isPresent()){

            throw new RuntimeException("Email already exists");

        }


        User user = new User();

        user.setUsername(request.getUsername());

        user.setEmail(request.getEmail());

        user.setPassword(
            passwordEncoder.encode(request.getPassword())
        );


        return userRepository.save(user);

    }



    // LOGIN
    public String login(LoginRequest request){

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new RuntimeException("Email not found")
                );


        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())){

            throw new RuntimeException("Wrong password");

        }


        return jwtService.generateToken(user.getEmail());
    }

}
