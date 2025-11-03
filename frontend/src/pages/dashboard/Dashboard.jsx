import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../store/slices/authSlice';
import { USER_ROLES } from '../../utils/constants';
import { isSystemAdmin, isOrgAdmin, hasRole } from '../../utils/helpers';
import Card from '../../components/common/Card';

/**
 * Dashboard - Main dashboard router
 * Redirects System Admins to /admin, shows org-specific dashboards for others
 */
const Dashboard = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  // Redirect system admin to admin dashboard
  useEffect(() => {
    if (isSystemAdmin(user)) {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Render organization dashboard based on user role
  const renderDashboard = () => {
    if (isOrgAdmin(user)) {
      return <OrgAdminDashboard user={user} />;
    } else if (hasRole(user, USER_ROLES.HR_STAFF)) {
      return <HRStaffDashboard user={user} />;
    } else {
      return <EmployeeDashboard user={user} />;
    }
  };

  return (
    <div className="p-6">
      {renderDashboard()}
    </div>
  );
};

// System Admin Dashboard
const SystemAdminDashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">System Administrator Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Organizations</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Organizations</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Recent Organizations">
        <p className="text-gray-500">No organizations registered yet.</p>
      </Card>
    </div>
  );
};

// Organization Admin Dashboard - Dynamic based on enabled modules
const OrgAdminDashboard = ({ user }) => {
  const moduleConfig = useSelector(state => state.auth.moduleConfig) || {};

  return (
    <div>
      {/* Header with organization info */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {user?.organizationName} Dashboard
        </h2>
        <p className="text-gray-600">Welcome back, {user?.fullName}</p>
      </div>

      {/* Core Statistics - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-red-600">0</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Core Modules - Always Available */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Core HR Modules</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Employee Management">
            <p className="text-gray-600 mb-3">Manage employee profiles, departments, and positions.</p>
            <div className="text-sm text-gray-500">Recent: No employees added yet</div>
          </Card>
          
          <Card title="Leave Management">
            <p className="text-gray-600 mb-3">Process leave requests and manage leave policies.</p>
            <div className="text-sm text-gray-500">Pending: No leave requests</div>
          </Card>
          
          <Card title="Attendance Tracking">
            <p className="text-gray-600 mb-3">Monitor daily attendance and working hours.</p>
            <div className="text-sm text-gray-500">Today: 0 check-ins</div>
          </Card>
          
          <Card title="Payroll Management">
            <p className="text-gray-600 mb-3">Calculate salaries, bonuses, and deductions.</p>
            <div className="text-sm text-gray-500">Next payroll: Not scheduled</div>
          </Card>
        </div>
      </div>

      {/* Advanced Modules - Conditionally Rendered */}
      {(moduleConfig.modulePerformanceTracking || moduleConfig.moduleEmployeeFeedback || 
        moduleConfig.moduleHiringManagement) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced HR Modules</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {moduleConfig.modulePerformanceTracking && (
              <Card title="Performance Tracking">
                <p className="text-gray-600 mb-3">Employee performance reviews and goal management.</p>
                <div className="text-sm text-gray-500">Active reviews: 0</div>
              </Card>
            )}
            
            {moduleConfig.moduleEmployeeFeedback && (
              <Card title="Employee Feedback">
                <p className="text-gray-600 mb-3">360-degree feedback and engagement surveys.</p>
                <div className="text-sm text-gray-500">Recent feedback: None</div>
              </Card>
            )}
            
            {moduleConfig.moduleHiringManagement && (
              <Card title="Hiring Management">
                <p className="text-gray-600 mb-3">Job postings, candidate tracking, and onboarding.</p>
                <div className="text-sm text-gray-500">Open positions: 0</div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* AI-Powered Modules - Premium Features */}
      {(moduleConfig.moduleAiFeedbackAnalyze || moduleConfig.moduleAiAttritionPrediction) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {moduleConfig.moduleAiFeedbackAnalyze && (
              <Card title="AI Feedback Analysis">
                <p className="text-gray-600 mb-3">Intelligent sentiment analysis and insights.</p>
                <div className="text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    AI Premium
                  </span>
                </div>
              </Card>
            )}
            
            {moduleConfig.moduleAiAttritionPrediction && (
              <Card title="Attrition Prediction">
                <p className="text-gray-600 mb-3">Predictive analytics for employee retention.</p>
                <div className="text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    AI Premium
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// HR Staff Dashboard
const HRStaffDashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">HR Staff Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Recent Activities">
        <p className="text-gray-500">No recent activities.</p>
      </Card>
    </div>
  );
};

// Employee Dashboard
const EmployeeDashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Leave Balance</p>
              <p className="text-3xl font-bold text-blue-600">0 days</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance This Month</p>
              <p className="text-3xl font-bold text-green-600">0 days</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="My Leave History">
          <p className="text-gray-500">No leave records found.</p>
        </Card>
        
        <Card title="Upcoming Holidays">
          <p className="text-gray-500">No upcoming holidays.</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
