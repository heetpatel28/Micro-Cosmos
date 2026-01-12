package com.example.auth.controller;

import com.example.auth.dto.AuthResponse;
import com.example.auth.dto.LoginRequest;
import com.example.auth.dto.RegisterRequest;
import com.example.auth.dto.UserDto;
import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;
import com.example.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String token = authService.register(request);
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            
            AuthResponse response = new AuthResponse(
                token,
                "User registered successfully",
                new UserDto(user.getId(), user.getEmail())
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            
            AuthResponse response = new AuthResponse(
                token,
                "Login successful",
                new UserDto(user.getId(), user.getEmail())
            );
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}

