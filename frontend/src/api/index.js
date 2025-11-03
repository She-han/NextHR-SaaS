import axiosInstance from './axios';

// Authentication APIs
export const authApi = {
  // Register organization
  signup: (data) => axiosInstance.post('/auth/signup', data),
  
  // Login
  login: (data) => axiosInstance.post('/auth/login', data),
  
  // Configure modules
  configureModules: (data) => axiosInstance.post('/auth/configure-modules', data),
  
  // Get current user
  getCurrentUser: () => axiosInstance.get('/auth/me'),
};

// Employee APIs
export const employeeApi = {
  // Get all employees
  getAll: (params) => axiosInstance.get('/employees', { params }),
  
  // Get active employees
  getActive: (params) => axiosInstance.get('/employees/active', { params }),
  
  // Get employee by ID
  getById: (id) => axiosInstance.get(`/employees/${id}`),
  
  // Create employee
  create: (data) => axiosInstance.post('/employees', data),
  
  // Update employee
  update: (id, data) => axiosInstance.put(`/employees/${id}`, data),
  
  // Delete employee
  delete: (id) => axiosInstance.delete(`/employees/${id}`),
};

// Dashboard APIs
export const dashboardApi = {
  // Get dashboard statistics
  getStats: () => axiosInstance.get('/dashboard/stats'),
};

// Admin APIs (System Admin only)
export const adminApi = {
  // Get pending organizations
  getPendingOrganizations: () => axiosInstance.get('/admin/organizations/pending'),
  
  // Get all organizations
  getAllOrganizations: (status) => 
    axiosInstance.get('/admin/organizations', { params: { status } }),
  
  // Approve organization
  approveOrganization: (id) => axiosInstance.put(`/admin/organizations/${id}/approve`),
  
  // Reject organization
  rejectOrganization: (id) => axiosInstance.put(`/admin/organizations/${id}/reject`),
  
  // Update organization status
  updateOrganizationStatus: (id, status) => 
    axiosInstance.put(`/admin/organizations/${id}/status`, null, { params: { status } }),
  
  // Update organization details
  updateOrganization: (id, data) => axiosInstance.put(`/admin/organizations/${id}`, data),
  
  // Delete organization
  deleteOrganization: (id) => axiosInstance.delete(`/admin/organizations/${id}`),
};
