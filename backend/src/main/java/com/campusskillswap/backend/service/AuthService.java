
package com.campusskillswap.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campusskillswap.backend.entity.User;
import com.campusskillswap.backend.repository.UserRepository;
import com.campusskillswap.backend.request.LoginRequest;
import com.campusskillswap.backend.request.RegisterRequest;
import com.campusskillswap.backend.response.LoginResponse;
import com.campusskillswap.backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // REGISTER

    public User register(RegisterRequest request) {

        // VALIDATION

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new RuntimeException("Email is required");
        }

        if (request.getUsername() == null ||
                request.getUsername().isBlank()) {

            throw new RuntimeException("Username is required");
        }

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new RuntimeException("Password is required");
        }

        // NORMALIZE EMAIL

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // CHECK EXISTING USER

        if (userRepository.findByEmail(email).isPresent()) {

            throw new RuntimeException("Email already exists");
        }

        // CREATE USER

        User user = new User();

        user.setUsername(
                request.getUsername().trim()
        );

        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // ROLE
        

        String role = request.getRole();

        if (role == null || role.isBlank()) {

            role = "STUDENT";

        } else {

            role = role.trim().toUpperCase();
        }

        // ALLOWED ROLES

        if (!role.equals("ADMIN") &&
                !role.equals("STUDENT")) {

            role = "STUDENT";
        }

        user.setRole(role);

        // DEBUG

        System.out.println("=================================");
        System.out.println("REGISTER USER: " + user.getEmail());
        System.out.println("REGISTER ROLE: " + user.getRole());
        System.out.println("=================================");

        // SAVE USER

        return userRepository.save(user);
    }

    // LOGIN

    public LoginResponse login(LoginRequest request) {

        System.out.println("=================================");
        System.out.println("LOGIN REQUEST RECEIVED");
        System.out.println("EMAIL: " + request.getEmail());

        // VALIDATION

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new RuntimeException("Password is required");
        }

        // NORMALIZE EMAIL

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // FIND USER

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> {

                    System.out.println("USER NOT FOUND");

                    return new RuntimeException(
                            "Email not found"
                    );
                });

        System.out.println(
                "USER FOUND: " + user.getEmail()
        );

        // PASSWORD CHECK

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

        // GET ROLE

        String role = user.getRole();

        // DEFAULT ROLE

        if (role == null || role.isBlank()) {

            role = "STUDENT";

            user.setRole(role);

            userRepository.save(user);

        } else {

            role = role
                    .trim()
                    .toUpperCase();
        }

        // ROLE SECURITY

        if (!role.equals("ADMIN") &&
                !role.equals("STUDENT")) {

            role = "STUDENT";
        }

        System.out.println(
                "USER ROLE: " + role
        );

        // GET USER ID

        Long userId = user.getId();

        System.out.println(
                "USER ID: " + userId
        );

        
        // GENERATE JWT

        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        role
                );

        System.out.println("JWT GENERATED");

        // FINAL LOGIN DATA

        System.out.println(
                "LOGIN SUCCESS"
        );

        System.out.println(
                "EMAIL: " + user.getEmail()
        );

        System.out.println(
                "ROLE: " + role
        );

        System.out.println(
                "USER ID: " + userId
        );

        System.out.println("=================================");

        // RETURN LOGIN RESPONSE

        return new LoginResponse(
                token,
                role,
                userId,
                user.getEmail()
        );
    }
}

