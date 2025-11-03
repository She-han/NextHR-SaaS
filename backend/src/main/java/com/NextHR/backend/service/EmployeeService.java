package com.NextHR.backend.service;

import com.NextHR.backend.config.TenantContext;
import com.NextHR.backend.dto.request.EmployeeRequest;
import com.NextHR.backend.dto.response.EmployeeResponse;
import com.NextHR.backend.model.AppUser;
import com.NextHR.backend.model.Employee;
import com.NextHR.backend.repository.AppUserRepository;
import com.NextHR.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

/**
 * EmployeeService - Employee Management Service
 * Handles CRUD operations for employees with multi-tenant filtering
 */
@Service
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private AppUserRepository appUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Get all employees for current organization (paginated)
     */
    public Page<EmployeeResponse> getAllEmployees(Pageable pageable) {
        String orgUuid = TenantContext.getCurrentOrganization();
        Page<Employee> employees = employeeRepository.findByOrganizationUuid(orgUuid, pageable);
        return employees.map(this::convertToResponse);
    }
    
    /**
     * Get active employees only
     */
    public Page<EmployeeResponse> getActiveEmployees(Pageable pageable) {
        String orgUuid = TenantContext.getCurrentOrganization();
        Page<Employee> employees = employeeRepository.findByOrganizationUuidAndIsActive(orgUuid, true, pageable);
        return employees.map(this::convertToResponse);
    }
    
    /**
     * Search employees
     */
    public Page<EmployeeResponse> searchEmployees(String searchTerm, Pageable pageable) {
        String orgUuid = TenantContext.getCurrentOrganization();
        Page<Employee> employees = employeeRepository.searchEmployees(orgUuid, searchTerm, pageable);
        return employees.map(this::convertToResponse);
    }
    
    /**
     * Get employee by ID
     */
    public EmployeeResponse getEmployeeById(Long id) {
        String orgUuid = TenantContext.getCurrentOrganization();
        Employee employee = employeeRepository.findByIdAndOrganizationUuid(id, orgUuid)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return convertToResponse(employee);
    }
    
    /**
     * Create new employee
     */
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        String orgUuid = TenantContext.getCurrentOrganization();
        
        // Validation
        if (request.getEmail() != null && employeeRepository.existsByOrganizationUuidAndEmail(orgUuid, request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (request.getEmployeeCode() != null && employeeRepository.existsByOrganizationUuidAndEmployeeCode(orgUuid, request.getEmployeeCode())) {
            throw new RuntimeException("Employee code already exists");
        }
        
        // Create employee
        Employee employee = new Employee();
        employee.setOrganizationUuid(orgUuid);
        employee.setEmployeeCode(request.getEmployeeCode() != null ? request.getEmployeeCode() : generateEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setDateOfJoining(request.getDateOfJoining());
        employee.setDesignation(request.getDesignation());
        employee.setDepartment(request.getDepartment());
        employee.setEmploymentType(request.getEmploymentType());
        employee.setSalary(request.getSalary());
        employee.setBankAccountNumber(request.getBankAccountNumber());
        employee.setBankName(request.getBankName());
        employee.setTaxId(request.getTaxId());
        employee.setAddress(request.getAddress());
        employee.setEmergencyContactName(request.getEmergencyContactName());
        employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
        employee.setIsActive(true);
        
        employee = employeeRepository.save(employee);
        
        // Create system access if requested
        if (request.getCreateSystemAccess() && request.getSystemRole() != null) {
            createSystemAccess(employee, request.getSystemRole(), request.getSystemPassword());
        }
        
        return convertToResponse(employee);
    }
    
    /**
     * Update employee
     */
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        String orgUuid = TenantContext.getCurrentOrganization();
        
        Employee employee = employeeRepository.findByIdAndOrganizationUuid(id, orgUuid)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        // Validation
        if (request.getEmail() != null && !request.getEmail().equals(employee.getEmail())) {
            if (employeeRepository.existsByOrganizationUuidAndEmail(orgUuid, request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
        }
        
        // Update fields
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setDateOfJoining(request.getDateOfJoining());
        employee.setDesignation(request.getDesignation());
        employee.setDepartment(request.getDepartment());
        employee.setEmploymentType(request.getEmploymentType());
        employee.setSalary(request.getSalary());
        employee.setBankAccountNumber(request.getBankAccountNumber());
        employee.setBankName(request.getBankName());
        employee.setTaxId(request.getTaxId());
        employee.setAddress(request.getAddress());
        employee.setEmergencyContactName(request.getEmergencyContactName());
        employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
        
        employee = employeeRepository.save(employee);
        return convertToResponse(employee);
    }
    
    /**
     * Soft delete employee
     */
    @Transactional
    public void deleteEmployee(Long id) {
        String orgUuid = TenantContext.getCurrentOrganization();
        
        Employee employee = employeeRepository.findByIdAndOrganizationUuid(id, orgUuid)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        employee.setIsActive(false);
        employee.setDateOfLeaving(LocalDate.now());
        employeeRepository.save(employee);
    }
    
    /**
     * Create system access for employee
     */
    private void createSystemAccess(Employee employee, String role, String password) {
        String orgUuid = TenantContext.getCurrentOrganization();
        
        if (appUserRepository.existsByOrganizationUuidAndEmail(orgUuid, employee.getEmail())) {
            throw new RuntimeException("System access already exists for this email");
        }
        
        AppUser appUser = new AppUser();
        appUser.setOrganizationUuid(orgUuid);
        appUser.setEmail(employee.getEmail());
        appUser.setFullName(employee.getFullName());
        appUser.setUsername(employee.getEmail().split("@")[0]);
        appUser.setPasswordHash(passwordEncoder.encode(password != null ? password : "Welcome@123"));
        appUser.setRole(role);
        appUser.setMustChangePassword(true);
        appUser.setIsActive(true);
        
        appUser = appUserRepository.save(appUser);
        
        // Link to employee
        employee.setAppUserId(appUser.getId());
        employeeRepository.save(employee);
    }
    
    /**
     * Generate employee code
     */
    private String generateEmployeeCode() {
        return "EMP" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    /**
     * Convert entity to response DTO
     */
    private EmployeeResponse convertToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .dateOfBirth(employee.getDateOfBirth())
                .dateOfJoining(employee.getDateOfJoining())
                .dateOfLeaving(employee.getDateOfLeaving())
                .designation(employee.getDesignation())
                .department(employee.getDepartment())
                .employmentType(employee.getEmploymentType())
                .salary(employee.getSalary())
                .bankAccountNumber(employee.getBankAccountNumber())
                .bankName(employee.getBankName())
                .taxId(employee.getTaxId())
                .address(employee.getAddress())
                .emergencyContactName(employee.getEmergencyContactName())
                .emergencyContactPhone(employee.getEmergencyContactPhone())
                .profileImageUrl(employee.getProfileImageUrl())
                .isActive(employee.getIsActive())
                .hasSystemAccess(employee.getAppUserId() != null)
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}
