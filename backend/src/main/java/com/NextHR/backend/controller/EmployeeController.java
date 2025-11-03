package com.NextHR.backend.controller;

import com.NextHR.backend.dto.request.EmployeeRequest;
import com.NextHR.backend.dto.response.ApiResponse;
import com.NextHR.backend.dto.response.EmployeeResponse;
import com.NextHR.backend.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * EmployeeController - Employee Management REST API
 * Requires: ROLE_ORG_ADMIN or ROLE_HR_STAFF
 */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;
    
    /**
     * GET /api/employees
     * Get all employees (paginated)
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'HR_STAFF')")
    public ResponseEntity<ApiResponse<Page<EmployeeResponse>>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) String search
    ) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<EmployeeResponse> employees;
            if (search != null && !search.trim().isEmpty()) {
                employees = employeeService.searchEmployees(search, pageable);
            } else {
                employees = employeeService.getAllEmployees(pageable);
            }
            
            return ResponseEntity.ok(ApiResponse.success(employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * GET /api/employees/active
     * Get active employees only
     */
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'HR_STAFF')")
    public ResponseEntity<ApiResponse<Page<EmployeeResponse>>> getActiveEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<EmployeeResponse> employees = employeeService.getActiveEmployees(pageable);
            return ResponseEntity.ok(ApiResponse.success(employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * GET /api/employees/{id}
     * Get employee by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'HR_STAFF', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id) {
        try {
            EmployeeResponse employee = employeeService.getEmployeeById(id);
            return ResponseEntity.ok(ApiResponse.success(employee));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * POST /api/employees
     * Create new employee
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'HR_STAFF')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        try {
            EmployeeResponse employee = employeeService.createEmployee(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Employee created successfully", employee));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * PUT /api/employees/{id}
     * Update employee
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'HR_STAFF')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request
    ) {
        try {
            EmployeeResponse employee = employeeService.updateEmployee(id, request);
            return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", employee));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * DELETE /api/employees/{id}
     * Delete (deactivate) employee
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORG_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(ApiResponse.success("Employee deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
