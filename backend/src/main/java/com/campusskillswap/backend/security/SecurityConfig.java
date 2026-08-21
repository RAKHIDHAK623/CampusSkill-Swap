package com.campusskillswap.backend.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter) {

        this.jwtAuthFilter = jwtAuthFilter;
    }

    // PASSWORD ENCODER

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // CORS

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://127.0.0.1:5500",
                        "http://localhost:5500"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
        );

        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // SECURITY

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // CSRF

            .csrf(csrf -> csrf.disable())

            // CORS

            .cors(cors -> {})

            // SESSION
            

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // AUTHORIZATION
            

            .authorizeHttpRequests(auth -> auth

                // Auth APIs
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // OPTIONS / CORS preflight
                .requestMatchers(
                    org.springframework.http.HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Admin users
                .requestMatchers(
                    "/api/users/**"
                ).hasRole("ADMIN")

                // Skills
                .requestMatchers(
                    "/api/skills/**"
                ).authenticated()

                // Exchange
                .requestMatchers(
                    "/api/exchange/**"
                ).authenticated()

                // Other APIs
                .anyRequest().authenticated()
            )

            // JWT

            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
