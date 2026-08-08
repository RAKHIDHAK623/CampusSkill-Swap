package com.campusskillswap.backend.controller;


import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
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


public SkillController(SkillService skillService){

this.skillService=skillService;

}



@PostMapping
public Skill addSkill(
@RequestBody SkillRequest request,
Authentication authentication){


return skillService.addSkill(
request,
authentication.getName()
);

}



@GetMapping
public List<Skill> getSkills(){

return skillService.getAll();

}


}
