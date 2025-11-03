import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, selectAuth } from '../../store/slices/authSlice';
import { authApi } from '../../api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(selectAuth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    dispatch(loginStart());
    
    try {
      // Call login API - returns ApiResponse wrapper: { success, message, data }
      const response = await authApi.login(formData);
      console.log('Login response:', response);
      
      // Extract LoginResponse from ApiResponse.data field
      // Backend wraps all responses in ApiResponse<T> where T is the actual data
      const loginData = response.data;
      
      // Build user object with all necessary fields for application state
      const user = {
        userId: loginData.userId,
        email: loginData.email,
        fullName: loginData.fullName,
        roles: loginData.roles,
        organizationUuid: loginData.organizationUuid,
        organizationName: loginData.organizationName,
        userType: loginData.userType // SYSTEM_ADMIN or ORG_USER
      };
      
      // Store JWT token in localStorage for API authentication
      localStorage.setItem('token', loginData.token);
      
      // Store user info in localStorage for persistence across page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update Redux store with authenticated user data
      dispatch(loginSuccess({
        user: user,
        token: loginData.token,
        moduleConfig: loginData.moduleConfig // Organization's enabled modules
      }));
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      // Log error for debugging
      console.error('Login error:', err);
      
      // Update Redux store with error message
      dispatch(loginFailure(err.message || err || 'Login failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">NextHR</h1>
          <p className="text-blue-100">Multi-Tenant HR Management System</p>
        </div>
        
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign in to your account
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />
            
            <div className="mb-4">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an organization?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </Card>
        
        <div className="mt-8 text-center text-white text-sm">
          <p>© 2024 NextHR. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
