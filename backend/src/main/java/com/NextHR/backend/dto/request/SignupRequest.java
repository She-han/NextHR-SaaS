package com.NextHR.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for organization registration (signup)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    
    // Organization details
    @NotBlank(message = "Organization name is required")
    private String organizationName;
    
    @NotBlank(message = "Employee count is required")
    private String employeeCount; // "1-10", "11-50", "51-200", "201-500", "500+"
    
    @NotBlank(message = "Industry is required")
    private String industry;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    private String city;
    
    // Admin details
    @NotBlank(message = "Admin name is required")
    private String adminName;
    
    @NotBlank(message = "Admin email is required")
    @Email(message = "Invalid email format")
    private String adminEmail;
    
    @NotBlank(message = "Admin phone is required")
    private String adminPhone;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    // Extended modules selection (optional)
    private Boolean modulePerformanceTracking = false;
    private Boolean moduleEmployeeFeedback = false;
    private Boolean moduleHiringManagement = false;
    private Boolean moduleAiFeedbackAnalyze = false;
    private Boolean moduleAiAttritionPrediction = false;
}
