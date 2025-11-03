-- ================================================================
-- NextHR Multi-Tenant SaaS Platform - Initial Schema
-- Database: MySQL 8.0+
-- Multi-Tenancy Strategy: Shared Database with Tenant Discriminator
-- ================================================================

-- 1. Organization Table (Tenant Master)
CREATE TABLE IF NOT EXISTS organization (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    business_registration_number VARCHAR(100),
    logo_url VARCHAR(500),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(200),
    plan VARCHAR(50) DEFAULT 'FREE',
    employee_count_range VARCHAR(50) NOT NULL,
    status ENUM('PENDING_APPROVAL', 'ACTIVE', 'DORMANT', 'SUSPENDED', 'DELETED') DEFAULT 'PENDING_APPROVAL',
    
    -- Basic Modules (Always Available)
    module_employee_management BOOLEAN DEFAULT TRUE,
    module_payroll_management BOOLEAN DEFAULT TRUE,
    module_leave_management BOOLEAN DEFAULT TRUE,
    module_attendance_management BOOLEAN DEFAULT TRUE,
    module_report_generation BOOLEAN DEFAULT TRUE,
    module_admin_activity_tracking BOOLEAN DEFAULT TRUE,
    module_notifications BOOLEAN DEFAULT TRUE,
    module_basic_statistics BOOLEAN DEFAULT TRUE,
    
    -- Extended Modules (Selectable)
    module_performance_tracking BOOLEAN DEFAULT FALSE,
    module_employee_feedback BOOLEAN DEFAULT FALSE,
    module_hiring_management BOOLEAN DEFAULT FALSE,
    module_ai_feedback_analyze BOOLEAN DEFAULT FALSE,
    module_ai_attrition_prediction BOOLEAN DEFAULT FALSE,
    
    -- Module Configuration Status
    modules_configured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_org_uuid (organization_uuid),
    INDEX idx_org_status (status),
    INDEX idx_org_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. System User Table (Platform Administrators - No Organization)
CREATE TABLE IF NOT EXISTS system_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    role VARCHAR(50) DEFAULT 'ROLE_SYS_ADMIN',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_system_user_email (email),
    INDEX idx_system_user_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. App User Table (Organization Users)
CREATE TABLE IF NOT EXISTS app_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    email VARCHAR(200) NOT NULL,
    username VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    role VARCHAR(200) NOT NULL COMMENT 'Can be comma-separated: ROLE_ORG_ADMIN,ROLE_HR_STAFF',
    is_active BOOLEAN DEFAULT TRUE,
    must_change_password BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_org_email UNIQUE (organization_uuid, email),
    CONSTRAINT fk_user_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    
    INDEX idx_user_org (organization_uuid),
    INDEX idx_user_email (email),
    INDEX idx_user_active (organization_uuid, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Employee Table (HR Records)
CREATE TABLE IF NOT EXISTS employee (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    app_user_id BIGINT NULL COMMENT 'Linked to app_user if employee has system access',
    employee_code VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(200),
    phone VARCHAR(50),
    date_of_birth DATE,
    date_of_joining DATE,
    date_of_leaving DATE NULL,
    designation VARCHAR(100),
    department VARCHAR(100),
    employment_type VARCHAR(50) COMMENT 'FULL_TIME, PART_TIME, CONTRACT, INTERN',
    salary DECIMAL(12,2),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    tax_id VARCHAR(50),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(50),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_org_employee_code UNIQUE (organization_uuid, employee_code),
    CONSTRAINT fk_employee_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    CONSTRAINT fk_employee_app_user FOREIGN KEY (app_user_id) 
        REFERENCES app_user(id) ON DELETE SET NULL,
    
    INDEX idx_emp_org (organization_uuid),
    INDEX idx_emp_active (organization_uuid, is_active),
    INDEX idx_emp_department (organization_uuid, department),
    INDEX idx_emp_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Leave Type Table
CREATE TABLE IF NOT EXISTS leave_type (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    annual_quota INT DEFAULT 0 COMMENT 'Annual days allowed',
    is_paid BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT TRUE,
    color_code VARCHAR(20) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_org_leave_code UNIQUE (organization_uuid, code),
    CONSTRAINT fk_leave_type_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    
    INDEX idx_leave_type_org (organization_uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Leave Balance Table
CREATE TABLE IF NOT EXISTS leave_balance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    employee_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    year INT NOT NULL,
    allocated_days DECIMAL(5,2) DEFAULT 0,
    used_days DECIMAL(5,2) DEFAULT 0,
    pending_days DECIMAL(5,2) DEFAULT 0,
    remaining_days DECIMAL(5,2) GENERATED ALWAYS AS (allocated_days - used_days - pending_days) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_employee_leave_year UNIQUE (employee_id, leave_type_id, year),
    CONSTRAINT fk_leave_balance_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    CONSTRAINT fk_leave_balance_employee FOREIGN KEY (employee_id) 
        REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_balance_type FOREIGN KEY (leave_type_id) 
        REFERENCES leave_type(id) ON DELETE CASCADE,
    
    INDEX idx_leave_balance_org (organization_uuid),
    INDEX idx_leave_balance_employee (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Leave Request Table
CREATE TABLE IF NOT EXISTS leave_request (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    employee_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING, APPROVED, REJECTED, CANCELLED',
    approved_by BIGINT NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_leave_request_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    CONSTRAINT fk_leave_request_employee FOREIGN KEY (employee_id) 
        REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_request_type FOREIGN KEY (leave_type_id) 
        REFERENCES leave_type(id) ON DELETE RESTRICT,
    CONSTRAINT fk_leave_request_approver FOREIGN KEY (approved_by) 
        REFERENCES app_user(id) ON DELETE SET NULL,
    
    INDEX idx_leave_org_status (organization_uuid, status),
    INDEX idx_leave_employee (employee_id),
    INDEX idx_leave_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Work Schedule Table
CREATE TABLE IF NOT EXISTS work_schedule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration_minutes INT DEFAULT 60,
    late_grace_minutes INT DEFAULT 15,
    working_hours DECIMAL(4,2) GENERATED ALWAYS AS (
        TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 3600.0 - (break_duration_minutes / 60.0)
    ) STORED,
    monday BOOLEAN DEFAULT TRUE,
    tuesday BOOLEAN DEFAULT TRUE,
    wednesday BOOLEAN DEFAULT TRUE,
    thursday BOOLEAN DEFAULT TRUE,
    friday BOOLEAN DEFAULT TRUE,
    saturday BOOLEAN DEFAULT FALSE,
    sunday BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_work_schedule_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    
    INDEX idx_work_schedule_org (organization_uuid),
    INDEX idx_work_schedule_active (organization_uuid, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    employee_id BIGINT NOT NULL,
    work_schedule_id BIGINT NULL,
    attendance_date DATE NOT NULL,
    check_in_time TIMESTAMP NULL,
    check_out_time TIMESTAMP NULL,
    check_in_location JSON NULL,
    check_out_location JSON NULL,
    check_in_method VARCHAR(50) DEFAULT 'WEB' COMMENT 'WEB, MOBILE, QR, BIOMETRIC',
    check_out_method VARCHAR(50) DEFAULT 'WEB',
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    late_minutes INT DEFAULT 0,
    early_leaving_minutes INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PRESENT' COMMENT 'PRESENT, ABSENT, HALF_DAY, ON_LEAVE, HOLIDAY',
    is_approved BOOLEAN DEFAULT TRUE,
    approved_by BIGINT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_daily_attendance UNIQUE (organization_uuid, employee_id, attendance_date),
    CONSTRAINT fk_attendance_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) 
        REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_schedule FOREIGN KEY (work_schedule_id) 
        REFERENCES work_schedule(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_approver FOREIGN KEY (approved_by) 
        REFERENCES app_user(id) ON DELETE SET NULL,
    
    INDEX idx_attendance_org_date (organization_uuid, attendance_date),
    INDEX idx_attendance_employee (employee_id),
    INDEX idx_attendance_status (organization_uuid, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Payroll Table
CREATE TABLE IF NOT EXISTS payroll (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    employee_id BIGINT NOT NULL,
    period_year INT NOT NULL,
    period_month INT NOT NULL,
    basic_salary DECIMAL(12,2) NOT NULL,
    allowances DECIMAL(12,2) DEFAULT 0,
    bonuses DECIMAL(12,2) DEFAULT 0,
    overtime_pay DECIMAL(12,2) DEFAULT 0,
    gross_salary DECIMAL(12,2) GENERATED ALWAYS AS (
        basic_salary + allowances + bonuses + overtime_pay
    ) STORED,
    deductions DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2) GENERATED ALWAYS AS (
        basic_salary + allowances + bonuses + overtime_pay - deductions - tax
    ) STORED,
    payment_status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING, PROCESSED, PAID',
    payment_date DATE NULL,
    payment_method VARCHAR(50) COMMENT 'BANK_TRANSFER, CASH, CHEQUE',
    transaction_reference VARCHAR(100),
    notes TEXT,
    generated_by BIGINT NULL,
    processed_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_payroll_period UNIQUE (organization_uuid, employee_id, period_year, period_month),
    CONSTRAINT fk_payroll_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) 
        REFERENCES employee(id) ON DELETE CASCADE,
    CONSTRAINT fk_payroll_generator FOREIGN KEY (generated_by) 
        REFERENCES app_user(id) ON DELETE SET NULL,
    CONSTRAINT fk_payroll_processor FOREIGN KEY (processed_by) 
        REFERENCES app_user(id) ON DELETE SET NULL,
    
    INDEX idx_payroll_org (organization_uuid),
    INDEX idx_payroll_employee (employee_id),
    INDEX idx_payroll_period (period_year, period_month),
    INDEX idx_payroll_status (organization_uuid, payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Admin Activity Table (Audit Trail)
CREATE TABLE IF NOT EXISTS admin_activity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NULL COMMENT 'NULL for system admin activities',
    actor_user_id BIGINT NOT NULL,
    actor_type VARCHAR(50) NOT NULL COMMENT 'SYSTEM_ADMIN, ORG_ADMIN, HR_STAFF',
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    description TEXT,
    changes JSON COMMENT 'Before/After values',
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_activity_org (organization_uuid),
    INDEX idx_activity_actor (actor_user_id),
    INDEX idx_activity_time (created_at),
    INDEX idx_activity_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Notification Table
CREATE TABLE IF NOT EXISTS notification (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'INFO, SUCCESS, WARNING, ERROR, LEAVE, PAYROLL, ATTENDANCE',
    priority VARCHAR(20) DEFAULT 'NORMAL' COMMENT 'LOW, NORMAL, HIGH, URGENT',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    link VARCHAR(500),
    action_required BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notification_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) 
        REFERENCES app_user(id) ON DELETE CASCADE,
    
    INDEX idx_notif_user_unread (user_id, is_read),
    INDEX idx_notif_org (organization_uuid),
    INDEX idx_notif_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Department Table
CREATE TABLE IF NOT EXISTS department (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    manager_id BIGINT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_org_dept_code UNIQUE (organization_uuid, code),
    CONSTRAINT fk_department_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    CONSTRAINT fk_department_manager FOREIGN KEY (manager_id) 
        REFERENCES employee(id) ON DELETE SET NULL,
    
    INDEX idx_department_org (organization_uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Designation Table
CREATE TABLE IF NOT EXISTS designation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_uuid VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    level INT DEFAULT 1 COMMENT 'Hierarchy level',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_org_desig_code UNIQUE (organization_uuid, code),
    CONSTRAINT fk_designation_organization FOREIGN KEY (organization_uuid) 
        REFERENCES organization(organization_uuid) ON DELETE CASCADE,
    
    INDEX idx_designation_org (organization_uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- End of Schema
