package com.NextHR.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for creating/updating employee
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String phone;
    private String employeeCode;
    private LocalDate dateOfBirth;
    
    @NotNull(message = "Date of joining is required")
    private LocalDate dateOfJoining;
    
    private String designation;
    private String department;
    
    @NotBlank(message = "Employment type is required")
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT, INTERN
    
    private BigDecimal salary;
    private String bankAccountNumber;
    private String bankName;
    private String taxId;
    private String address;
    private String emergencyContactName;
    private String emergencyContactPhone;
    
    // For creating system access
    private Boolean createSystemAccess = false;
    private String systemRole; // ROLE_HR_STAFF, ROLE_EMPLOYEE
    private String systemPassword;
}
