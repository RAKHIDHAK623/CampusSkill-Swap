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

    // ==========================================
    // ADD SKILL
    // ==========================================

    public Skill addSkill(
            SkillRequest request,
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        Skill skill = new Skill();

        skill.setName(request.getName());
        skill.setDescription(request.getDescription());
        skill.setCategory(request.getCategory());
        skill.setLevel(request.getLevel());

        skill.setUser(user);

        return skillRepository.save(skill);
    }

    // ==========================================
    // GET LOGGED-IN USER SKILLS
    // ==========================================

    public List<Skill> getMySkills(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        return skillRepository.findByUser(user);
    }

    // ==========================================
    // DELETE SKILL
    // ==========================================

    public void deleteSkill(
            Long skillId,
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        Skill skill = skillRepository
                .findById(skillId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Skill not found"
                        )
                );

        // Security check:
        // User can delete only their own skill.

        if (!skill.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot delete this skill"
            );
        }

        skillRepository.delete(skill);
    }
}
