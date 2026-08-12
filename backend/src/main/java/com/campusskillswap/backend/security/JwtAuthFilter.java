package com.campusskillswap.backend.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        System.out.println("======================================");
        System.out.println(
                "REQUEST: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        System.out.println(
                "AUTH HEADER PRESENT: "
                        + (authHeader != null)
        );

        String email = null;

        // ==========================================
        // CHECK JWT
        // ==========================================

        if (authHeader != null
                && authHeader.startsWith("Bearer ")) {

            String token =
                    authHeader.substring(7);

            try {

                email =
                        jwtService.extractEmail(token);

                String role =
                        jwtService.extractRole(token);

                System.out.println(
                        "JWT EMAIL: " + email
                );

                System.out.println(
                        "JWT ROLE: " + role
                );

            } catch (Exception e) {

                System.out.println(
                        "JWT TOKEN ERROR: "
                                + e.getMessage()
                );
            }
        }

        // ==========================================
        // AUTHENTICATE USER
        // ==========================================

        if (email != null
                && SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            try {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );

                System.out.println(
                        "JWT AUTHENTICATION SUCCESS: "
                                + email
                );

                System.out.println(
                        "AUTHORITIES: "
                                + userDetails.getAuthorities()
                );

            } catch (Exception e) {

                System.out.println(
                        "USER AUTHENTICATION FAILED: "
                                + e.getMessage()
                );
            }
        }

        // ==========================================
        // SECURITY CONTEXT
        // ==========================================

        System.out.println(
                "SECURITY CONTEXT AUTH: "
                        + SecurityContextHolder
                                .getContext()
                                .getAuthentication()
        );

        System.out.println(
                "======================================"
        );

        filterChain.doFilter(request, response);
    }
}
