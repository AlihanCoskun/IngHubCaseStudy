// Generate 90 employees with the same data as requested
const generateEmployees = () => {
  const employees = [];
  for (let i = 1; i <= 90; i++) {
    employees.push({
      id: i,
      firstName: 'Alihan',
      lastName: 'Coskun',
      dateOfEmployment: '25/11/2025',
      dateOfBirth: '5/2/1995',
      phoneNumber: '+(90) 5368508524',
      emailAddress: 'alihan.coskun@hotmail.com',
      department: 'Tech',
      position: 'Senior'
    });
  }
  return employees;
};

const initialState = {
  employees: generateEmployees(),
  selectedEmployee: null,
  loading: false,
  error: null
};

// Action types
const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';
const SELECT_EMPLOYEE = 'SELECT_EMPLOYEE';
const CLEAR_SELECTED_EMPLOYEE = 'CLEAR_SELECTED_EMPLOYEE';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

// Action creators
export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: employee
});

export const updateEmployee = (employee) => ({
  type: UPDATE_EMPLOYEE,
  payload: employee
});

export const deleteEmployee = (id) => ({
  type: DELETE_EMPLOYEE,
  payload: id
});

export const selectEmployee = (employee) => ({
  type: SELECT_EMPLOYEE,
  payload: employee
});

export const clearSelectedEmployee = () => ({
  type: CLEAR_SELECTED_EMPLOYEE
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error
});

// Reducer
const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, { ...action.payload, id: state.employees.length + 1 }]
      };
    
    case UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? { ...emp, ...action.payload } : emp
        )
      };
    
    case DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload)
      };
    
    case SELECT_EMPLOYEE:
      return {
        ...state,
        selectedEmployee: action.payload
      };
    
    case CLEAR_SELECTED_EMPLOYEE:
      return {
        ...state,
        selectedEmployee: null
      };
    
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    default:
      return state;
  }
};

export default employeeReducer;

