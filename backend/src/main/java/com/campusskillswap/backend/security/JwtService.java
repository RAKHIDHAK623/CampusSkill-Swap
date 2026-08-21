package com.campusskillswap.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "campusskillswapSecretKeyForAuthentication123456789";

    private SecretKey getKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    
    // GENERATE JWT

    public String generateToken(
            String email,
            String role
    ) {

        return Jwts.builder()

                .subject(email)

                // ROLE CLAIM
                .claim("role", role)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                + 1000L * 60 * 60 * 24
                        )
                )

                .signWith(getKey())

                .compact();
    }

    // EXTRACT EMAIL

    public String extractEmail(String token) {

        return Jwts.parser()

                .verifyWith(getKey())

                .build()

                .parseSignedClaims(token)

                .getPayload()

                .getSubject();
    }

    
    // EXTRACT ROLE
    

    public String extractRole(String token) {

        return Jwts.parser()

                .verifyWith(getKey())

                .build()

                .parseSignedClaims(token)

                .getPayload()

                .get("role", String.class);
    }
}
