package com.NextHR.backend.repository;

import com.NextHR.backend.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    
    Optional<Organization> findByOrganizationUuid(String organizationUuid);
    
    Optional<Organization> findByEmail(String email);
    
    Optional<Organization> findByBusinessRegistrationNumber(String businessRegistrationNumber);
    
    List<Organization> findByStatus(Organization.OrganizationStatus status);
    
    List<Organization> findByStatusOrderByCreatedAtDesc(Organization.OrganizationStatus status);
    
    boolean existsByEmail(String email);
    
    boolean existsByBusinessRegistrationNumber(String businessRegistrationNumber);
    
    long countByStatus(Organization.OrganizationStatus status);
}
