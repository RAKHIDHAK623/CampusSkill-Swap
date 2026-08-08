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

    public Exchange sendRequest(
            ExchangeRequest request,
            String email) {

        User sender = userRepository
                .findByEmail(email)
                .orElseThrow();

        User receiver = userRepository
                .findById(request.getReceiverId())
                .orElseThrow();

        Skill skill = skillRepository
                .findById(request.getSkillId())
                .orElseThrow();

        Exchange exchange = new Exchange();

        exchange.setSender(sender);
        exchange.setReceiver(receiver);
        exchange.setSkill(skill);

        return exchangeRepository.save(exchange);
    }

    public List<Exchange> getRequests(String email) {

        User receiver = userRepository
                .findByEmail(email)
                .orElseThrow();

        return exchangeRepository.findByReceiver(receiver);
    }
}
