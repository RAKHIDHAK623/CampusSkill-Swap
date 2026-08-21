package com.campusskillswap.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.campusskillswap.backend.entity.Skill;
import com.campusskillswap.backend.entity.User;
import com.campusskillswap.backend.repository.SkillRepository;
import com.campusskillswap.backend.repository.UserRepository;
import com.campusskillswap.backend.request.SkillRequest;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillService(
            SkillRepository skillRepository,
            UserRepository userRepository) {

        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    // ADD SKILL

    public Skill addSkill(
            SkillRequest request,
            String email) {

        if (request == null) {
            throw new RuntimeException(
                    "Skill request cannot be null"
            );
        }

        if (request.getName() == null ||
                request.getName().isBlank()) {

            throw new RuntimeException(
                    "Skill name is required"
            );
        }

        User user =
                userRepository
                        .findByEmail(
                                email.trim().toLowerCase()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: " + email
                                )
                        );

        Skill skill = new Skill();

        skill.setName(
                request.getName().trim()
        );

        skill.setDescription(
                request.getDescription() == null
                        ? ""
                        : request.getDescription().trim()
        );

        skill.setCategory(
                request.getCategory() == null
                        ? "General"
                        : request.getCategory().trim()
        );

        skill.setLevel(
                request.getLevel() == null
                        ? "BEGINNER"
                        : request.getLevel()
                                .trim()
                                .toUpperCase()
        );

        skill.setUser(user);

        Skill savedSkill =
                skillRepository.save(skill);

        System.out.println(
                "SKILL CREATED: " +
                savedSkill.getId() +
                " - " +
                savedSkill.getName()
        );

        return savedSkill;
    }

    // GET MY SKILLS

    public List<Skill> getMySkills(String email) {

        User user =
                userRepository
                        .findByEmail(
                                email.trim().toLowerCase()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return skillRepository.findByUser(user);
    }

    
    // GET ALL SKILLS

    public List<Skill> getAllSkills() {

        return skillRepository.findAll();
    }

    // DELETE SKILL

    public void deleteSkill(
            Long id,
            String email) {

        User user =
                userRepository
                        .findByEmail(
                                email.trim().toLowerCase()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        Skill skill =
                skillRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skill not found"
                                )
                        );

        if (skill.getUser() == null) {
            throw new RuntimeException(
                    "Skill owner not found"
            );
        }

        if (!skill.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot delete this skill"
            );
        }

        skillRepository.delete(skill);
    }

public List<Skill> searchSkills(String name) {

    if (name == null || name.isBlank()) {
        return skillRepository.findAll();
    }

    return skillRepository
            .findByNameContainingIgnoreCase(
                    name.trim()
            );
}
}
