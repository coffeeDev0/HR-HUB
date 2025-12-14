package com.erpproject.employer_service.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.erpproject.employer_service.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
}
