package com.erpproject.conge_service.models;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "employer")
@Data
public class Employer {
    
    @Id
    // @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId ;
    
    @Column(name = "user_name", nullable = false)
    private String userName;
    
    @Column(name = "user_password", nullable = false)
    private String userPassword;

    @Column(name="email")
    private String email;
    
    @Column(name = "role", nullable = false)
    private String role;

    // Relation avec EmployerDemande (OneToMany)
    @OneToMany(mappedBy = "employer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Demande> demandes;

    // Relation avec Rh (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rh_id")
    private Rh rh;
}