package com.example.auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import io.jsonwebtoken.security.Keys;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret:{{JWT_SECRET}}}")
    private String secret;

    @Bean
    public SecretKey secretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Value("${jwt.expiration:86400000}") // 24 hours
    private long expiration;

    public long getExpiration() {
        return expiration;
    }
}

