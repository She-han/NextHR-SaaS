package com.NextHR.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkSchedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "organization_uuid", nullable = false, length = 36)
    private String organizationUuid;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "break_duration_minutes")
    private Integer breakDurationMinutes = 60;
    
    @Column(name = "late_grace_minutes")
    private Integer lateGraceMinutes = 15;
    
    @Column(name = "monday")
    private Boolean monday = true;
    
    @Column(name = "tuesday")
    private Boolean tuesday = true;
    
    @Column(name = "wednesday")
    private Boolean wednesday = true;
    
    @Column(name = "thursday")
    private Boolean thursday = true;
    
    @Column(name = "friday")
    private Boolean friday = true;
    
    @Column(name = "saturday")
    private Boolean saturday = false;
    
    @Column(name = "sunday")
    private Boolean sunday = false;
    
    @Column(name = "is_default")
    private Boolean isDefault = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
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
}
