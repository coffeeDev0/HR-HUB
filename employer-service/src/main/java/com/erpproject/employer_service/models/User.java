package com.erpproject.employer_service.models;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_prenom", nullable = false)
    private String userPrenom;

    @Column(name = "user_password", nullable = false)
    private String userPassword;

    @Column(name = "role")
    private String role = Roles.EMPLOYER.name();

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "tel")
    private String tel;

    @Column(name = "profession")
    private String profession;
    @Column(name = "status")
    private String status;
}
