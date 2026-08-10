package com.campusskillswap.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusskillswap.backend.entity.Skill;
import com.campusskillswap.backend.entity.User;

public interface SkillRepository
        extends JpaRepository<Skill, Long> {

    List<Skill> findByUser(User user);
}
