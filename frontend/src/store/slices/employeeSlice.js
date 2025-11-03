import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    fetchEmployeesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.employees = action.payload.content;
      state.pagination = {
        page: action.payload.number,
        size: action.payload.size,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
      };
    },
    fetchEmployeesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentEmployee: (state, action) => {
      state.currentEmployee = action.payload;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  setCurrentEmployee,
  clearCurrentEmployee,
  clearError,
} = employeeSlice.actions;

export const selectEmployees = (state) => state.employee.employees;
export const selectCurrentEmployee = (state) => state.employee.currentEmployee;
export const selectEmployeeLoading = (state) => state.employee.loading;
export const selectEmployeePagination = (state) => state.employee.pagination;

export default employeeSlice.reducer;
