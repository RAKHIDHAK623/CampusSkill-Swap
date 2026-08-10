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
public String login(LoginRequest request) {

    System.out.println("=================================");
    System.out.println("LOGIN REQUEST RECEIVED");
    System.out.println("EMAIL: " + request.getEmail());

    User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() -> {

                System.out.println("USER NOT FOUND");
                return new RuntimeException("Email not found");
            });

    System.out.println("USER FOUND: " + user.getEmail());

    boolean passwordMatch =
            passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
            );

    System.out.println(
            "PASSWORD MATCH: " + passwordMatch
    );

    if (!passwordMatch) {

        System.out.println("WRONG PASSWORD");

        throw new RuntimeException(
                "Wrong password"
        );
    }

    String token =
            jwtService.generateToken(
                    user.getEmail()
            );

    System.out.println("JWT GENERATED");
    System.out.println("=================================");

    return token;
}
}
