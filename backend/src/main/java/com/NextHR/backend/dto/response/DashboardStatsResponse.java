package com.NextHR.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    
    // Employee Statistics
    private Long totalEmployees;
    private Long activeEmployees;
    private Long inactiveEmployees;
    private Long newHiresThisMonth;
    private Long resignationsThisMonth;
    
    // Leave Statistics
    private Long pendingLeaveRequests;
    private Long approvedLeavesToday;
    private Long employeesOnLeaveToday;
    
    // Attendance Statistics
    private Long presentToday;
    private Long absentToday;
    private Long lateCheckInsToday;
    private Double averageAttendanceRate;
    
    // Payroll Statistics
    private Long pendingPayrolls;
    private Long processedPayrollsThisMonth;
    
    // Department Statistics
    private Long totalDepartments;
    
    // Recent Activities
    private Integer recentActivitiesCount;
    
    // Notifications
    private Integer unreadNotifications;
}
