# Fix Flyway Migration Error

## Problem
Flyway migration failed due to SQL syntax errors in V1__initial_schema.sql (missing spaces between EXISTS and table names).

## Solution Steps

### Option 1: Clean Slate (Recommended for Development)

1. **Drop and recreate the database** (in MySQL):
```sql
DROP DATABASE IF EXISTS nexthr_db;
CREATE DATABASE nexthr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Restart the backend**:
```powershell
cd backend
./mvnw spring-boot:run
```

### Option 2: Repair Flyway (If you want to keep existing data)

1. **Connect to MySQL and run**:
```sql
USE nexthr_db;

-- Check Flyway history
SELECT * FROM flyway_schema_history;

-- Delete failed migration
DELETE FROM flyway_schema_history WHERE success = 0;

-- If V1 migration partially succeeded, drop all tables
DROP TABLE IF EXISTS designation;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS admin_activity;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS work_schedule;
DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS leave_balance;
DROP TABLE IF EXISTS leave_type;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS app_user;
DROP TABLE IF EXISTS system_user;
DROP TABLE IF EXISTS organization;

-- Clear Flyway history
DELETE FROM flyway_schema_history;
```

2. **Restart the backend**:
```powershell
cd backend
./mvnw spring-boot:run
```

## Quick MySQL Commands

### To connect to MySQL:
```powershell
mysql -u root -p
# Enter password: 1234
```

### To execute SQL file:
```powershell
mysql -u root -p nexthr_db < drop_and_recreate.sql
```

## What was fixed:
- `CREATE TABLE IF NOT EXISTSapp_user` → `CREATE TABLE IF NOT EXISTS app_user`
- `CREATE TABLE IF NOT EXISTSleave_balance` → `CREATE TABLE IF NOT EXISTS leave_balance`
- `CREATE TABLE IF NOT EXISTSleave_request` → `CREATE TABLE IF NOT EXISTS leave_request`
- `CREATE TABLE IF NOT EXISTSwork_schedule` → `CREATE TABLE IF NOT EXISTS work_schedule`

## Verify Success
After restart, you should see:
- No Flyway validation errors
- All 14 tables created successfully
- System admin user seeded
- Backend running on http://localhost:8080

## Test Backend:
```powershell
# Test API endpoint
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@nexthr.com","password":"Admin@123"}'
```
