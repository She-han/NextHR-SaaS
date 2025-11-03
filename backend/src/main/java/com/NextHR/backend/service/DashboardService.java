package com.NextHR.backend.service;

import com.NextHR.backend.config.TenantContext;
import com.NextHR.backend.dto.response.DashboardStatsResponse;
import com.NextHR.backend.model.Attendance;
import com.NextHR.backend.model.LeaveRequest;
import com.NextHR.backend.model.Payroll;
import com.NextHR.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;

/**
 * DashboardService - Dashboard Statistics Service
 * Provides aggregated statistics for dashboard displays
 */
@Service
public class DashboardService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private PayrollRepository payrollRepository;
    
    /**
     * Get dashboard statistics for organization
     */
    public DashboardStatsResponse getDashboardStats() {
        String orgUuid = TenantContext.getCurrentOrganization();
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.now();
        LocalDate firstDayOfMonth = currentMonth.atDay(1);
        LocalDate lastDayOfMonth = currentMonth.atEndOfMonth();
        
        // Employee Statistics
        Long totalEmployees = employeeRepository.countByOrganizationUuid(orgUuid);
        Long activeEmployees = employeeRepository.countByOrganizationUuidAndIsActive(orgUuid, true);
        Long inactiveEmployees = totalEmployees - activeEmployees;
        Long newHiresThisMonth = employeeRepository.countByOrganizationUuidAndDateOfJoiningBetween(
                orgUuid, firstDayOfMonth, lastDayOfMonth);
        Long resignationsThisMonth = employeeRepository.countByOrganizationUuidAndDateOfLeavingBetween(
                orgUuid, firstDayOfMonth, lastDayOfMonth);
        
        // Leave Statistics
        Long pendingLeaveRequests = leaveRequestRepository.countByOrganizationUuidAndStatus(
                orgUuid, LeaveRequest.LeaveStatus.PENDING);
        Long employeesOnLeaveToday = leaveRequestRepository.countEmployeesOnLeaveOnDate(orgUuid, today);
        
        // Attendance Statistics
        Long presentToday = attendanceRepository.countByOrganizationUuidAndAttendanceDateAndStatus(
                orgUuid, today, Attendance.AttendanceStatus.PRESENT);
        Long absentToday = attendanceRepository.countByOrganizationUuidAndAttendanceDateAndStatus(
                orgUuid, today, Attendance.AttendanceStatus.ABSENT);
        Long lateCheckInsToday = attendanceRepository.countLateCheckInsOnDate(orgUuid, today);
        
        // Calculate average attendance rate for current month
        Double averageAttendanceRate = attendanceRepository.calculateAverageAttendanceRate(
                orgUuid, firstDayOfMonth, today);
        if (averageAttendanceRate == null) {
            averageAttendanceRate = 0.0;
        }
        averageAttendanceRate = averageAttendanceRate * 100; // Convert to percentage
        
        // Payroll Statistics
        Long pendingPayrolls = payrollRepository.countByOrganizationUuidAndPaymentStatus(
                orgUuid, Payroll.PaymentStatus.PENDING);
        Long processedPayrollsThisMonth = payrollRepository.countByOrganizationUuidAndPeriodYearAndPeriodMonth(
                orgUuid, currentMonth.getYear(), currentMonth.getMonthValue());
        
        return DashboardStatsResponse.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .inactiveEmployees(inactiveEmployees)
                .newHiresThisMonth(newHiresThisMonth)
                .resignationsThisMonth(resignationsThisMonth)
                .pendingLeaveRequests(pendingLeaveRequests)
                .approvedLeavesToday(0L) // Can be calculated if needed
                .employeesOnLeaveToday(employeesOnLeaveToday)
                .presentToday(presentToday)
                .absentToday(absentToday)
                .lateCheckInsToday(lateCheckInsToday)
                .averageAttendanceRate(averageAttendanceRate)
                .pendingPayrolls(pendingPayrolls)
                .processedPayrollsThisMonth(processedPayrollsThisMonth)
                .totalDepartments(0L) // Can be added if department repository is available
                .recentActivitiesCount(0) // Can be calculated from admin_activity table
                .unreadNotifications(0) // Can be calculated from notifications table
                .build();
    }
}
