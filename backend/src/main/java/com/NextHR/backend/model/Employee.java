package com.NextHR.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"organization_uuid", "employee_code"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "organization_uuid", nullable = false, length = 36)
    private String organizationUuid;
    
    @Column(name = "app_user_id")
    private Long appUserId;
    
    @Column(name = "employee_code", length = 50)
    private String employeeCode;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(length = 200)
    private String email;
    
    @Column(length = 50)
    private String phone;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;
    
    @Column(name = "date_of_leaving")
    private LocalDate dateOfLeaving;
    
    @Column(length = 100)
    private String designation;
    
    @Column(length = 100)
    private String department;
    
    @Column(name = "employment_type", length = 50)
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT, INTERN
    
    @Column(precision = 12, scale = 2)
    private BigDecimal salary;
    
    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;
    
    @Column(name = "bank_name", length = 100)
    private String bankName;
    
    @Column(name = "tax_id", length = 50)
    private String taxId;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;
    
    @Column(name = "emergency_contact_phone", length = 50)
    private String emergencyContactPhone;
    
    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;
    
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
    
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
