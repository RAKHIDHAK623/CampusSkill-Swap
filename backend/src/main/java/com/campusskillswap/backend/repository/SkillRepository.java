package com.campusskillswap.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.campusskillswap.backend.entity.Skill;


public interface SkillRepository 
extends JpaRepository<Skill,Long>{

}
