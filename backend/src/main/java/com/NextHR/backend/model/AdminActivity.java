package com.NextHR.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_activity")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminActivity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "organization_uuid", length = 36)
    private String organizationUuid; // NULL for system admin activities
    
    @Column(name = "actor_user_id", nullable = false)
    private Long actorUserId;
    
    @Column(name = "actor_type", nullable = false, length = 50)
    private String actorType; // SYSTEM_ADMIN, ORG_ADMIN, HR_STAFF
    
    @Column(nullable = false)
    private String action;
    
    @Column(name = "entity_type", length = 100)
    private String entityType;
    
    @Column(name = "entity_id")
    private Long entityId;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "JSON")
    private String changes; // Before/After values in JSON format
    
    @Column(name = "ip_address", length = 50)
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
