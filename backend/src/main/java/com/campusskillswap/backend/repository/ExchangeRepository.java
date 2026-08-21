package com.campusskillswap.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusskillswap.backend.entity.Exchange;
import com.campusskillswap.backend.entity.User;

@Repository
public interface ExchangeRepository
        extends JpaRepository<Exchange, Long> {

    List<Exchange> findByReceiver(User receiver);
}
