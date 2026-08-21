package com.campusskillswap.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.campusskillswap.backend.entity.Exchange;
import com.campusskillswap.backend.entity.Skill;
import com.campusskillswap.backend.entity.User;
import com.campusskillswap.backend.repository.ExchangeRepository;
import com.campusskillswap.backend.repository.SkillRepository;
import com.campusskillswap.backend.repository.UserRepository;
import com.campusskillswap.backend.request.ExchangeRequest;

@Service
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public ExchangeService(
            ExchangeRepository exchangeRepository,
            UserRepository userRepository,
            SkillRepository skillRepository) {

        this.exchangeRepository = exchangeRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    // ==========================================
    // SEND EXCHANGE REQUEST
    // ==========================================

    public Exchange sendRequest(
            ExchangeRequest request,
            String email) {

        User sender = userRepository
                .findByEmail(
                        email.trim().toLowerCase()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sender not found"
                        )
                );

        User receiver = userRepository
                .findById(
                        request.getReceiverId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Receiver not found"
                        )
                );

        Skill skill = skillRepository
                .findById(
                        request.getSkillId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Skill not found"
                        )
                );

        Exchange exchange = new Exchange();

        exchange.setSender(sender);
        exchange.setReceiver(receiver);
        exchange.setSkill(skill);
        exchange.setStatus("PENDING");

        Exchange savedExchange =
                exchangeRepository.save(exchange);

        System.out.println(
                "================================="
        );

        System.out.println(
                "EXCHANGE CREATED"
        );

        System.out.println(
                "Exchange ID: " +
                        savedExchange.getId()
        );

        System.out.println(
                "Sender: " +
                        sender.getEmail()
        );

        System.out.println(
                "Receiver: " +
                        receiver.getEmail()
        );

        System.out.println(
                "Skill: " +
                        skill.getName()
        );

        System.out.println(
                "Status: " +
                        savedExchange.getStatus()
        );

        System.out.println(
                "================================="
        );

        return savedExchange;
    }

    // ==========================================
    // GET MY EXCHANGE REQUESTS
    // ==========================================

    public List<Exchange> getRequests(
            String email) {

        User receiver = userRepository
                .findByEmail(
                        email.trim().toLowerCase()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return exchangeRepository
                .findByReceiver(receiver);
    }

    // ==========================================
    // GET ALL EXCHANGES - ADMIN
    // ==========================================

    public List<Exchange> getAllExchanges() {

        System.out.println(
                "================================="
        );

        System.out.println(
                "ADMIN: GETTING ALL EXCHANGES"
        );

        List<Exchange> exchanges =
                exchangeRepository.findAll();

        System.out.println(
                "TOTAL EXCHANGES: " +
                        exchanges.size()
        );

        System.out.println(
                "================================="
        );

        return exchanges;
    }

    // ==========================================
    // ACCEPT REQUEST
    // ==========================================

    public Exchange acceptRequest(
            Long exchangeId,
            String email) {

        User receiver = userRepository
                .findByEmail(
                        email.trim().toLowerCase()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Exchange not found"
                                )
                        );

        if (!exchange.getReceiver()
                .getId()
                .equals(receiver.getId())) {

            throw new RuntimeException(
                    "You are not allowed to accept this request"
            );
        }

        exchange.setStatus("ACCEPTED");

        return exchangeRepository.save(exchange);
    }

    // ==========================================
    // REJECT REQUEST
    // ==========================================

    public Exchange rejectRequest(
            Long exchangeId,
            String email) {

        User receiver = userRepository
                .findByEmail(
                        email.trim().toLowerCase()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        Exchange exchange =
                exchangeRepository
                        .findById(exchangeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Exchange not found"
                                )
                        );

        if (!exchange.getReceiver()
                .getId()
                .equals(receiver.getId())) {

            throw new RuntimeException(
                    "You are not allowed to reject this request"
            );
        }

        exchange.setStatus("REJECTED");

        return exchangeRepository.save(exchange);
    }
}
