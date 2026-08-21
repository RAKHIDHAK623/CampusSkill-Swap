package com.campusskillswap.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campusskillswap.backend.entity.Skill;
import com.campusskillswap.backend.entity.User;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByUser(User user);
    List<Skill> findByNameContainingIgnoreCase(String name);
}
