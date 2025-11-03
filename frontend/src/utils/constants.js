// API Base URL
export const API_URL = 'http://localhost:8080/api';

// Employee count range options
export const EMPLOYEE_COUNT_RANGES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
];

// Employment types
export const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERN', label: 'Intern' },
];

// User roles
export const USER_ROLES = {
  SYS_ADMIN: 'ROLE_SYS_ADMIN',
  ORG_ADMIN: 'ROLE_ORG_ADMIN',
  HR_STAFF: 'ROLE_HR_STAFF',
  EMPLOYEE: 'ROLE_EMPLOYEE',
};

// Organization status
export const ORG_STATUS = {
  PENDING_APPROVAL: 'Pending Approval',
  ACTIVE: 'Active',
  DORMANT: 'Dormant',
  SUSPENDED: 'Suspended',
  DELETED: 'Deleted',
};

// Leave status
export const LEAVE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

// Attendance status
export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half Day',
  ON_LEAVE: 'On Leave',
  HOLIDAY: 'Holiday',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PROCESSED: 'Processed',
  PAID: 'Paid',
};

// Module names
export const MODULES = {
  EMPLOYEE_MANAGEMENT: 'employeeManagement',
  PAYROLL_MANAGEMENT: 'payrollManagement',
  LEAVE_MANAGEMENT: 'leaveManagement',
  ATTENDANCE_MANAGEMENT: 'attendanceManagement',
  PERFORMANCE_TRACKING: 'performanceTracking',
  EMPLOYEE_FEEDBACK: 'employeeFeedback',
  HIRING_MANAGEMENT: 'hiringManagement',
  AI_FEEDBACK_ANALYZE: 'aiFeedbackAnalyze',
  AI_ATTRITION_PREDICTION: 'aiAttritionPrediction',
};
