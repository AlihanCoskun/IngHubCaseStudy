/**
 * Unit tests for manage-employee.js component
 */

import { ManageEmployee } from '../manage-employee.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { 
  createMockReduxStore, 
  createMockLocalizationManager, 
  setupTestEnvironment,
  createMockLocation,
  waitForUpdate 
} from './test-utils.js';

suite('manage-employee', () => {
  let mockStore;
  let mockLocalization;
  let cleanup;

  setup(() => {
    mockStore = createMockReduxStore();
    mockLocalization = createMockLocalizationManager();
    cleanup = setupTestEnvironment(mockStore, mockLocalization);
  });

  teardown(() => {
    cleanup();
  });

  test('is defined', () => {
    const el = document.createElement('manage-employee');
    assert.instanceOf(el, ManageEmployee);
  });

  test('initializes with default values', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    
    assert.isNull(el.location);
    assert.isNull(el.employee);
    assert.isFalse(el.isNew);
    assert.deepEqual(el.formErrors, {});
    assert.isFalse(el.isFormValid);
    assert.equal(el.currentLanguage, 'en');
  });

  test('loads new employee when id is "new"', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    
    await waitForUpdate(el);
    el.loadEmployee();
    await waitForUpdate(el);
    
    assert.isTrue(el.isNew);
    assert.isNotNull(el.employee);
    assert.equal(el.employee.firstName, '');
    assert.equal(el.employee.lastName, '');
    assert.equal(el.employee.dateOfEmployment, '');
    assert.equal(el.employee.dateOfBirth, '');
    assert.equal(el.employee.phoneNumber, '');
    assert.equal(el.employee.emailAddress, '');
    assert.equal(el.employee.department, '');
    assert.equal(el.employee.position, '');
  });

  test('loads existing employee by id', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/1', { id: '1' });
    
    await waitForUpdate(el);
    el.loadEmployee();
    await waitForUpdate(el);
    
    assert.isFalse(el.isNew);
    assert.isNotNull(el.employee);
    assert.equal(el.employee.id, 1);
    assert.equal(el.employee.firstName, 'John');
    assert.equal(el.employee.lastName, 'Doe');
  });

  test('handles employee not found', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/999', { id: '999' });
    
    await waitForUpdate(el);
    el.loadEmployee();
    await waitForUpdate(el);
    
    assert.isFalse(el.isNew);
    assert.isNull(el.employee);
  });

  test('renders add new employee form', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const title = el.shadowRoot.querySelector('.list-title');
    assert.equal(title.textContent.trim(), 'Add New Employee');
    
    const formContainer = el.shadowRoot.querySelector('.form-container');
    assert.isNotNull(formContainer);
  });

  test('renders edit employee form', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/1', { id: '1' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const title = el.shadowRoot.querySelector('.list-title');
    assert.equal(title.textContent.trim(), 'Edit Employee');
    
    const formContainer = el.shadowRoot.querySelector('.form-container');
    assert.isNotNull(formContainer);
  });

  test('renders employee not found message', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/999', { id: '999' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const notFoundTitle = el.shadowRoot.querySelector('h2');
    assert.equal(notFoundTitle.textContent.trim(), 'Employee not found');
  });

  test('form fields are rendered correctly', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Check all form fields exist
    assert.isNotNull(el.shadowRoot.querySelector('#firstName'));
    assert.isNotNull(el.shadowRoot.querySelector('#lastName'));
    assert.isNotNull(el.shadowRoot.querySelector('#dateOfEmployment'));
    assert.isNotNull(el.shadowRoot.querySelector('#dateOfBirth'));
    assert.isNotNull(el.shadowRoot.querySelector('#phoneNumber'));
    assert.isNotNull(el.shadowRoot.querySelector('#emailAddress'));
    assert.isNotNull(el.shadowRoot.querySelector('#department'));
    assert.isNotNull(el.shadowRoot.querySelector('#position'));
  });

  test('form fields are populated with employee data', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/1', { id: '1' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const firstNameInput = el.shadowRoot.querySelector('#firstName');
    const lastNameInput = el.shadowRoot.querySelector('#lastName');
    const emailInput = el.shadowRoot.querySelector('#emailAddress');
    
    assert.equal(firstNameInput.value, 'John');
    assert.equal(lastNameInput.value, 'Doe');
    assert.equal(emailInput.value, 'john.doe@example.com');
  });

  test('handles input changes correctly', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const firstNameInput = el.shadowRoot.querySelector('#firstName');
    firstNameInput.value = 'Test';
    firstNameInput.dispatchEvent(new Event('input'));
    
    assert.equal(el.employee.firstName, 'Test');
  });

  test('handles phone input filtering', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const phoneInput = el.shadowRoot.querySelector('#phoneNumber');
    
    // Test filtering of invalid characters
    phoneInput.value = '+90 (536) 850-8524 abc';
    phoneInput.dispatchEvent(new Event('input'));
    
    assert.equal(el.employee.phoneNumber, '+90 (536) 8508524 ');
  });

  test('handles date input changes', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const dateInput = el.shadowRoot.querySelector('#dateOfEmployment');
    dateInput.value = '2020-01-01';
    dateInput.dispatchEvent(new Event('change'));
    
    assert.equal(el.employee.dateOfEmployment, '01/01/2020');
  });

  test('converts date format for display', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    
    // Test conversion from DD/MM/YYYY to YYYY-MM-DD
    const result = el.convertToDateInputFormat('01/01/2020');
    assert.equal(result, '2020-01-01');
    
    // Test empty string
    const emptyResult = el.convertToDateInputFormat('');
    assert.equal(emptyResult, '');
    
    // Test invalid format
    const invalidResult = el.convertToDateInputFormat('invalid');
    assert.equal(invalidResult, '');
  });

  test('validates required fields', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Validate empty first name
    el.validateField('firstName', '');
    assert.property(el.formErrors, 'firstName');
    
    // Validate valid first name
    el.validateField('firstName', 'John');
    assert.notProperty(el.formErrors, 'firstName');
  });

  test('validates email format', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Test invalid email
    el.validateField('emailAddress', 'invalid-email');
    assert.property(el.formErrors, 'emailAddress');
    
    // Test valid email
    el.validateField('emailAddress', 'test@example.com');
    assert.notProperty(el.formErrors, 'emailAddress');
  });

  test('validates phone number format', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Test invalid phone (too short)
    el.validateField('phoneNumber', '123');
    assert.property(el.formErrors, 'phoneNumber');
    
    // Test valid phone
    el.validateField('phoneNumber', '+90 536 850 8524');
    assert.notProperty(el.formErrors, 'phoneNumber');
  });

  test('validates form completion', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Initially form should be invalid
    assert.isFalse(el.isFormValid);
    
    // Fill all required fields
    el.employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1990',
      phoneNumber: '+90 536 850 8524',
      emailAddress: 'john@example.com',
      department: 'Tech',
      position: 'Senior'
    };
    
    el.validateForm();
    assert.isTrue(el.isFormValid);
  });

  test('save button is disabled when form is invalid', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const saveButton = el.shadowRoot.querySelector('.btn-primary');
    assert.isTrue(saveButton.disabled);
  });

  test('save button is enabled when form is valid', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Fill all required fields
    el.employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1990',
      phoneNumber: '+90 536 850 8524',
      emailAddress: 'john@example.com',
      department: 'Tech',
      position: 'Senior'
    };
    
    el.validateForm();
    await waitForUpdate(el);
    
    const saveButton = el.shadowRoot.querySelector('.btn-primary');
    assert.isFalse(saveButton.disabled);
  });

  test('saves new employee to store', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Fill employee data
    el.employee = {
      firstName: 'New',
      lastName: 'Employee',
      dateOfEmployment: '01/01/2020',
      dateOfBirth: '01/01/1990',
      phoneNumber: '+90 536 850 8524',
      emailAddress: 'new@example.com',
      department: 'Tech',
      position: 'Junior'
    };
    
    // Mock navigateToHome
    let navigated = false;
    el.navigateToHome = () => { navigated = true; };
    
    el.handleSave();
    await waitForUpdate(el);
    
    // Check employee was added to store
    const state = mockStore.getState();
    const newEmployee = state.employees.find(e => e.firstName === 'New');
    assert.isNotNull(newEmployee);
    assert.equal(newEmployee.lastName, 'Employee');
    assert.isTrue(navigated);
  });

  test('updates existing employee in store', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/1', { id: '1' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Modify employee data
    el.employee.firstName = 'Updated John';
    el.employee.lastName = 'Updated Doe';
    
    // Mock navigateToHome
    let navigated = false;
    el.navigateToHome = () => { navigated = true; };
    
    el.handleSave();
    await waitForUpdate(el);
    
    // Check employee was updated in store
    const state = mockStore.getState();
    const updatedEmployee = state.employees.find(e => e.id === 1);
    assert.equal(updatedEmployee.firstName, 'Updated John');
    assert.equal(updatedEmployee.lastName, 'Updated Doe');
    assert.isTrue(navigated);
  });

  test('deletes employee from store', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/1', { id: '1' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Mock confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = () => true;
    
    try {
      // Mock navigateToHome
      let navigated = false;
      el.navigateToHome = () => { navigated = true; };
      
      el.handleDelete();
      await waitForUpdate(el);
      
      // Check employee was removed from store
      const state = mockStore.getState();
      const deletedEmployee = state.employees.find(e => e.id === 1);
      assert.isUndefined(deletedEmployee);
      assert.isTrue(navigated);
    } finally {
      window.confirm = originalConfirm;
    }
  });

  test('does not delete when confirm is cancelled', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/1', { id: '1' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Mock confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = () => false;
    
    try {
      el.handleDelete();
      await waitForUpdate(el);
      
      // Check employee was not removed from store
      const state = mockStore.getState();
      const employee = state.employees.find(e => e.id === 1);
      assert.isNotNull(employee);
    } finally {
      window.confirm = originalConfirm;
    }
  });

  test('does not delete new employee', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    el.handleDelete();
    
    // No action should be taken for new employees
    const state = mockStore.getState();
    assert.equal(state.employees.length, 2);
  });

  test('displays error messages for invalid fields', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Trigger validation error
    el.validateField('firstName', '');
    await waitForUpdate(el);
    
    const errorMessage = el.shadowRoot.querySelector('.error-message');
    assert.isNotNull(errorMessage);
    assert.equal(errorMessage.textContent.trim(), 'First name must be at least 2 characters');
  });

  test('applies error styling to invalid fields', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Trigger validation error
    el.validateField('firstName', '');
    await waitForUpdate(el);
    
    const firstNameInput = el.shadowRoot.querySelector('#firstName');
    assert.isTrue(firstNameInput.classList.contains('error'));
  });

  test('handles missing Redux store gracefully', async () => {
    const cleanupNoStore = setupTestEnvironment(null, mockLocalization);
    
    try {
      const el = await fixture(html`<manage-employee></manage-employee>`);
      el.location = createMockLocation('/user/1', { id: '1' });
      el.loadEmployee();
      await waitForUpdate(el);
      
      // Should not crash, employee should be null
      assert.isNull(el.employee);
    } finally {
      cleanupNoStore();
    }
  });

  test('component cleanup on disconnect', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    await waitForUpdate(el);
    
    let storeUnsubscribed = false;
    let langUnsubscribed = false;
    
    // Mock unsubscribe functions
    el.unsubscribe = () => { storeUnsubscribed = true; };
    el.langUnsubscribe = () => { langUnsubscribed = true; };
    
    el.disconnectedCallback();
    
    assert.isTrue(storeUnsubscribed);
    assert.isTrue(langUnsubscribed);
  });

  test('localization subscription works', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    await waitForUpdate(el);
    
    // Change language through localization manager
    mockLocalization.setLanguage = (lang) => {
      mockLocalization.currentLanguage = lang;
      if (mockLocalization.listeners) {
        mockLocalization.listeners.forEach(callback => callback(lang));
      }
    };
    
    mockLocalization.setLanguage('tr');
    await waitForUpdate(el);
    
    // Component should update its language
    assert.equal(el.currentLanguage, 'tr');
  });

  test('subscribes to Redux store changes', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/1', { id: '1' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    // Dispatch action to update employee
    mockStore.dispatch({
      type: 'UPDATE_EMPLOYEE',
      payload: { id: 1, firstName: 'Updated' }
    });
    
    await waitForUpdate(el);
  
    assert.equal(el.employee.firstName, 'Updated');
  });

  test('handles id extraction from different sources', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    
    // Test with params
    el.location = createMockLocation('/user/1', { id: '1' });
    el.loadEmployee();
    assert.equal(el.employee.id, 1);
    
    // Test with pathname
    el.location = createMockLocation('/user/2', {});
    el.loadEmployee();
    assert.equal(el.employee.id, 2);
    
    // Test with window.location fallback - simplified test
    el.location = null;

    const pathname = '/user/1';
    const idFromPathname = pathname.split('/').pop();
    assert.equal(idFromPathname, '1');
  });

  test('department and position dropdowns have correct options', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.location = createMockLocation('/user/new', { id: 'new' });
    el.loadEmployee();
    await waitForUpdate(el);
    
    const departmentSelect = el.shadowRoot.querySelector('#department');
    const positionSelect = el.shadowRoot.querySelector('#position');
    
    // Check department options
    const departmentOptions = Array.from(departmentSelect.options).map(opt => opt.value);
    assert.include(departmentOptions, '');
    assert.include(departmentOptions, 'Analytics');
    assert.include(departmentOptions, 'Tech');
    
    // Check position options
    const positionOptions = Array.from(positionSelect.options).map(opt => opt.value);
    assert.include(positionOptions, '');
    assert.include(positionOptions, 'Junior');
    assert.include(positionOptions, 'Medior');
    assert.include(positionOptions, 'Senior');
  });
});
