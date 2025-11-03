# 📡 API Documentation - NextHR SaaS Platform

Base URL: `http://localhost:8080/api`

## 🔐 Authentication

### Register Organization
**Endpoint**: `POST /api/auth/signup`  
**Access**: Public  
**Description**: Register a new organization

**Request Body**:
```json
{
  "organizationName": "Acme Corporation",
  "businessRegistrationNumber": "BR123456",
  "adminEmail": "admin@acme.com",
  "adminFullName": "John Doe",
  "employeeCountRange": "51-200",
  "phone": "+94 71 234 5678",
  "address": "123 Main St, Colombo",
  "modulePerformanceTracking": true,
  "moduleEmployeeFeedback": false,
  "moduleHiringManagement": true,
  "moduleAiFeedbackAnalyze": false,
  "moduleAiAttritionPrediction": false
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Organization registered successfully. Awaiting admin approval.",
  "data": {
    "organizationUuid": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PENDING_APPROVAL"
  }
}
```

---

### Login
**Endpoint**: `POST /api/auth/login`  
**Access**: Public  
**Description**: Authenticate user (System Admin or Organization User)

**Request Body**:
```json
{
  "email": "admin@acme.com",
  "password": "SecurePassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@acme.com",
      "name": "John Doe",
      "userType": "ORG_USER",
      "roles": ["ROLE_ORG_ADMIN"],
      "organizationUuid": "550e8400-e29b-41d4-a716-446655440000",
      "organizationName": "Acme Corporation"
    },
    "moduleConfig": {
      "employee_management": true,
      "leave_management": true,
      "attendance_tracking": true,
      "payroll_processing": true,
      "performance_tracking": true,
      "hiring_management": true
    }
  }
}
```

**Error Response (401)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Configure Modules
**Endpoint**: `POST /api/auth/configure-modules`  
**Access**: Organization Admin only  
**Auth**: Bearer Token required  
**Description**: Configure optional modules on first login

**Request Body**:
```json
{
  "modulePerformanceTracking": true,
  "moduleEmployeeFeedback": true,
  "moduleHiringManagement": false,
  "moduleAiFeedbackAnalyze": false,
  "moduleAiAttritionPrediction": true
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Modules configured successfully",
  "data": {
    "moduleConfig": {
      "employee_management": true,
      "leave_management": true,
      "performance_tracking": true,
      "employee_feedback": true,
      "ai_attrition_prediction": true
    }
  }
}
```

---

### Get Current User
**Endpoint**: `GET /api/auth/me`  
**Access**: Authenticated users  
**Auth**: Bearer Token required  
**Description**: Get current authenticated user details

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@acme.com",
    "name": "John Doe",
    "userType": "ORG_USER",
    "roles": ["ROLE_ORG_ADMIN"],
    "organizationUuid": "550e8400-e29b-41d4-a716-446655440000",
    "organizationName": "Acme Corporation"
  }
}
```

---

## 👥 Employee Management

### List Employees (Paginated)
**Endpoint**: `GET /api/employees?page=0&size=10&search=john`  
**Access**: ORG_ADMIN, HR_STAFF  
**Auth**: Bearer Token required  
**Description**: Get paginated list of employees with optional search

**Query Parameters**:
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `search` (optional): Search by name, email, or employee code

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "employeeCode": "EMP001",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@acme.com",
        "phone": "+94 77 123 4567",
        "department": "Engineering",
        "designation": "Senior Developer",
        "employmentType": "FULL_TIME",
        "dateOfJoining": "2024-01-15",
        "isActive": true
      }
    ],
    "totalElements": 50,
    "totalPages": 5,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

---

### Get Active Employees
**Endpoint**: `GET /api/employees/active`  
**Access**: ORG_ADMIN, HR_STAFF  
**Auth**: Bearer Token required  
**Description**: Get list of all active employees (unpaginated)

**Success Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employeeCode": "EMP001",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@acme.com",
      "department": "Engineering",
      "designation": "Senior Developer",
      "isActive": true
    }
  ]
}
```

---

### Get Employee Details
**Endpoint**: `GET /api/employees/{id}`  
**Access**: ORG_ADMIN, HR_STAFF  
**Auth**: Bearer Token required  
**Description**: Get detailed information of a specific employee

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@acme.com",
    "phone": "+94 77 123 4567",
    "dateOfBirth": "1990-05-15",
    "gender": "MALE",
    "address": "123 Main St, Colombo",
    "department": "Engineering",
    "designation": "Senior Developer",
    "employmentType": "FULL_TIME",
    "dateOfJoining": "2024-01-15",
    "salary": 150000.00,
    "bankName": "Commercial Bank",
    "bankAccountNumber": "123456789",
    "emergencyContactName": "Jane Smith",
    "emergencyContactPhone": "+94 77 987 6543",
    "isActive": true,
    "hasSystemAccess": true
  }
}
```

---

### Create Employee
**Endpoint**: `POST /api/employees`  
**Access**: ORG_ADMIN, HR_STAFF  
**Auth**: Bearer Token required  
**Description**: Create a new employee

**Request Body**:
```json
{
  "employeeCode": "EMP001",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@acme.com",
  "phone": "+94 77 123 4567",
  "dateOfBirth": "1990-05-15",
  "gender": "MALE",
  "address": "123 Main St, Colombo",
  "department": "Engineering",
  "designation": "Senior Developer",
  "employmentType": "FULL_TIME",
  "dateOfJoining": "2024-01-15",
  "salary": 150000.00,
  "bankName": "Commercial Bank",
  "bankAccountNumber": "123456789",
  "emergencyContactName": "Jane Smith",
  "emergencyContactPhone": "+94 77 987 6543",
  "createSystemAccess": true
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@acme.com",
    "hasSystemAccess": true
  }
}
```

---

### Update Employee
**Endpoint**: `PUT /api/employees/{id}`  
**Access**: ORG_ADMIN, HR_STAFF  
**Auth**: Bearer Token required  
**Description**: Update existing employee

**Request Body**: Same as Create Employee

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": 1,
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Smith"
  }
}
```

