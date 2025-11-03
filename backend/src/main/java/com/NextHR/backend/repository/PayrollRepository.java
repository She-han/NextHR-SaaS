package com.NextHR.backend.repository;

import com.NextHR.backend.model.Payroll;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    
    // Multi-tenant queries
    Page<Payroll> findByOrganizationUuid(String organizationUuid, Pageable pageable);
    
    Optional<Payroll> findByIdAndOrganizationUuid(Long id, String organizationUuid);
    
    Optional<Payroll> findByOrganizationUuidAndEmployeeIdAndPeriodYearAndPeriodMonth(
            String organizationUuid, Long employeeId, Integer year, Integer month);
    
    List<Payroll> findByOrganizationUuidAndPeriodYearAndPeriodMonth(
            String organizationUuid, Integer year, Integer month);
    
    List<Payroll> findByOrganizationUuidAndEmployeeId(String organizationUuid, Long employeeId);
    
    Page<Payroll> findByOrganizationUuidAndPaymentStatus(String organizationUuid, 
                                                          Payroll.PaymentStatus status, 
                                                          Pageable pageable);
    
    // Statistics
    long countByOrganizationUuidAndPaymentStatus(String organizationUuid, Payroll.PaymentStatus status);
    
    long countByOrganizationUuidAndPeriodYearAndPeriodMonth(
            String organizationUuid, Integer year, Integer month);
    
    boolean existsByOrganizationUuidAndEmployeeIdAndPeriodYearAndPeriodMonth(
            String organizationUuid, Long employeeId, Integer year, Integer month);
}
