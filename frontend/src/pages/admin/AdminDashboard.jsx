import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { adminApi } from '../../api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';

/**
 * AdminDashboard - System Administrator Dashboard
 * Features: Organization management, approvals, system statistics
 * Access: ROLE_SYS_ADMIN only
 */
const AdminDashboard = () => {
  const user = useSelector(selectUser);
  
  // State management for dashboard data
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    pendingApprovals: 0,
    activeOrganizations: 0,
    suspendedOrganizations: 0
  });
  
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [pendingOrganizations, setPendingOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'approve', 'reject', 'view', 'edit', 'delete'
  
  // Filtering and search state
  const [filters, setFilters] = useState({
    status: 'ALL',
    dateFrom: '',
    dateTo: '',
    searchName: ''
  });
  
  // Available organization statuses
  const orgStatuses = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'DORMANT', label: 'Dormant' },
    { value: 'DELETED', label: 'Deleted' }
  ];

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
    loadPendingOrganizations();
  }, []);

  // Apply filters when organizations or filters change
  useEffect(() => {
    applyFilters();
  }, [organizations, filters]);

  /**
   * Load system statistics and organization data
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all organizations for statistics
      const response = await adminApi.getAllOrganizations();
      console.log('API Response:', response);
      
      // Extract data from ApiResponse wrapper
      let allOrgs = [];
      if (response && response.success && Array.isArray(response.data)) {
        allOrgs = response.data;
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        allOrgs = response;
      } else {
        console.error('Unexpected API response format:', response);
        allOrgs = [];
      }
      
      console.log('Processed organizations:', allOrgs);
      
      // Calculate statistics from organization data
      const stats = {
        totalOrganizations: allOrgs.length,
        pendingApprovals: allOrgs.filter(org => org.status === 'PENDING_APPROVAL').length,
        activeOrganizations: allOrgs.filter(org => org.status === 'ACTIVE').length,
        suspendedOrganizations: allOrgs.filter(org => org.status === 'SUSPENDED').length
      };
      
      setStats(stats);
      setOrganizations(allOrgs);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set empty data on error
      setStats({
        totalOrganizations: 0,
        pendingApprovals: 0,
        activeOrganizations: 0,
        suspendedOrganizations: 0
      });
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load organizations waiting for approval
   */
  const loadPendingOrganizations = async () => {
    try {
      const response = await adminApi.getPendingOrganizations();
      console.log('Pending Organizations API Response:', response);
      
      // Extract data from ApiResponse wrapper
      let pending = [];
      if (response && response.success && Array.isArray(response.data)) {
        pending = response.data;
      } else if (Array.isArray(response)) {
        // Fallback for direct array response
        pending = response;
      } else {
        console.error('Unexpected pending organizations response format:', response);
        pending = [];
      }
      
      console.log('Processed pending organizations:', pending);
      setPendingOrganizations(pending);
    } catch (error) {
      console.error('Failed to load pending organizations:', error);
      setPendingOrganizations([]);
    }
  };

  /**
   * Apply filters to organizations list
   */
  const applyFilters = () => {
    let filtered = [...organizations];

    // Filter by status
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(org => org.status === filters.status);
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(org => 
        new Date(org.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(org => 
        new Date(org.createdAt) <= new Date(filters.dateTo)
      );
    }

    // Filter by name search
    if (filters.searchName) {
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }

    setFilteredOrganizations(filtered);
  };

  /**
   * Update organization status
   */
  const handleStatusUpdate = async (orgId, newStatus) => {
    try {
      setLoading(true);
      const response = await adminApi.updateOrganizationStatus(orgId, newStatus);
      console.log('Status update response:', response);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to update organization status:', error);
      alert('Failed to update organization status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle organization deletion
   */
  const handleDelete = async (orgId) => {
    try {
      setLoading(true);
      await adminApi.deleteOrganization(orgId);
      await loadDashboardData(); // Refresh data
      setShowModal(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Failed to delete organization:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle organization update
   */
  const handleUpdate = async (orgData) => {
    try {
      setLoading(true);
      await adminApi.updateOrganization(selectedOrg.id, orgData);
      await loadDashboardData(); // Refresh data
      setShowModal(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Failed to update organization:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle organization approval
   */
  const handleApprove = async (orgId) => {
    try {
      setLoading(true);
      await adminApi.approveOrganization(orgId);
      
      // Refresh data after approval
      await loadDashboardData();
      await loadPendingOrganizations();
      
      setShowModal(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Failed to approve organization:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle organization rejection
   */
  const handleReject = async (orgId) => {
    try {
      setLoading(true);
      await adminApi.rejectOrganization(orgId);
      
      // Refresh data after rejection
      await loadDashboardData();
      await loadPendingOrganizations();
      
      setShowModal(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error('Failed to reject organization:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open modal for organization actions
   */
  const openModal = (org, action) => {
    setSelectedOrg(org);
    setModalType(action);
    setShowModal(true);
  };

  /**
   * Open confirmation modal for organization action (backward compatibility)
   */
  const openConfirmationModal = (org, action) => {
    openModal(org, action);
  };

  // Table columns for pending organizations
  const pendingColumns = [
    { key: 'name', label: 'Organization Name' },
    { key: 'email', label: 'Admin Email' },
    { key: 'employeeCountRange', label: 'Employee Count' },
    { key: 'address', label: 'Location' },
    {
      key: 'actions',
      label: 'Actions',
      render: (org) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openConfirmationModal(org, 'approve')}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openConfirmationModal(org, 'reject')}
          >
            Reject
          </Button>
        </div>
      )
    }
  ];

  // Table columns for all organizations
  const allOrgColumns = [
    { key: 'name', label: 'Organization' },
    { key: 'email', label: 'Contact Email' },
    { key: 'employeeCountRange', label: 'Size' },
    {
      key: 'createdAt',
      label: 'Registered',
      render: (org) => new Date(org.createdAt).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'Status',
      render: (org) => (
        <select
          value={org.status}
          onChange={(e) => handleStatusUpdate(org.id, e.target.value)}
          className="px-2 py-1 text-xs border border-gray-300 rounded"
          disabled={loading}
        >
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="DORMANT">Dormant</option>
          <option value="DELETED">Deleted</option>
        </select>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (org) => (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal(org, 'view')}
            title="View Details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal(org, 'edit')}
            title="Edit Organization"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => openModal(org, 'delete')}
            title="Delete Organization"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
        <p className="text-gray-600">Manage organizations and system settings</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Organizations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrganizations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingApprovals}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Organizations</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeOrganizations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Suspended</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.suspendedOrganizations}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals Section */}
      {pendingOrganizations.length > 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Approvals ({pendingOrganizations.length})
            </h2>
            <p className="text-sm text-gray-600">Organizations waiting for approval</p>
          </div>
          <Table
            columns={pendingColumns}
            data={pendingOrganizations}
            loading={loading}
          />
        </Card>
      )}

      {/* All Organizations Section */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Organizations</h2>
          <p className="text-sm text-gray-600">Complete list of registered organizations</p>
          
          {/* Filters and Search */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search by name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                placeholder="Organization name..."
                value={filters.searchName}
                onChange={(e) => setFilters(prev => ({ ...prev, searchName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter by status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {orgStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date from */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date to */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Clear filters button */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ status: 'ALL', dateFrom: '', dateTo: '', searchName: '' })}
            >
              Clear Filters
            </Button>
            <span className="ml-4 text-sm text-gray-600">
              Showing {filteredOrganizations.length} of {organizations.length} organizations
            </span>
          </div>
        </div>
        <Table
          columns={allOrgColumns}
          data={filteredOrganizations}
          loading={loading}
        />
      </Card>

      {/* Modals */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={modalType === 'view' || modalType === 'edit' ? 'lg' : 'md'}>
        <div className="p-6">
          {/* View Organization Modal */}
          {modalType === 'view' && selectedOrg && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrg.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      selectedOrg.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      selectedOrg.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                      selectedOrg.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedOrg.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrg.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrg.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee Count</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrg.employeeCountRange}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedOrg.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrg.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">HR Modules</label>
                  <div className="mt-1 space-y-2">
                    {/* Basic Modules - Always Available */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Basic Modules (Included)</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Employee Management</span>
                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Payroll Management</span>
                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Leave Management</span>
                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Attendance Management</span>
                      </div>
                    </div>
                    
                    {/* Advanced Modules */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Advanced HR Features</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrg.modulePerformanceTracking && (
                          <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Performance Tracking</span>
                        )}
                        {selectedOrg.moduleEmployeeFeedback && (
                          <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Employee Feedback</span>
                        )}
                        {selectedOrg.moduleHiringManagement && (
                          <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Hiring Management</span>
                        )}
                      </div>
                    </div>
                    
                    {/* AI Premium Modules */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">AI Premium Features</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrg.moduleAiFeedbackAnalyze && (
                          <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">AI Feedback Analysis</span>
                        )}
                        {selectedOrg.moduleAiAttritionPrediction && (
                          <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">AI Attrition Prediction</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </>
          )}

          {/* Edit Organization Modal */}
          {modalType === 'edit' && selectedOrg && (
            <EditOrganizationForm
              organization={selectedOrg}
              onSave={handleUpdate}
              onCancel={() => setShowModal(false)}
              loading={loading}
            />
          )}

          {/* Delete Confirmation Modal */}
          {modalType === 'delete' && selectedOrg && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Organization</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedOrg.name}</strong>? 
                This action cannot be undone and will permanently remove all organization data.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(selectedOrg.id)}
                  loading={loading}
                >
                  Delete Organization
                </Button>
              </div>
            </>
          )}

          {/* Approve/Reject Confirmation Modals */}
          {(modalType === 'approve' || modalType === 'reject') && selectedOrg && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {modalType === 'approve' ? 'Approve Organization' : 'Reject Organization'}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {modalType} <strong>{selectedOrg.name}</strong>?
                {modalType === 'approve' && 
                  ' This will activate the organization and allow their users to log in.'}
                {modalType === 'reject' && 
                  ' This will permanently reject their registration.'}
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant={modalType === 'approve' ? 'primary' : 'danger'}
                  onClick={() => modalType === 'approve' 
                    ? handleApprove(selectedOrg.id) 
                    : handleReject(selectedOrg.id)
                  }
                  loading={loading}
                >
                  {modalType === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

/**
 * Edit Organization Form Component
 */
const EditOrganizationForm = ({ organization, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: organization.name || '',
    email: organization.email || '',
    phone: organization.phone || '',
    address: organization.address || '',
    employeeCountRange: organization.employeeCountRange || '',
    // Module selections - use backend field names
    modulePerformanceTracking: organization.modulePerformanceTracking || false,
    moduleEmployeeFeedback: organization.moduleEmployeeFeedback || false,
    moduleHiringManagement: organization.moduleHiringManagement || false,
    moduleAiFeedbackAnalyze: organization.moduleAiFeedbackAnalyze || false,
    moduleAiAttritionPrediction: organization.moduleAiAttritionPrediction || false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.employeeCountRange) newErrors.employeeCountRange = 'Employee count range is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Prepare data for submission - send data directly without nested selectedModules
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      employeeCountRange: formData.employeeCountRange,
      modulePerformanceTracking: formData.modulePerformanceTracking,
      moduleEmployeeFeedback: formData.moduleEmployeeFeedback,
      moduleHiringManagement: formData.moduleHiringManagement,
      moduleAiFeedbackAnalyze: formData.moduleAiFeedbackAnalyze,
      moduleAiAttritionPrediction: formData.moduleAiAttritionPrediction
    };
    
    onSave(submissionData);
  };

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Organization</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Count *
            </label>
            <select
              name="employeeCountRange"
              value={formData.employeeCountRange}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.employeeCountRange ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select range</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
            {errors.employeeCountRange && <p className="mt-1 text-xs text-red-600">{errors.employeeCountRange}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="2"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
        </div>



        {/* HR Modules Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">HR Modules</label>
          <div className="space-y-3">
            {/* Advanced HR Modules */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Advanced HR Features</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="modulePerformanceTracking"
                    checked={formData.modulePerformanceTracking}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Performance Tracking</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="moduleEmployeeFeedback"
                    checked={formData.moduleEmployeeFeedback}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Employee Feedback</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="moduleHiringManagement"
                    checked={formData.moduleHiringManagement}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Hiring Management</span>
                </label>
              </div>
            </div>

            {/* AI Premium Features */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">AI Premium Features</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="moduleAiFeedbackAnalyze"
                    checked={formData.moduleAiFeedbackAnalyze}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">AI Feedback Analysis</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="moduleAiAttritionPrediction"
                    checked={formData.moduleAiAttritionPrediction}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">AI Attrition Prediction</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </>
  );
};

export default AdminDashboard;