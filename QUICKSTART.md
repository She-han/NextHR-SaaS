# 🚀 Quick Start Guide - NextHR SaaS Platform

## Prerequisites Check
- [ ] Java 21+ installed: `java -version`
- [ ] Node.js 18+ installed: `node -v`
- [ ] MySQL 8.0+ running
- [ ] Maven installed: `mvn -version`

## Step-by-Step Setup

### 1️⃣ Database Setup (5 minutes)

Open MySQL command line or workbench:

```sql
CREATE DATABASE nexthr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Note**: Update credentials in `backend/src/main/resources/application.properties` if needed:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 2️⃣ Backend Setup (5 minutes)

```powershell
# Open PowerShell in project root
cd backend

# Build project (this will run Flyway migrations automatically)
mvn clean install -DskipTests

# Start backend server
mvn spring-boot:run
```

✅ **Verify**: Backend should be running on `http://localhost:8080`

Check console for: `Started NextHrBackendApplication`

### 3️⃣ Frontend Setup (5 minutes)

Open a **new PowerShell window**:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ **Verify**: Frontend should be running on `http://localhost:5173`

Browser should automatically open to the login page.

## 🔐 First Login

### System Admin Access
1. Open browser: `http://localhost:5173/login`
2. Enter credentials:
   - **Email**: `sysadmin@nexthr.com`
   - **Password**: `SysAdmin@123`
3. Click "Sign In"

✅ You should see the System Admin Dashboard

### Register a New Organization
1. Click "Register here" on login page
2. Fill in organization details:
   - Organization Name: "Test Company"
   - Employee Count: Select range
   - Industry: "Technology"
   - Country: "Sri Lanka"
   - City: "Colombo"
3. Click "Next"
4. Fill in admin details:
   - Full Name: "John Doe"
   - Email: "admin@testcompany.com"
   - Phone: "+94 71 234 5678"
5. Click "Register"
6. Status: "Pending Approval"

### Approve Organization (System Admin)
1. Login as system admin
2. Navigate to pending organizations
3. Approve "Test Company"
4. Organization receives credentials

## 🧪 Testing the Application

### Test Authentication
- ✅ Login with system admin
- ✅ Logout
- ✅ Register new organization
- ✅ Login with organization admin (after approval)

### Test Dashboard
- ✅ System Admin sees organization stats
- ✅ Org Admin sees employee stats
- ✅ Dashboard loads without errors

### Test API
Open browser console and check:
- ✅ No CORS errors
- ✅ JWT token in localStorage
- ✅ API calls return 200 status

## 📊 Project Status

### ✅ Fully Implemented (Ready to Use)
1. **Backend Infrastructure**
   - Multi-tenant database with 14 tables
   - JWT authentication & authorization
   - Role-based access control
   - Security configuration
   - Flyway migrations

2. **Backend APIs**
   - Authentication (signup, login, configure modules)
   - Employee management (CRUD with pagination)
   - Dashboard statistics
   - Admin organization management

3. **Frontend Foundation**
   - React Router setup
   - Redux state management
   - Axios API integration
   - Login & Signup pages
   - Dashboard views (all 4 roles)
   - Reusable UI components

### 🚧 Next Steps (To Implement)
1. **Employee Management UI**
   - Employee list page
   - Add/Edit employee forms
   - Employee details view

2. **Leave Management**
   - Leave request form
   - Leave approval workflow
   - Leave balance tracking

3. **Attendance Module**
   - Check-in/Check-out
   - Attendance reports
   - Late arrivals tracking

4. **Payroll Module**
   - Salary configuration
   - Payslip generation
   - Payment history

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: `Access denied for user 'root'@'localhost'`
```
✅ Fix: Update application.properties with correct MySQL password
```

**Error**: `Unknown database 'nexthr_db'`
```
✅ Fix: Run CREATE DATABASE command in MySQL
```

**Error**: `Port 8080 already in use`
```
✅ Fix: Stop other applications using port 8080 or change port in application.properties
```

### Frontend Won't Start

**Error**: `Cannot find module`
```
✅ Fix: Delete node_modules and package-lock.json, run npm install again
```

**Error**: `Port 5173 already in use`
```
✅ Fix: Kill process using port 5173 or Vite will auto-select another port
```

### CORS Errors

**Error**: `Access-Control-Allow-Origin`
```
✅ Fix: Verify backend SecurityConfig allows http://localhost:5173
✅ Verify backend is running before starting frontend
```

### Login Fails

**Error**: "Invalid credentials"
```
✅ Verify Flyway migrations ran successfully
✅ Check system_user table has sysadmin@nexthr.com
✅ Password is: SysAdmin@123 (case-sensitive)
```

## 📝 Development Workflow

### Adding New Feature
1. Create backend entity (if needed)
2. Create repository with tenant filtering
3. Create service with business logic
4. Create controller with security annotations
5. Create Redux slice for state management
6. Create API functions in frontend/src/api
7. Create React components/pages
8. Add routes in App.jsx

### Database Changes
1. Create new Flyway migration: `V{number}__description.sql`
2. Add SQL statements
3. Restart backend (Flyway runs automatically)

### Testing Changes
- Backend: `cd backend && mvn test`
- Frontend: `cd frontend && npm test`
- Manual: Test in browser with developer console open

## 🎯 Next Implementation Priority

### Immediate (Week 1)
1. Employee list page with table
2. Add employee form with validation
3. Edit employee functionality
4. Delete employee (soft delete)

### Short-term (Week 2-3)
1. Leave types management
2. Leave request form
3. Leave approval workflow
4. Leave balance display

### Medium-term (Week 4-6)
1. Attendance check-in/out
2. Attendance reports
3. Payroll configuration
4. Payslip generation

## 📞 Need Help?

- Check console logs (both backend and frontend)
- Verify database tables were created
- Test API endpoints using Postman
- Review Redux DevTools for state issues
- Check Network tab for failed requests

---

**🎉 Congratulations! You now have a working multi-tenant HR management system!**

**Current Status**: Authentication, Dashboard, and Backend APIs are fully functional.
**Next**: Build employee management UI pages.
