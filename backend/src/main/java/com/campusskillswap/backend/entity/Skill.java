package com.campusskillswap.backend.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;


@Entity
@Data
public class Skill {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private String name;


private String description;


private String category;


private String level;


@ManyToOne
private User user;


}
