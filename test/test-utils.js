/**
 * Test utilities for employee management components
 */

// Mock Redux store for testing
export const createMockReduxStore = (initialState = {}) => {
  const state = {
    employees: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '01/01/2020',
        dateOfBirth: '15/05/1985',
        phoneNumber: '+90 536 850 8524',
        emailAddress: 'john.doe@example.com',
        department: 'Tech',
        position: 'Senior'
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfEmployment: '15/03/2021',
        dateOfBirth: '22/08/1990',
        phoneNumber: '0536 850 8525',
        emailAddress: 'jane.smith@example.com',
        department: 'Analytics',
        position: 'Junior'
      }
    ],
    ...initialState
  };

  const listeners = [];
  
  return {
    getState: () => state,
    dispatch: (action) => {
      switch (action.type) {
        case 'ADD_EMPLOYEE':
          const newEmployee = {
            id: Math.max(...state.employees.map(e => e.id)) + 1,
            ...action.payload
          };
          state.employees.push(newEmployee);
          break;
        case 'UPDATE_EMPLOYEE':
          const index = state.employees.findIndex(e => e.id === action.payload.id);
          if (index !== -1) {
            state.employees[index] = { ...state.employees[index], ...action.payload };
          }
          break;
        case 'DELETE_EMPLOYEE':
          state.employees = state.employees.filter(e => e.id !== action.payload);
          break;
      }
      listeners.forEach(listener => listener());
    },
    subscribe: (callback) => {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      };
    }
  };
};

// Mock localization manager for testing
export const createMockLocalizationManager = () => {
  const translations = {
    en: {
      'employeeList': 'Employee List',
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'dateOfEmployment': 'Date of Employment',
      'dateOfBirth': 'Date of Birth',
      'phone': 'Phone',
      'email': 'Email',
      'department': 'Department',
      'position': 'Position',
      'actions': 'Actions',
      'edit': 'Edit',
      'delete': 'Delete',
      'previous': 'Previous',
      'next': 'Next',
      'page': 'Page',
      'of': 'of',
      'employeeNotFound': 'Employee not found',
      'employeeNotFoundMessage': 'The employee you\'re looking for doesn\'t exist.',
      'backToEmployeeList': 'Back to Employee List',
      'confirmDelete': 'Are you sure you want to delete this employee?',
      'addNewEmployee': 'Add New Employee',
      'editEmployee': 'Edit Employee',
      'firstNameLabel': 'First Name:',
      'lastNameLabel': 'Last Name:',
      'dateOfEmploymentLabel': 'Date of Employment:',
      'dateOfBirthLabel': 'Date of Birth:',
      'phoneNumberLabel': 'Phone Number:',
      'emailAddressLabel': 'Email Address:',
      'departmentLabel': 'Department:',
      'positionLabel': 'Position:',
      'selectDepartment': 'Select Department',
      'selectPosition': 'Select Position',
      'analytics': 'Analytics',
      'tech': 'Tech',
      'junior': 'Junior',
      'medior': 'Medior',
      'senior': 'Senior',
      'save': 'Save',
      'cancel': 'Cancel',
      'firstNameRequired': 'First name must be at least 2 characters',
      'lastNameRequired': 'Last name must be at least 2 characters',
      'validEmailRequired': 'Please enter a valid email address',
      'validPhoneRequired': 'Please enter a valid phone number',
      'fieldRequired': 'This field is required',
      'backToEmployeeListLink': '← Back to Employee List'
    }
  };

  let currentLanguage = 'en';
  const listeners = [];

  return {
    getCurrentLanguage: () => currentLanguage,
    translate: (key) => translations[currentLanguage][key] || key,
    subscribe: (callback) => {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      };
    },
    listeners: listeners // Expose listeners for testing
  };
};

// Setup test environment
export const setupTestEnvironment = (mockStore, mockLocalization) => {
  // Store original globals
  const originalStore = window.__REDUX_STORE__;
  const originalLocalization = window.localizationManager;
  
  // Set up mocks
  window.__REDUX_STORE__ = mockStore;
  window.localizationManager = mockLocalization;
  
  return () => {
    // Restore original globals
    window.__REDUX_STORE__ = originalStore;
    window.localizationManager = originalLocalization;
  };
};

// Helper to create a mock location object for routing
export const createMockLocation = (pathname = '/', params = {}) => ({
  pathname,
  params
});

// Helper to wait for component updates
export const waitForUpdate = async (element) => {
  await element.updateComplete;
  // Additional small delay to ensure all async operations complete
  await new Promise(resolve => setTimeout(resolve, 0));
};
