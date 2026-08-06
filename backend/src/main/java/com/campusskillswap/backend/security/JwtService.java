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


    private SecretKey getKey(){

        return Keys.hmacShaKeyFor(
            SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );

    }



    public String generateToken(String email){

        return Jwts.builder()

                .subject(email)

                .issuedAt(new Date())

                .expiration(
                    new Date(
                        System.currentTimeMillis()
                        + 1000 * 60 * 60 * 24
                    )
                )

                .signWith(getKey())

                .compact();

    }



    public String extractEmail(String token){

        return Jwts.parser()

                .verifyWith(getKey())

                .build()

                .parseSignedClaims(token)

                .getPayload()

                .getSubject();

    }

}
