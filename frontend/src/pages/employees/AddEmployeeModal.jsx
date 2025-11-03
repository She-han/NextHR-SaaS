import { useState } from 'react';
import { employeeApi } from '../../api';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { EMPLOYMENT_TYPES } from '../../utils/constants';

const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
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
    emergencyContactPhone: '',
    createSystemAccess: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = 'Employee code is required';
    }
    
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
    
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Date of joining is required';
    }
    
    if (!formData.employmentType) {
      newErrors.employmentType = 'Employment type is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
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
      await employeeApi.create(formData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Create Employee
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
              placeholder="EMP001"
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="John"
              required
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Doe"
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
              placeholder="john.doe@example.com"
              required
            />
            
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+94 77 123 4567"
            />
          </div>

          <Input
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="123 Main St, Colombo"
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
              error={errors.department}
              placeholder="Engineering"
              required
            />
            
            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={errors.designation}
              placeholder="Senior Developer"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employmentType ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select type</option>
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.employmentType && <p className="mt-1 text-sm text-red-600">{errors.employmentType}</p>}
            </div>
            
            <Input
              label="Date of Joining"
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              error={errors.dateOfJoining}
              required
            />
          </div>

          <Input
            label="Monthly Salary (LKR)"
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            error={errors.salary}
            placeholder="150000"
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
              error={errors.bankName}
              placeholder="Commercial Bank"
            />
            
            <Input
              label="Account Number"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              error={errors.bankAccountNumber}
              placeholder="1234567890"
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
              error={errors.emergencyContactName}
              placeholder="Jane Doe"
            />
            
            <Input
              label="Contact Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              error={errors.emergencyContactPhone}
              placeholder="+94 77 987 6543"
            />
          </div>
        </div>

        {/* System Access */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="createSystemAccess"
            name="createSystemAccess"
            checked={formData.createSystemAccess}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="createSystemAccess" className="ml-2 block text-sm text-gray-700">
            Create system access for this employee (they will receive login credentials)
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default AddEmployeeModal;
