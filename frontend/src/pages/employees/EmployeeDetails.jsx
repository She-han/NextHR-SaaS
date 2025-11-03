import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { employeeApi } from '../../api';
import { formatDate, formatCurrency, isOrgAdmin, hasRole } from '../../utils/helpers';
import { USER_ROLES, EMPLOYMENT_TYPES } from '../../utils/constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canManageEmployees = isOrgAdmin(user) || hasRole(user, USER_ROLES.HR_STAFF);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employeeApi.getById(id);
      setEmployee(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch employee details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading size="lg" message="Loading employee details..." />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error || 'Employee not found'}</p>
            <Button onClick={() => navigate('/employees')}>
              Back to Employees
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-gray-600 mt-1">{employee.designation} • {employee.department}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/employees')}>
            Back to List
          </Button>
          {canManageEmployees && (
            <Button variant="primary" onClick={() => navigate(`/employees/${id}/edit`)}>
              Edit Employee
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card title="Basic Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Employee Code</p>
                <p className="font-medium text-gray-900">{employee.employeeCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{employee.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {employee.dateOfBirth ? formatDate(employee.dateOfBirth) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium text-gray-900">{employee.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">{employee.address || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Employment Details */}
          <Card title="Employment Details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-900">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-medium text-gray-900">{employee.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employment Type</p>
                <p className="font-medium text-gray-900">
                  {EMPLOYMENT_TYPES.find(t => t.value === employee.employmentType)?.label || employee.employmentType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Joining</p>
                <p className="font-medium text-gray-900">
                  {formatDate(employee.dateOfJoining)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {employee.dateOfLeaving && (
                <div>
                  <p className="text-sm text-gray-600">Date of Leaving</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(employee.dateOfLeaving)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Financial Information */}
          {(isOrgAdmin(user) || hasRole(user, USER_ROLES.HR_STAFF)) && employee.salary && (
            <Card title="Financial Information">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Monthly Salary</p>
                  <p className="font-medium text-gray-900">{formatCurrency(employee.salary)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-medium text-gray-900">{employee.bankName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium text-gray-900">{employee.bankAccountNumber || 'N/A'}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Emergency Contact */}
          <Card title="Emergency Contact">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Contact Name</p>
                <p className="font-medium text-gray-900">{employee.emergencyContactName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact Phone</p>
                <p className="font-medium text-gray-900">{employee.emergencyContactPhone || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {/* System Access */}
          <Card title="System Access">
            <div className="text-center py-4">
              {employee.hasSystemAccess ? (
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Enabled</p>
                  <p className="text-xs text-gray-600 mt-1">Employee has portal access</p>
                </>
              ) : (
                <>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-3">
                    <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Disabled</p>
                  <p className="text-xs text-gray-600 mt-1">No portal access</p>
                </>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          {canManageEmployees && (
            <Card title="Quick Actions">
              <div className="space-y-2">
                <Button variant="outline" fullWidth size="sm">
                  View Attendance
                </Button>
                <Button variant="outline" fullWidth size="sm">
                  View Leave History
                </Button>
                <Button variant="outline" fullWidth size="sm">
                  View Payroll
                </Button>
                <Button variant="outline" fullWidth size="sm">
                  Generate Report
                </Button>
              </div>
            </Card>
          )}

          {/* Timeline (Placeholder) */}
          <Card title="Recent Activity">
            <div className="text-center py-4 text-sm text-gray-500">
              No recent activity
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
