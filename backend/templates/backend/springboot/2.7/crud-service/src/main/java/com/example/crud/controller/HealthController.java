package com.example.crud.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("service", "{{SERVICE_NAME}}");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("environment", System.getenv().getOrDefault("SPRING_PROFILES_ACTIVE", "development"));
        return ResponseEntity.ok(response);
    }
}

