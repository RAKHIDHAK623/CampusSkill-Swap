package com.campusskillswap.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusskillswap.backend.entity.Exchange;
import com.campusskillswap.backend.request.ExchangeRequest;
import com.campusskillswap.backend.service.ExchangeService;

@RestController
@RequestMapping("/api/exchange")
@CrossOrigin
public class ExchangeController {

    private final ExchangeService exchangeService;

    public ExchangeController(ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    // ==============================
    // SEND EXCHANGE REQUEST
    // ==============================

    @PostMapping
    public ResponseEntity<Exchange> sendRequest(
            @RequestBody ExchangeRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        Exchange exchange =
                exchangeService.sendRequest(request, email);

        return ResponseEntity.ok(exchange);
    }

    // ==============================
    // GET MY EXCHANGE REQUESTS
    // ==============================

    @GetMapping
    public ResponseEntity<List<Exchange>> getRequests(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                exchangeService.getRequests(email)
        );
    }

    // ==============================
    // ACCEPT REQUEST
    // ==============================

    @PutMapping("/{id}/accept")
    public ResponseEntity<Exchange> acceptRequest(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                exchangeService.acceptRequest(id, email)
        );
    }

    // ==============================
    // REJECT REQUEST
    // ==============================

    @PutMapping("/{id}/reject")
    public ResponseEntity<Exchange> rejectRequest(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                exchangeService.rejectRequest(id, email)
        );
    }
}
