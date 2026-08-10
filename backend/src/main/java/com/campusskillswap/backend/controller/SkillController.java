package com.campusskillswap.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusskillswap.backend.entity.Skill;
import com.campusskillswap.backend.request.SkillRequest;
import com.campusskillswap.backend.service.SkillService;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(
            SkillService skillService) {

        this.skillService = skillService;
    }

    // ==========================================
    // ADD SKILL
    // ==========================================

    @PostMapping
    public ResponseEntity<Skill> addSkill(
            @RequestBody SkillRequest request,
            Authentication authentication) {

        String email =
                authentication.getName();

        Skill skill =
                skillService.addSkill(
                        request,
                        email
                );

        return ResponseEntity.ok(skill);
    }

    // ==========================================
    // GET MY SKILLS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Skill>> getSkills(
            Authentication authentication) {

        String email =
                authentication.getName();

        List<Skill> skills =
                skillService.getMySkills(email);

        return ResponseEntity.ok(skills);
    }

    // ==========================================
    // DELETE MY SKILL
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSkill(
            @PathVariable Long id,
            Authentication authentication) {

        String email =
                authentication.getName();

        skillService.deleteSkill(
                id,
                email
        );

        return ResponseEntity.ok(
                "Skill deleted successfully"
        );
    }
}
