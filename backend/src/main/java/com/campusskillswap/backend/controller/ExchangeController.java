package com.campusskillswap.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusskillswap.backend.entity.Exchange;
import com.campusskillswap.backend.request.ExchangeRequest;
import com.campusskillswap.backend.service.ExchangeService;

@RestController
@RequestMapping("/api/exchanges")
@CrossOrigin
public class ExchangeController {

    private final ExchangeService exchangeService;

    public ExchangeController(ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @PostMapping
    public ResponseEntity<Exchange> sendRequest(
            @RequestBody ExchangeRequest request) {

        // Temporary email for testing
        String email = "test@gmail.com";

        Exchange exchange =
                exchangeService.sendRequest(request, email);

        return ResponseEntity.ok(exchange);
    }

    @GetMapping
    public ResponseEntity<List<Exchange>> getRequests() {

        return ResponseEntity.ok(
                exchangeService.getRequests()
        );
    }
}
