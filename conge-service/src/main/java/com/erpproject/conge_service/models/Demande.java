package com.erpproject.conge_service.models;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "demande")
@Data
public class Demande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID demandeId;
    
    @Column(name = "raison", nullable = false)
    private String raison;
    
    @Column(name = "status" )
    private String status= "EN ATTENTE";

    @Column(name = "commentaire")
    private String commentaire;

    @Column(name = "dateDebut", nullable = false)
    private Date dateDebut;
    
    @Column(name = "dateFin", nullable = false)
    private Date dateFin;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

}