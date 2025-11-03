package com.NextHR.backend.repository;

import com.NextHR.backend.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Multi-tenant queries
    Page<Employee> findByOrganizationUuid(String organizationUuid, Pageable pageable);
    
    Page<Employee> findByOrganizationUuidAndIsActive(String organizationUuid, Boolean isActive, Pageable pageable);
    
    Optional<Employee> findByIdAndOrganizationUuid(Long id, String organizationUuid);
    
    Optional<Employee> findByOrganizationUuidAndEmail(String organizationUuid, String email);
    
    Optional<Employee> findByOrganizationUuidAndEmployeeCode(String organizationUuid, String employeeCode);
    
    List<Employee> findByOrganizationUuidAndDepartment(String organizationUuid, String department);
    
    List<Employee> findByOrganizationUuidAndDesignation(String organizationUuid, String designation);
    
    // Search queries
    @Query("SELECT e FROM Employee e WHERE e.organizationUuid = :organizationUuid AND " +
           "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Employee> searchEmployees(String organizationUuid, String search, Pageable pageable);
    
    // Statistics
    long countByOrganizationUuid(String organizationUuid);
    
    long countByOrganizationUuidAndIsActive(String organizationUuid, Boolean isActive);
    
    long countByOrganizationUuidAndDateOfJoiningBetween(String organizationUuid, LocalDate start, LocalDate end);
    
    long countByOrganizationUuidAndDateOfLeavingBetween(String organizationUuid, LocalDate start, LocalDate end);
    
    boolean existsByOrganizationUuidAndEmail(String organizationUuid, String email);
    
    boolean existsByOrganizationUuidAndEmployeeCode(String organizationUuid, String employeeCode);
}