---

### Delete Employee (Soft Delete)
**Endpoint**: `DELETE /api/employees/{id}`  
**Access**: ORG_ADMIN only  
**Auth**: Bearer Token required  
**Description**: Soft delete employee (sets isActive to false)

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

---

## 📊 Dashboard

### Get Dashboard Statistics
**Endpoint**: `GET /api/dashboard/stats`  
**Access**: ORG_ADMIN, HR_STAFF  
**Auth**: Bearer Token required  
**Description**: Get organization dashboard statistics

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "totalEmployees": 50,
    "activeEmployees": 48,
    "presentToday": 45,
    "onLeaveToday": 3,
    "pendingLeaveRequests": 5,
    "recentEmployees": [
      {
        "id": 1,
        "name": "John Smith",
        "designation": "Senior Developer",
        "dateOfJoining": "2024-01-15"
      }
    ]
  }
}
```

---

## 🔧 Admin (System Admin Only)

### List All Organizations
**Endpoint**: `GET /api/admin/organizations?page=0&size=10`  
**Access**: SYS_ADMIN only  
**Auth**: Bearer Token required  
**Description**: Get paginated list of all organizations

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "organizationUuid": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Acme Corporation",
        "status": "ACTIVE",
        "employeeCountRange": "51-200",
        "registeredDate": "2024-01-01T10:00:00",
        "activatedDate": "2024-01-02T15:30:00"
      }
    ],
    "totalElements": 25,
    "totalPages": 3,
    "currentPage": 0
  }
}
```

---

### List Pending Organizations
**Endpoint**: `GET /api/admin/organizations/pending`  
**Access**: SYS_ADMIN only  
**Auth**: Bearer Token required  
**Description**: Get list of organizations awaiting approval

**Success Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "organizationUuid": "660e8400-e29b-41d4-a716-446655440000",
      "name": "TechCorp Inc",
      "adminName": "Jane Doe",
      "adminEmail": "admin@techcorp.com",
      "employeeCountRange": "11-50",
      "registeredDate": "2024-01-10T14:25:00",
      "status": "PENDING_APPROVAL"
    }
  ]
}
```

---

### Approve Organization
**Endpoint**: `PUT /api/admin/organizations/{uuid}/approve`  
**Access**: SYS_ADMIN only  
**Auth**: Bearer Token required  
**Description**: Approve pending organization

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Organization approved successfully. Credentials sent to admin email.",
  "data": {
    "organizationUuid": "660e8400-e29b-41d4-a716-446655440000",
    "status": "ACTIVE",
    "adminEmail": "admin@techcorp.com"
  }
}
```

---

### Reject Organization
**Endpoint**: `PUT /api/admin/organizations/{uuid}/reject`  
**Access**: SYS_ADMIN only  
**Auth**: Bearer Token required  
**Description**: Reject pending organization

**Request Body**:
```json
{
  "reason": "Invalid business registration details"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Organization rejected successfully",
  "data": {
    "organizationUuid": "660e8400-e29b-41d4-a716-446655440000",
    "status": "REJECTED"
  }
}
```

---

## 🔒 Authentication & Authorization

### Headers
All authenticated requests must include:
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### JWT Token Structure
```json
{
  "userId": 1,
  "email": "admin@acme.com",
  "org": "550e8400-e29b-41d4-a716-446655440000",
  "roles": ["ROLE_ORG_ADMIN"],
  "userType": "ORG_USER",
  "iat": 1704096000,
  "exp": 1704182400
}
```

### Role-Based Access
- `SYS_ADMIN`: System administrator with full platform access
- `ORG_ADMIN`: Organization administrator with full org access
- `HR_STAFF`: HR staff with employee management access
- `EMPLOYEE`: Regular employee with self-service access

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "firstName": "First name must not be blank"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication failed. Invalid or expired token."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Employee not found with id: 123"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later."
}
```

---

## 🧪 Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sysadmin@nexthr.com",
    "password": "SysAdmin@123"
  }'
```

### Get Employees Example
```bash
curl -X GET "http://localhost:8080/api/employees?page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Employee Example
```bash
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employeeCode": "EMP001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@acme.com",
    "department": "Engineering",
    "designation": "Developer"
  }'
```

---

## 📝 Notes

1. **Multi-Tenancy**: All organization-level APIs automatically filter data by organization UUID from JWT token
2. **Pagination**: Default page size is 10, maximum is 100
3. **Search**: Case-insensitive partial matching on name, email, and employee code
4. **Date Format**: ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
5. **Currency**: All monetary values in LKR (Sri Lankan Rupees)

---

**Last Updated**: January 2025  
**API Version**: 1.0
