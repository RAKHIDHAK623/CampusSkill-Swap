package com.campusskillswap.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusskillswap.backend.entity.Exchange;

public interface ExchangeRepository extends JpaRepository<Exchange, Long> {


}
