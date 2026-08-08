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
UserRepository userRepository){

this.skillRepository=skillRepository;
this.userRepository=userRepository;

}



public Skill addSkill(
SkillRequest request,
String email){


User user=userRepository
.findByEmail(email)
.orElseThrow();


Skill skill=new Skill();

skill.setName(request.getName());
skill.setDescription(request.getDescription());
skill.setCategory(request.getCategory());
skill.setLevel(request.getLevel());

skill.setUser(user);


return skillRepository.save(skill);

}



public List<Skill> getAll(){

return skillRepository.findAll();

}


}
