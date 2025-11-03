package com.NextHR.backend.controller;

import com.NextHR.backend.dto.request.UpdateOrganizationRequest;
import com.NextHR.backend.dto.response.ApiResponse;
import com.NextHR.backend.model.AppUser;
import com.NextHR.backend.model.Organization;
import com.NextHR.backend.repository.AppUserRepository;
import com.NextHR.backend.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminController - System Administrator REST API
 * Platform-level operations for ROLE_SYS_ADMIN
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('SYS_ADMIN')")
public class AdminController {
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private AppUserRepository appUserRepository;
    
    /**
     * GET /api/admin/organizations/pending
     * Get pending approval organizations
     */
    @GetMapping("/organizations/pending")
    public ResponseEntity<ApiResponse<List<Organization>>> getPendingOrganizations() {
        try {
            List<Organization> organizations = organizationRepository
                    .findByStatusOrderByCreatedAtDesc(Organization.OrganizationStatus.PENDING_APPROVAL);
            return ResponseEntity.ok(ApiResponse.success(organizations));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * GET /api/admin/organizations
     * Get all organizations
     */
    @GetMapping("/organizations")
    public ResponseEntity<ApiResponse<List<Organization>>> getAllOrganizations(
            @RequestParam(required = false) String status
    ) {
        try {
            List<Organization> organizations;
            if (status != null) {
                organizations = organizationRepository.findByStatus(Organization.OrganizationStatus.valueOf(status));
            } else {
                organizations = organizationRepository.findAll();
            }
            return ResponseEntity.ok(ApiResponse.success(organizations));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * PUT /api/admin/organizations/{id}/approve
     * Approve organization registration - Activates organization and admin user
     */
    @PutMapping("/organizations/{id}/approve")
    @Transactional
    public ResponseEntity<ApiResponse<Organization>> approveOrganization(@PathVariable Long id) {
        try {
            // Find organization
            Organization organization = organizationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            
            // Activate organization
            organization.setStatus(Organization.OrganizationStatus.ACTIVE);
            organization = organizationRepository.save(organization);
            
            // Activate the organization's admin user
            List<AppUser> adminUsers = appUserRepository.findByOrganizationUuidAndRoleContaining(
                    organization.getOrganizationUuid(), "ORG_ADMIN");
            
            for (AppUser admin : adminUsers) {
                admin.setIsActive(true);
                appUserRepository.save(admin);
            }
            
            System.out.println("Organization approved: " + organization.getName() + 
                             " (UUID: " + organization.getOrganizationUuid() + ")");
            
            return ResponseEntity.ok(ApiResponse.success("Organization approved successfully", organization));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * PUT /api/admin/organizations/{id}/reject
     * Reject organization registration
     */
    @PutMapping("/organizations/{id}/reject")
    public ResponseEntity<ApiResponse<String>> rejectOrganization(@PathVariable Long id) {
        try {
            Organization organization = organizationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            
            organization.setStatus(Organization.OrganizationStatus.DELETED);
            organizationRepository.save(organization);
            
            return ResponseEntity.ok(ApiResponse.success("Organization rejected"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * PUT /api/admin/organizations/{id}/status
     * Update organization status
     */
    @PutMapping("/organizations/{id}/status")
    public ResponseEntity<ApiResponse<Organization>> updateOrganizationStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        try {
            Organization organization = organizationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            
            organization.setStatus(Organization.OrganizationStatus.valueOf(status));
            organization = organizationRepository.save(organization);
            
            return ResponseEntity.ok(ApiResponse.success("Status updated successfully", organization));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * PUT /api/admin/organizations/{id}
     * Update organization details
     */
    @PutMapping("/organizations/{id}")
    public ResponseEntity<ApiResponse<Organization>> updateOrganization(
            @PathVariable Long id,
            @RequestBody UpdateOrganizationRequest updateRequest
    ) {
        try {
            Organization organization = organizationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            
            // Update basic fields
            if (updateRequest.getName() != null) {
                organization.setName(updateRequest.getName());
            }
            if (updateRequest.getEmail() != null) {
                organization.setEmail(updateRequest.getEmail());
            }
            if (updateRequest.getPhone() != null) {
                organization.setPhone(updateRequest.getPhone());
            }
            if (updateRequest.getAddress() != null) {
                organization.setAddress(updateRequest.getAddress());
            }
            if (updateRequest.getEmployeeCountRange() != null) {
                organization.setEmployeeCountRange(updateRequest.getEmployeeCountRange());
            }
            
            // Update extended module selections
            if (updateRequest.getModulePerformanceTracking() != null) {
                organization.setModulePerformanceTracking(updateRequest.getModulePerformanceTracking());
            }
            if (updateRequest.getModuleEmployeeFeedback() != null) {
                organization.setModuleEmployeeFeedback(updateRequest.getModuleEmployeeFeedback());
            }
            if (updateRequest.getModuleHiringManagement() != null) {
                organization.setModuleHiringManagement(updateRequest.getModuleHiringManagement());
            }
            if (updateRequest.getModuleAiFeedbackAnalyze() != null) {
                organization.setModuleAiFeedbackAnalyze(updateRequest.getModuleAiFeedbackAnalyze());
            }
            if (updateRequest.getModuleAiAttritionPrediction() != null) {
                organization.setModuleAiAttritionPrediction(updateRequest.getModuleAiAttritionPrediction());
            }
            
            organization = organizationRepository.save(organization);
            
            return ResponseEntity.ok(ApiResponse.success("Organization updated successfully", organization));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/admin/organizations/{id}
     * Delete organization and all associated data
     */
    @DeleteMapping("/organizations/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> deleteOrganization(@PathVariable Long id) {
        try {
            Organization organization = organizationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
            
            // Delete all users from this organization
            List<AppUser> orgUsers = appUserRepository.findByOrganizationUuid(
                    organization.getOrganizationUuid());
            appUserRepository.deleteAll(orgUsers);
            
            // Delete the organization
            organizationRepository.delete(organization);
            
            System.out.println("Organization deleted: " + organization.getName() + 
                             " (UUID: " + organization.getOrganizationUuid() + ")");
            
            return ResponseEntity.ok(ApiResponse.success("Organization deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
