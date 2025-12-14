package com.erpproject.employer_service.models;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "employer")
public class Employer extends User {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rh_id")
    private Rh rh;

}
