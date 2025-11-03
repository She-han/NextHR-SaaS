package com.NextHR.backend.controller;

import com.NextHR.backend.dto.request.LoginRequest;
import com.NextHR.backend.dto.request.ModuleSelectionRequest;
import com.NextHR.backend.dto.request.SignupRequest;
import com.NextHR.backend.dto.response.ApiResponse;
import com.NextHR.backend.dto.response.LoginResponse;
import com.NextHR.backend.model.Organization;
import com.NextHR.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - Authentication REST API
 * Endpoints: signup, login, module configuration
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * POST /api/auth/signup
     * Register new organization
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Organization>> signup(@Valid @RequestBody SignupRequest request) {
        try {
            Organization organization = authService.signupOrganization(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Organization registered successfully. Pending approval.", organization));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * POST /api/auth/login
     * Universal login for all user types
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * POST /api/auth/configure-modules
     * Configure modules for organization (first-time setup)
     * Requires: ROLE_ORG_ADMIN
     */
    @PostMapping("/configure-modules")
    @PreAuthorize("hasRole('ORG_ADMIN')")
    public ResponseEntity<ApiResponse<String>> configureModules(@RequestBody ModuleSelectionRequest request) {
        try {
            authService.configureModules(request);
            return ResponseEntity.ok(ApiResponse.success("Modules configured successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * GET /api/auth/me
     * Get current user info
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> getCurrentUser() {
        return ResponseEntity.ok(ApiResponse.success("User info", "Authenticated"));
    }
}
