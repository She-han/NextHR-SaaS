package com.NextHR.backend.repository;

import com.NextHR.backend.model.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    // Multi-tenant queries
    Page<LeaveRequest> findByOrganizationUuid(String organizationUuid, Pageable pageable);
    
    Optional<LeaveRequest> findByIdAndOrganizationUuid(Long id, String organizationUuid);
    
    List<LeaveRequest> findByOrganizationUuidAndEmployeeId(String organizationUuid, Long employeeId);
    
    Page<LeaveRequest> findByOrganizationUuidAndStatus(String organizationUuid, 
                                                        LeaveRequest.LeaveStatus status, 
                                                        Pageable pageable);
    
    List<LeaveRequest> findByOrganizationUuidAndEmployeeIdAndStatus(String organizationUuid, 
                                                                     Long employeeId, 
                                                                     LeaveRequest.LeaveStatus status);
    
    // Leave overlaps check
    @Query("SELECT l FROM LeaveRequest l WHERE l.organizationUuid = :organizationUuid AND " +
           "l.employeeId = :employeeId AND l.status != 'REJECTED' AND l.status != 'CANCELLED' AND " +
           "((l.startDate <= :endDate AND l.endDate >= :startDate))")
    List<LeaveRequest> findOverlappingLeaves(String organizationUuid, Long employeeId, 
                                              LocalDate startDate, LocalDate endDate);
    
    // Statistics
    long countByOrganizationUuidAndStatus(String organizationUuid, LeaveRequest.LeaveStatus status);
    
    @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.organizationUuid = :organizationUuid AND " +
           "l.status = 'APPROVED' AND :date BETWEEN l.startDate AND l.endDate")
    long countEmployeesOnLeaveOnDate(String organizationUuid, LocalDate date);
}
