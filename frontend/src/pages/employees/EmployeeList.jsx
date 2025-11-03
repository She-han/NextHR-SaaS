import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { employeeApi } from '../../api';
import { isOrgAdmin, hasRole, formatDate } from '../../utils/helpers';
import { USER_ROLES, EMPLOYMENT_TYPES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';

const EmployeeList = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canManageEmployees = isOrgAdmin(user) || hasRole(user, USER_ROLES.HR_STAFF);

  useEffect(() => {
    fetchEmployees(0);
  }, []);

  const fetchEmployees = async (page = 0, search = searchTerm) => {
    setLoading(true);
    setError('');
    try {
      const response = await employeeApi.getAll(page, pagination.pageSize, search);
      setEmployees(response.content);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        pageSize: response.pageSize
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(0, searchTerm);
  };

  const handlePageChange = (newPage) => {
    fetchEmployees(newPage);
  };

  const handleAddEmployee = () => {
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;
    
    setDeleteLoading(true);
    try {
      await employeeApi.delete(selectedEmployee.id);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees(pagination.currentPage);
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEmployeeAdded = () => {
    setShowAddModal(false);
    fetchEmployees(0);
  };

  const handleEmployeeUpdated = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
    fetchEmployees(pagination.currentPage);
  };

  const columns = [
    {
      header: 'Employee Code',
      accessor: 'employeeCode'
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => `${row.firstName} ${row.lastName}`
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Department',
      accessor: 'department'
    },
    {
      header: 'Designation',
      accessor: 'designation'
    },
    {
      header: 'Employment Type',
      accessor: 'employmentType',
      render: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.employmentType === 'FULL_TIME' 
            ? 'bg-green-100 text-green-800' 
            : row.employmentType === 'PART_TIME'
            ? 'bg-blue-100 text-blue-800'
            : row.employmentType === 'CONTRACT'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {EMPLOYMENT_TYPES.find(t => t.value === row.employmentType)?.label || row.employmentType}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/employees/${row.id}`)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View
          </button>
          {canManageEmployees && (
            <>
              <button
                onClick={() => handleEditEmployee(row)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Edit
              </button>
              {isOrgAdmin(user) && (
                <button
                  onClick={() => handleDeleteEmployee(row)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      )
    }
  ];

  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading size="lg" message="Loading employees..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <p className="text-gray-600 mt-1">Manage your organization's employees</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Card>
        {/* Search and Add Employee */}
        <div className="flex justify-between items-center mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or code..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
          
          {canManageEmployees && (
            <Button onClick={handleAddEmployee} variant="primary">
              + Add Employee
            </Button>
          )}
        </div>

        {/* Employee Table */}
        <Table columns={columns} data={employees} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {pagination.currentPage * pagination.pageSize + 1} to{' '}
              {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of{' '}
              {pagination.totalElements} employees
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleEmployeeAdded}
        />
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          isOpen={showEditModal}
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onSuccess={handleEmployeeUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Employee"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete employee{' '}
          <strong>
            {selectedEmployee?.firstName} {selectedEmployee?.lastName}
          </strong>
          ? This action will mark the employee as inactive.
        </p>
      </Modal>
    </div>
  );
};

export default EmployeeList;
