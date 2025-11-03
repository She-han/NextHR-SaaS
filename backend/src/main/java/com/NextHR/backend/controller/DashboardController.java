package com.NextHR.backend.controller;

import com.NextHR.backend.dto.response.ApiResponse;
import com.NextHR.backend.dto.response.DashboardStatsResponse;
import com.NextHR.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * DashboardController - Dashboard Statistics REST API
 * Requires: Authentication
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    /**
     * GET /api/dashboard/stats
     * Get dashboard statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ORG_ADMIN', 'HR_STAFF')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        try {
            DashboardStatsResponse stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
