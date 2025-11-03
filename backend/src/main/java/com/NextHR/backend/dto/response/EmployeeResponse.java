package com.NextHR.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for employee response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private LocalDate dateOfJoining;
    private LocalDate dateOfLeaving;
    private String designation;
    private String department;
    private String employmentType;
    private BigDecimal salary;
    private String bankAccountNumber;
    private String bankName;
    private String taxId;
    private String address;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String profileImageUrl;
    private Boolean isActive;
    private Boolean hasSystemAccess;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
