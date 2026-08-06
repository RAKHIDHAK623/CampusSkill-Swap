package com.campusskillswap.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusskillswap.backend.entity.User;

public interface UserRepository 
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}
