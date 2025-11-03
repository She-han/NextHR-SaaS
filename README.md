# NextHR - Multi-Tenant HR Management SaaS Platform

A comprehensive, multi-tenant HR Management System built with Spring Boot backend and React frontend.

## 🌟 Features

### Multi-Tenancy
- Shared database architecture with organization-level data isolation
- ThreadLocal-based tenant context management
- JWT-based authentication with organization scoping

### User Roles
1. **System Admin (SYS_ADMIN)**: Platform-level administration
2. **Organization Admin (ORG_ADMIN)**: Full organization management
3. **HR Staff (HR_STAFF)**: Employee and HR operations management
4. **Employee (EMPLOYEE)**: Self-service portal

### Core Modules

**Basic Modules (Always Available)**:
- Employee Management
- Leave Management
- Attendance Tracking
- Payroll Processing
- Department Management
- Designation Management
- Work Schedule Management
- Dashboard & Analytics

**Extended Modules (Optional)**:
- Performance Management
- Recruitment Management
- Training & Development
- Document Management
- Asset Management

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot 3.5.7
- Spring Security with JWT
- Spring Data JPA / Hibernate
- MySQL 8.0+
- Flyway Migration
- Maven

### Frontend
- React 19.1.1
- Redux Toolkit 2.2.1
- React Router DOM 6.22.0
- Axios 1.6.7
- TailwindCSS 4.1.16
- Vite 7.1.7

## 📋 Prerequisites

- Java 21 or higher
- Node.js 18+ and npm
- MySQL 8.0+
- Maven 3.8+

## 🚀 Installation & Setup

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE nexthr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'nexthr_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON nexthr_db.* TO 'nexthr_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Update application.properties with your database credentials
# Edit src/main/resources/application.properties

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔐 Default Credentials

After running Flyway migrations, a default system admin account is created:

- **Email**: `sysadmin@nexthr.com`
- **Password**: `SysAdmin@123`

**⚠️ Important**: Change this password immediately after first login!

## 📁 Project Structure

```
NextHR-SaaS/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/NextHR/backend/
│   │   │   │   ├── config/          # Security & JWT configuration
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # JPA Entities
│   │   │   │   ├── repository/      # Data Access Layer
│   │   │   │   ├── service/         # Business Logic
│   │   │   │   ├── controller/      # REST API Endpoints
│   │   │   │   └── util/            # Utilities
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/    # Flyway SQL scripts
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/                     # API client & endpoints
│   │   ├── components/
│   │   │   └── common/              # Reusable UI components
│   │   ├── pages/
│   │   │   ├── auth/                # Login & Signup
│   │   │   └── dashboard/           # Dashboard views
│   │   ├── store/
│   │   │   └── slices/              # Redux state management
│   │   ├── utils/                   # Helper functions
│   │   ├── App.jsx                  # Main App component
│   │   └── main.jsx                 # Entry point
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new organization
- `POST /api/auth/login` - User login
- `POST /api/auth/configure-modules` - Configure organization modules
- `GET /api/auth/me` - Get current user info

### Employees
- `GET /api/employees` - List employees (paginated)
- `GET /api/employees/{id}` - Get employee details
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Soft delete employee

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Admin (System Admin only)
- `GET /api/admin/organizations` - List all organizations
- `GET /api/admin/organizations/pending` - Pending approvals
- `PUT /api/admin/organizations/{uuid}/approve` - Approve organization
- `PUT /api/admin/organizations/{uuid}/reject` - Reject organization

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Usage Flow

### Organization Registration
1. Navigate to `/signup`
2. Fill in organization details (Step 1)
3. Fill in admin details (Step 2)
4. Submit registration
5. Wait for system admin approval

### System Admin Approval
1. Login as system admin
2. View pending organizations
3. Approve or reject registration
4. Approved organization receives email with credentials

### Organization Setup
1. Organization admin logs in with provided credentials
2. Change default password
3. Configure optional modules (first login)
4. Add departments and designations
5. Add employees and HR staff

### Employee Management
1. Organization admin or HR staff adds employees
2. Optional: Create system access for employees
3. Employees receive login credentials
4. Employees can access self-service features

## 🔒 Security Features

- JWT-based authentication
- BCrypt password hashing
- Role-based access control (RBAC)
- Multi-tenant data isolation
- CORS configuration
- Request/Response interceptors
- Automatic token refresh

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Failed**
```
Check MySQL service is running
Verify credentials in application.properties
Ensure database 'nexthr_db' exists
```

**Flyway Migration Failed**
```
Drop and recreate database
Or manually fix migration version table
```

### Frontend Issues

**CORS Errors**
```
Ensure backend CORS is configured for http://localhost:5173
Check if backend is running
```

**API Call Fails**
```
Verify backend is running on port 8080
Check browser console for detailed error
Ensure token is present in localStorage
```

## 🚧 Development Status

### ✅ Completed
- Multi-tenant database architecture
- JWT authentication & authorization
- Employee management backend API
- Dashboard statistics API
- Admin organization management
- Redux state management
- React Router setup
- Login & Signup pages
- Dashboard views for all roles
- Reusable UI components

### 🚧 In Progress / Planned
- [ ] Employee CRUD operations UI
- [ ] Leave management module UI
- [ ] Attendance tracking UI
- [ ] Payroll processing UI
- [ ] Reports and analytics
- [ ] Mobile app
- [ ] Email notifications
- [ ] Performance optimization

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, create an issue in the repository.

---

**Built with ❤️ using Spring Boot and React**
