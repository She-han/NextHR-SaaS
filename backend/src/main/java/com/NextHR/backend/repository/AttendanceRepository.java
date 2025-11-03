package com.NextHR.backend.repository;

import com.NextHR.backend.model.Attendance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Multi-tenant queries
    Optional<Attendance> findByOrganizationUuidAndEmployeeIdAndAttendanceDate(
            String organizationUuid, Long employeeId, LocalDate date);
    
    List<Attendance> findByOrganizationUuidAndAttendanceDate(String organizationUuid, LocalDate date);
    
    Page<Attendance> findByOrganizationUuidAndEmployeeId(String organizationUuid, Long employeeId, Pageable pageable);
    
    List<Attendance> findByOrganizationUuidAndEmployeeIdAndAttendanceDateBetween(
            String organizationUuid, Long employeeId, LocalDate startDate, LocalDate endDate);
    
    // Statistics
    long countByOrganizationUuidAndAttendanceDateAndStatus(
            String organizationUuid, LocalDate date, Attendance.AttendanceStatus status);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.organizationUuid = :organizationUuid AND " +
           "a.attendanceDate = :date AND a.lateMinutes > 0")
    long countLateCheckInsOnDate(String organizationUuid, LocalDate date);
    
    @Query("SELECT AVG(CASE WHEN a.status = 'PRESENT' THEN 1.0 ELSE 0.0 END) FROM Attendance a " +
           "WHERE a.organizationUuid = :organizationUuid AND a.attendanceDate BETWEEN :startDate AND :endDate")
    Double calculateAverageAttendanceRate(String organizationUuid, LocalDate startDate, LocalDate endDate);
}
