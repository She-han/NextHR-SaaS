package com.NextHR.backend.repository;

import com.NextHR.backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    
    Optional<AppUser> findByEmail(String email);
    
    Optional<AppUser> findByOrganizationUuidAndEmail(String organizationUuid, String email);
    
    List<AppUser> findByOrganizationUuid(String organizationUuid);
    
    List<AppUser> findByOrganizationUuidAndIsActive(String organizationUuid, Boolean isActive);
    
    @Query("SELECT u FROM AppUser u WHERE u.organizationUuid = :organizationUuid AND u.role LIKE %:role%")
    List<AppUser> findByOrganizationUuidAndRoleContaining(String organizationUuid, String role);
    
    boolean existsByOrganizationUuidAndEmail(String organizationUuid, String email);
    
    long countByOrganizationUuid(String organizationUuid);
}
