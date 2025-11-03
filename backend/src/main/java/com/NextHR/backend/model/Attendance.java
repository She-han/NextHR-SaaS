package com.NextHR.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"organization_uuid", "employee_id", "attendance_date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "organization_uuid", nullable = false, length = 36)
    private String organizationUuid;
    
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;
    
    @Column(name = "work_schedule_id")
    private Long workScheduleId;
    
    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;
    
    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;
    
    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;
    
    @Column(name = "check_in_location", columnDefinition = "JSON")
    private String checkInLocation;
    
    @Column(name = "check_out_location", columnDefinition = "JSON")
    private String checkOutLocation;
    
    @Column(name = "check_in_method", length = 50)
    private String checkInMethod = "WEB"; // WEB, MOBILE, QR, BIOMETRIC
    
    @Column(name = "check_out_method", length = 50)
    private String checkOutMethod = "WEB";
    
    @Column(name = "total_hours", precision = 4, scale = 2)
    private BigDecimal totalHours;
    
    @Column(name = "overtime_hours", precision = 4, scale = 2)
    private BigDecimal overtimeHours = BigDecimal.ZERO;
    
    @Column(name = "late_minutes")
    private Integer lateMinutes = 0;
    
    @Column(name = "early_leaving_minutes")
    private Integer earlyLeavingMinutes = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AttendanceStatus status = AttendanceStatus.PRESENT;
    
    @Column(name = "is_approved")
    private Boolean isApproved = true;
    
    @Column(name = "approved_by")
    private Long approvedBy;
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum AttendanceStatus {
        PRESENT,
        ABSENT,
        HALF_DAY,
        ON_LEAVE,
        HOLIDAY,
        WEEKEND
    }
}
