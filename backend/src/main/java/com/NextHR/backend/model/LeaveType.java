package com.NextHR.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_type", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"organization_uuid", "code"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "organization_uuid", nullable = false, length = 36)
    private String organizationUuid;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 50)
    private String code;
    
    @Column(name = "annual_quota")
    private Integer annualQuota = 0;
    
    @Column(name = "is_paid")
    private Boolean isPaid = true;
    
    @Column(name = "requires_approval")
    private Boolean requiresApproval = true;
    
    @Column(name = "color_code", length = 20)
    private String colorCode = "#3B82F6";
    
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
