package com.NextHR.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_user", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"organization_uuid", "email"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "organization_uuid", nullable = false, length = 36)
    private String organizationUuid;
    
    @Column(nullable = false, length = 200)
    private String email;
    
    @Column(length = 100)
    private String username;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(name = "full_name", length = 200)
    private String fullName;
    
    @Column(nullable = false, length = 200)
    private String role; // Can be comma-separated: "ROLE_ORG_ADMIN,ROLE_HR_STAFF"
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "must_change_password")
    private Boolean mustChangePassword = false;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
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
