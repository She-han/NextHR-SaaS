import { format, parseISO } from 'date-fns';

// Format date for display
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  } catch (error) {
    return date;
  }
};

// Format date and time
export const formatDateTime = (date) => {
  return formatDate(date, 'PPP p');
};

// Check if user has specific role
export const hasRole = (user, roleName) => {
  if (!user || !user.roles) return false;
  const roles = user.roles.split(',');
  return roles.some(role => role.includes(roleName));
};

// Check if user is system admin
export const isSystemAdmin = (user) => {
  return user?.userType === 'SYSTEM_ADMIN';
};

// Check if user is organization admin
export const isOrgAdmin = (user) => {
  return hasRole(user, 'ORG_ADMIN');
};

// Check if user is HR staff
export const isHRStaff = (user) => {
  return hasRole(user, 'HR_STAFF');
};

// Check if user is employee
export const isEmployee = (user) => {
  return hasRole(user, 'EMPLOYEE');
};

// Format currency
export const formatCurrency = (amount, currency = 'LKR') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get status color class
export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    PRESENT: 'bg-green-100 text-green-800',
    ABSENT: 'bg-red-100 text-red-800',
    PAID: 'bg-green-100 text-green-800',
    PROCESSED: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
