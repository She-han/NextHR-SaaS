package com.NextHR.backend.service;

import com.NextHR.backend.config.TenantContext;
import com.NextHR.backend.dto.request.LoginRequest;
import com.NextHR.backend.dto.request.ModuleSelectionRequest;
import com.NextHR.backend.dto.request.SignupRequest;
import com.NextHR.backend.dto.response.LoginResponse;
import com.NextHR.backend.model.AppUser;
import com.NextHR.backend.model.Organization;
import com.NextHR.backend.model.SystemUser;
import com.NextHR.backend.repository.AppUserRepository;
import com.NextHR.backend.repository.OrganizationRepository;
import com.NextHR.backend.repository.SystemUserRepository;
import com.NextHR.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * AuthService - Authentication and Authorization Service
 * Handles: Organization signup, User login, Module configuration
 */
@Service
public class AuthService {
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private SystemUserRepository systemUserRepository;
    
    @Autowired
    private AppUserRepository appUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Register new organization with admin user
     */
    @Transactional
    public Organization signupOrganization(SignupRequest request) {
        System.out.println("=== SIGNUP REQUEST DEBUG ===");
        System.out.println("Organization Name: " + request.getOrganizationName());
        System.out.println("Admin Email: " + request.getAdminEmail());
        System.out.println("Admin Name: " + request.getAdminName());
        System.out.println("Employee Count: " + request.getEmployeeCount());
        System.out.println("Country: " + request.getCountry());
        System.out.println("City: " + request.getCity());
        System.out.println("Industry: " + request.getIndustry());
        System.out.println("Password provided: " + (request.getPassword() != null ? "Yes" : "No"));
        
        try {
            // Validation
            System.out.println("Checking if email exists...");
            if (organizationRepository.existsByEmail(request.getAdminEmail())) {
                throw new RuntimeException("Email already registered");
            }
            System.out.println("Email check passed");
            
            // Create Organization
            System.out.println("Creating organization...");
            Organization organization = new Organization();
        organization.setOrganizationUuid(UUID.randomUUID().toString());
        organization.setName(request.getOrganizationName());
        organization.setBusinessRegistrationNumber(UUID.randomUUID().toString().substring(0, 10).toUpperCase()); // Generate if not provided
        organization.setEmail(request.getAdminEmail());
        organization.setPhone(request.getAdminPhone());
        organization.setAddress(request.getCountry() + (request.getCity() != null ? ", " + request.getCity() : ""));
        organization.setEmployeeCountRange(request.getEmployeeCount());
        organization.setStatus(Organization.OrganizationStatus.PENDING_APPROVAL);
        
        // Set extended modules from request
        organization.setModulePerformanceTracking(request.getModulePerformanceTracking());
        organization.setModuleEmployeeFeedback(request.getModuleEmployeeFeedback());
        organization.setModuleHiringManagement(request.getModuleHiringManagement());
        organization.setModuleAiFeedbackAnalyze(request.getModuleAiFeedbackAnalyze());
        organization.setModuleAiAttritionPrediction(request.getModuleAiAttritionPrediction());
        organization.setModulesConfigured(false); // Will be set to true after first login module selection
        
        System.out.println("Saving organization to database...");
        organization = organizationRepository.save(organization);
        System.out.println("Organization saved with ID: " + organization.getId());
        
        // Create Admin User
        System.out.println("Creating admin user...");
        AppUser adminUser = new AppUser();
        adminUser.setOrganizationUuid(organization.getOrganizationUuid());
        adminUser.setEmail(request.getAdminEmail());
        adminUser.setFullName(request.getAdminName());
        adminUser.setUsername(request.getAdminEmail().split("@")[0]);
        
        // Use the password provided by the user
        adminUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        adminUser.setRole("ROLE_ORG_ADMIN");
        adminUser.setMustChangePassword(false);
        adminUser.setIsActive(false); // Will be activated when organization is approved
        
        System.out.println("Saving admin user...");
        appUserRepository.save(adminUser);
        System.out.println("Admin user saved successfully");
        
        // Log activity (in production)
        System.out.println("Organization registered: " + organization.getName());
        System.out.println("Admin email: " + request.getAdminEmail());
        
        return organization;
        
        } catch (Exception e) {
            System.out.println("ERROR in signup: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Universal login for all user types
     * Handles both System Admin and Organization User authentication
     */
    public LoginResponse login(LoginRequest request) {
        // Log login attempt for debugging
        System.out.println("Login attempt for email: " + request.getEmail());
        
        // Step 1: Check if user is System Admin
        Optional<SystemUser> systemUserOpt = systemUserRepository.findByEmail(request.getEmail());
        if (systemUserOpt.isPresent()) {
            SystemUser sysUser = systemUserOpt.get();
            System.out.println("System user found: " + sysUser.getEmail());
            System.out.println("Is active: " + sysUser.getIsActive());
            System.out.println("Password hash from DB: " + sysUser.getPasswordHash());
            
            // Check if account is active
            if (!sysUser.getIsActive()) {
                throw new RuntimeException("Account is inactive");
            }
            
            // Verify password using BCrypt
            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), sysUser.getPasswordHash());
            System.out.println("Password matches: " + passwordMatches);
            
            if (!passwordMatches) {
                throw new RuntimeException("Invalid credentials");
            }
            
            // Update last login
            sysUser.setLastLogin(LocalDateTime.now());
            systemUserRepository.save(sysUser);
            
            // Generate JWT token for system admin
            String token = jwtUtil.generateSystemAdminToken(sysUser.getId(), sysUser.getEmail(), sysUser.getRole());
            
            return LoginResponse.builder()
                    .token(token)
                    .userId(sysUser.getId())
                    .email(sysUser.getEmail())
                    .fullName(sysUser.getFullName())
                    .roles(sysUser.getRole())
                    .organizationUuid(null)
                    .organizationName("NextHR Platform")
                    .userType("SYSTEM_ADMIN")
                    .mustChangePassword(false)
                    .modulesConfigured(true)
                    .moduleConfig(null)
                    .build();
        }
        
        // Step 2: Check if user is Organization User
        Optional<AppUser> appUserOpt = appUserRepository.findByEmail(request.getEmail());
        if (appUserOpt.isPresent()) {
            AppUser appUser = appUserOpt.get();
            
            if (!appUser.getIsActive()) {
                throw new RuntimeException("Account is inactive. Please contact your administrator.");
            }
            
            if (!passwordEncoder.matches(request.getPassword(), appUser.getPasswordHash())) {
                throw new RuntimeException("Invalid credentials");
            }
            
            // Check organization status
            Organization organization = organizationRepository.findByOrganizationUuid(appUser.getOrganizationUuid())
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            
            if (organization.getStatus() == Organization.OrganizationStatus.PENDING_APPROVAL) {
                throw new RuntimeException("Your organization registration is pending approval");
            }
            
            if (organization.getStatus() != Organization.OrganizationStatus.ACTIVE) {
                throw new RuntimeException("Organization is not active. Status: " + organization.getStatus());
            }
            
            // Update last login
            appUser.setLastLogin(LocalDateTime.now());
            appUserRepository.save(appUser);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(
                    appUser.getId(), 
                    appUser.getEmail(), 
                    organization.getOrganizationUuid(), 
                    appUser.getRole()
            );
            
            // Build module configuration
            Map<String, Boolean> moduleConfig = buildModuleConfig(organization);
            
            return LoginResponse.builder()
                    .token(token)
                    .userId(appUser.getId())
                    .email(appUser.getEmail())
                    .fullName(appUser.getFullName())
                    .roles(appUser.getRole())
                    .organizationUuid(organization.getOrganizationUuid())
                    .organizationName(organization.getName())
                    .userType("ORG_USER")
                    .mustChangePassword(appUser.getMustChangePassword())
                    .modulesConfigured(organization.getModulesConfigured())
                    .moduleConfig(moduleConfig)
                    .build();
        }
        
        // User not found in either system_user or app_user tables
        System.out.println("No user found with email: " + request.getEmail());
        throw new RuntimeException("Invalid credentials");
    }
    
    /**
     * Configure modules for organization (first-time setup)
     */
    @Transactional
    public void configureModules(ModuleSelectionRequest request) {
        String orgUuid = TenantContext.getCurrentOrganization();
        if (orgUuid == null) {
            throw new RuntimeException("Invalid context");
        }
        
        Organization organization = organizationRepository.findByOrganizationUuid(orgUuid)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        // Update module selections
        if (request.getModulePerformanceTracking() != null) {
            organization.setModulePerformanceTracking(request.getModulePerformanceTracking());
        }
        if (request.getModuleEmployeeFeedback() != null) {
            organization.setModuleEmployeeFeedback(request.getModuleEmployeeFeedback());
        }
        if (request.getModuleHiringManagement() != null) {
            organization.setModuleHiringManagement(request.getModuleHiringManagement());
        }
        if (request.getModuleAiFeedbackAnalyze() != null) {
            organization.setModuleAiFeedbackAnalyze(request.getModuleAiFeedbackAnalyze());
        }
        if (request.getModuleAiAttritionPrediction() != null) {
            organization.setModuleAiAttritionPrediction(request.getModuleAiAttritionPrediction());
        }
        
        organization.setModulesConfigured(true);
        organizationRepository.save(organization);
    }
    
    /**
     * Build module configuration map for frontend
     */
    private Map<String, Boolean> buildModuleConfig(Organization org) {
        Map<String, Boolean> config = new HashMap<>();
        
        // Basic modules (always true)
        config.put("employeeManagement", org.getModuleEmployeeManagement());
        config.put("payrollManagement", org.getModulePayrollManagement());
        config.put("leaveManagement", org.getModuleLeaveManagement());
        config.put("attendanceManagement", org.getModuleAttendanceManagement());
        config.put("reportGeneration", org.getModuleReportGeneration());
        config.put("adminActivityTracking", org.getModuleAdminActivityTracking());
        config.put("notifications", org.getModuleNotifications());
        config.put("basicStatistics", org.getModuleBasicStatistics());
        
        // Extended modules
        config.put("performanceTracking", org.getModulePerformanceTracking());
        config.put("employeeFeedback", org.getModuleEmployeeFeedback());
        config.put("hiringManagement", org.getModuleHiringManagement());
        config.put("aiFeedbackAnalyze", org.getModuleAiFeedbackAnalyze());
        config.put("aiAttritionPrediction", org.getModuleAiAttritionPrediction());
        
        return config;
    }
}
