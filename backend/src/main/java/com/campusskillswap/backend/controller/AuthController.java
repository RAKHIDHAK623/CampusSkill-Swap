package com.campusskillswap.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusskillswap.backend.entity.User;
import com.campusskillswap.backend.request.LoginRequest;
import com.campusskillswap.backend.request.RegisterRequest;
import com.campusskillswap.backend.response.LoginResponse;
import com.campusskillswap.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;


    public AuthController(AuthService authService) {

        this.authService = authService;
    }


    @PostMapping("/register")
    public User register(
            @RequestBody RegisterRequest request) {

        System.out.println(
                "Username: " +
                request.getUsername()
        );

        System.out.println(
                "Email: " +
                request.getEmail()
        );

        return authService.register(request);
    }


    @GetMapping("/test")
    public String test() {

        return "Backend Working";
    }


    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}
