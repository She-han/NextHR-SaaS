import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from './store/slices/authSlice';

// Layout
import Layout from './components/layout/Layout';

// Import pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeDetails from './pages/employees/EmployeeDetails';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/signup" 
        element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} 
      />

      {/* Protected Routes with Layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Employee Management Routes */}
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/employees/:id" 
        element={
          <ProtectedRoute>
            <EmployeeDetails />
          </ProtectedRoute>
        } 
      />

      {/* Default Route */}
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
      />

      {/* 404 Route */}
      <Route 
        path="*" 
        element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
              <p className="text-xl text-gray-600 mt-4">Page not found</p>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}

export default App;
