package com.NextHR.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "organization")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Organization {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "organization_uuid", unique = true, nullable = false, length = 36)
    private String organizationUuid;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(name = "business_registration_number", length = 100)
    private String businessRegistrationNumber;
    
    @Column(name = "logo_url", length = 500)
    private String logoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(length = 50)
    private String phone;
    
    @Column(length = 200)
    private String email;
    
    @Column(length = 50)
    private String plan = "FREE";
    
    @Column(name = "employee_count_range", nullable = false, length = 50)
    private String employeeCountRange;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationStatus status = OrganizationStatus.PENDING_APPROVAL;
    
    // Basic Modules (Always Available)
    @Column(name = "module_employee_management")
    private Boolean moduleEmployeeManagement = true;
    
    @Column(name = "module_payroll_management")
    private Boolean modulePayrollManagement = true;
    
    @Column(name = "module_leave_management")
    private Boolean moduleLeaveManagement = true;
    
    @Column(name = "module_attendance_management")
    private Boolean moduleAttendanceManagement = true;
    
    @Column(name = "module_report_generation")
    private Boolean moduleReportGeneration = true;
    
    @Column(name = "module_admin_activity_tracking")
    private Boolean moduleAdminActivityTracking = true;
    
    @Column(name = "module_notifications")
    private Boolean moduleNotifications = true;
    
    @Column(name = "module_basic_statistics")
    private Boolean moduleBasicStatistics = true;
    
    // Extended Modules (Selectable)
    @Column(name = "module_performance_tracking")
    private Boolean modulePerformanceTracking = false;
    
    @Column(name = "module_employee_feedback")
    private Boolean moduleEmployeeFeedback = false;
    
    @Column(name = "module_hiring_management")
    private Boolean moduleHiringManagement = false;
    
    @Column(name = "module_ai_feedback_analyze")
    private Boolean moduleAiFeedbackAnalyze = false;
    
    @Column(name = "module_ai_attrition_prediction")
    private Boolean moduleAiAttritionPrediction = false;
    
    @Column(name = "modules_configured")
    private Boolean modulesConfigured = false;
    
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
    
    public enum OrganizationStatus {
        PENDING_APPROVAL,
        ACTIVE,
        DORMANT,
        SUSPENDED,
        DELETED
    }
}
