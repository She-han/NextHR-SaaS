import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { EMPLOYEE_COUNT_RANGES, MODULES } from '../../utils/constants';

const Signup = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    // Organization details (Step 1)
    organizationName: '',
    employeeCount: '',
    industry: '',
    country: '',
    city: '',
    
    // Admin details (Step 2)
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    password: '',
    confirmPassword: '',
    
    // Optional HR modules (Step 3) - Basic modules are always included
    modulePerformanceTracking: false,
    moduleEmployeeFeedback: false,
    moduleHiringManagement: false,
    moduleAiFeedbackAnalyze: false,
    moduleAiAttritionPrediction: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!formData.employeeCount) {
      newErrors.employeeCount = 'Please select employee count';
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Admin name is required';
    }
    
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Email is invalid';
    }
    
    if (!formData.adminPhone.trim()) {
      newErrors.adminPhone = 'Phone number is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only allow submission from step 3 (module selection)
    if (step !== 3) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Submit organization registration with module selections
      await authApi.signup(formData);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 px-4">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your organization has been registered successfully. Your account is pending approval from the system administrator.
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Once approved, you can login with your email and password.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">NextHR</h1>
          <p className="text-blue-100">Create Your Organization Account</p>
        </div>
        
        <Card>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className={`h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <p className="mt-2 text-sm font-medium text-gray-700">Organization Details</p>
            </div>
            <div className="w-4"></div>
            <div className="flex-1">
              <div className={`h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <p className="mt-2 text-sm font-medium text-gray-700">Admin Details</p>
            </div>
            <div className="w-4"></div>
            <div className="flex-1">
              <div className={`h-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <p className="mt-2 text-sm font-medium text-gray-700">Module Selection</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Organization Details */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
                
                <Input
                  label="Organization Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  error={errors.organizationName}
                  placeholder="Acme Corporation"
                  required
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Employees <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.employeeCount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select employee count</option>
                    {EMPLOYEE_COUNT_RANGES.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                  {errors.employeeCount && (
                    <p className="mt-1 text-sm text-red-600">{errors.employeeCount}</p>
                  )}
                </div>
                
                <Input
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  error={errors.industry}
                  placeholder="Technology, Healthcare, etc."
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    error={errors.country}
                    placeholder="Sri Lanka"
                    required
                  />
                  
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    placeholder="Colombo"
                  />
                </div>
                
                <Button
                  type="button"
                  onClick={handleNextStep}
                  variant="primary"
                  fullWidth
                >
                  Next
                </Button>
              </div>
            )}

            {/* Step 2: Admin Details */}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrator Information</h3>
                
                <Input
                  label="Full Name"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  error={errors.adminName}
                  placeholder="John Doe"
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  error={errors.adminEmail}
                  placeholder="admin@example.com"
                  required
                />
                
                <Input
                  label="Phone Number"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  error={errors.adminPhone}
                  placeholder="+94 71 234 5678"
                  required
                />
                
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Create a strong password"
                  required
                />
                
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Re-enter your password"
                  required
                />
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="secondary"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    variant="primary"
                    className="flex-1"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Module Selection */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Module Selection</h3>
                <p className="text-gray-600 mb-6">
                  Choose additional HR modules for your organization. Basic modules (Employee Management, 
                  Leave Management, Attendance, Payroll) are included by default.
                </p>
                
                {/* Advanced HR Modules */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-gray-900">Advanced HR Modules (Optional)</h4>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="modulePerformanceTracking"
                      checked={formData.modulePerformanceTracking}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        modulePerformanceTracking: e.target.checked 
                      }))}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Performance Tracking</p>
                      <p className="text-sm text-gray-600">
                        Employee performance reviews, goal setting, and KPI tracking
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="moduleEmployeeFeedback"
                      checked={formData.moduleEmployeeFeedback}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        moduleEmployeeFeedback: e.target.checked 
                      }))}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Employee Feedback System</p>
                      <p className="text-sm text-gray-600">
                        360-degree feedback, surveys, and employee engagement tracking
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="moduleHiringManagement"
                      checked={formData.moduleHiringManagement}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        moduleHiringManagement: e.target.checked 
                      }))}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Hiring Management</p>
                      <p className="text-sm text-gray-600">
                        Job postings, candidate tracking, interview scheduling, and onboarding
                      </p>
                    </div>
                  </label>
                </div>

                {/* AI-Powered Modules */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium text-gray-900">AI-Powered Features (Premium)</h4>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="moduleAiFeedbackAnalyze"
                      checked={formData.moduleAiFeedbackAnalyze}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        moduleAiFeedbackAnalyze: e.target.checked 
                      }))}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">AI Feedback Analysis</p>
                      <p className="text-sm text-gray-600">
                        Intelligent analysis of employee feedback and sentiment tracking
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="moduleAiAttritionPrediction"
                      checked={formData.moduleAiAttritionPrediction}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        moduleAiAttritionPrediction: e.target.checked 
                      }))}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">AI Attrition Prediction</p>
                      <p className="text-sm text-gray-600">
                        Predictive analytics to identify at-risk employees and retention strategies
                      </p>
                    </div>
                  </label>
                </div>

                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> After registration, your account will be pending approval from the system administrator. 
                    You will be able to login once your organization is approved. You can modify module selections later from your admin dashboard.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    variant="secondary"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="flex-1"
                  >
                    Complete Registration
                  </Button>
                </div>
              </div>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
