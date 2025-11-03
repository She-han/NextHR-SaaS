import { useState, useEffect } from 'react';
import { employeeApi } from '../../api';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { EMPLOYMENT_TYPES } from '../../utils/constants';

const EditEmployeeModal = ({ isOpen, employee, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    department: '',
    designation: '',
    employmentType: '',
    dateOfJoining: '',
    salary: '',
    bankName: '',
    bankAccountNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeCode: employee.employeeCode || '',
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        dateOfBirth: employee.dateOfBirth || '',
        gender: employee.gender || '',
        address: employee.address || '',
        department: employee.department || '',
        designation: employee.designation || '',
        employmentType: employee.employmentType || '',
        dateOfJoining: employee.dateOfJoining || '',
        salary: employee.salary || '',
        bankName: employee.bankName || '',
        bankAccountNumber: employee.bankAccountNumber || '',
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactPhone: employee.emergencyContactPhone || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await employeeApi.update(employee.id, formData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Employee"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Update Employee
          </Button>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form className="space-y-4 max-h-96 overflow-y-auto">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee Code"
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
              error={errors.employeeCode}
              disabled
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Employment Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Employment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            
            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <Input
              label="Date of Joining"
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Monthly Salary (LKR)"
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        {/* Bank Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bank Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />
            
            <Input
              label="Account Number"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
            />
            
            <Input
              label="Contact Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditEmployeeModal;
