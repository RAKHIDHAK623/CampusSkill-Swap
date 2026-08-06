package com.campusskillswap.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusskillswap.backend.request.LoginRequest;
import com.campusskillswap.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class LoginController {

    private final AuthService authService;

    public LoginController(AuthService authService){
        this.authService = authService;
    }


    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request){

        return authService.login(request);
    }
}
