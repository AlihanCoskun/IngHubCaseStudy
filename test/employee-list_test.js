/**
 * Unit tests for employee-list.js component
 */

import { EmployeeList } from '../employee-list.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { 
  createMockReduxStore, 
  createMockLocalizationManager, 
  setupTestEnvironment,
  waitForUpdate 
} from './test-utils.js';

suite('employee-list', () => {
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
    const el = document.createElement('employee-list');
    assert.instanceOf(el, EmployeeList);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    assert.equal(el.employees.length, 2);
    assert.equal(el.currentPage, 1);
    assert.equal(el.viewMode, 'grid');
    assert.equal(el.currentLanguage, 'en');
  });

  test('loads employees from Redux store', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    assert.equal(el.employees.length, 2);
    assert.equal(el.employees[0].firstName, 'John');
    assert.equal(el.employees[1].firstName, 'Jane');
  });

  test('displays employee list title', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    const title = el.shadowRoot.querySelector('.list-title');
    assert.isNotNull(title);
    assert.equal(title.textContent.trim(), 'Employee List');
  });

  test('renders grid view by default', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    const grid = el.shadowRoot.querySelector('.employee-grid');
    const table = el.shadowRoot.querySelector('.table-container');
    
    assert.isNotNull(grid);
    assert.isNull(table);
    assert.equal(el.viewMode, 'grid');
  });

  test('renders table view when toggled', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    // Toggle to table view
    el.toggleViewMode('table');
    await waitForUpdate(el);
    
    const grid = el.shadowRoot.querySelector('.employee-grid');
    const table = el.shadowRoot.querySelector('.table-container');
    
    assert.isNull(grid);
    assert.isNotNull(table);
    assert.equal(el.viewMode, 'table');
  });

  test('displays correct number of employees per page in grid view', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    const employeeCards = el.shadowRoot.querySelectorAll('.employee-card');
    assert.equal(employeeCards.length, 2); // All employees fit on one page
  });

  test('displays correct number of employees per page in table view', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    el.toggleViewMode('table');
    await waitForUpdate(el);
    
    const tableRows = el.shadowRoot.querySelectorAll('.employee-table tbody tr');
    assert.equal(tableRows.length, 2); // All employees fit on one page
  });

  test('calculates total pages correctly', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    // With 2 employees and 4 per page in grid view
    assert.equal(el.totalPages, 1);
    
    // Switch to table view (9 per page)
    el.toggleViewMode('table');
    await waitForUpdate(el);
    assert.equal(el.totalPages, 1);
  });

  test('pagination controls appear when needed', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    // With only 2 employees, no pagination should be shown
    const pagination = el.shadowRoot.querySelector('.pagination');
    assert.isNull(pagination);
  });

  test('employee cards display correct information', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    const employeeCards = el.shadowRoot.querySelectorAll('.employee-card');
    const firstCard = employeeCards[0];
    
    // Check that employee information is displayed
    const firstNameValue = firstCard.querySelector('.info-value');
    assert.isNotNull(firstNameValue);
    assert.equal(firstNameValue.textContent.trim(), 'John');
  });

  test('table view displays employee data correctly', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    el.toggleViewMode('table');
    await waitForUpdate(el);
    
    const tableRows = el.shadowRoot.querySelectorAll('.employee-table tbody tr');
    const firstRow = tableRows[0];
    const cells = firstRow.querySelectorAll('td');
    
    assert.equal(cells[1].textContent.trim(), 'John');
    assert.equal(cells[2].textContent.trim(), 'Doe');
    assert.equal(cells[3].textContent.trim(), '01/01/2020');
  });

  test('edit button calls editEmployee with correct id', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    let editCalled = false;
    let editId = null;
    el.editEmployee = (id) => {
      editCalled = true;
      editId = id;
    };
    
    const editButton = el.shadowRoot.querySelector('.edit-btn');
    assert.isNotNull(editButton);
    
    editButton.click();
    
    assert.isTrue(editCalled);
    assert.equal(editId, 1);
  });

  test('delete button shows delete dialog', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    const deleteButton = el.shadowRoot.querySelector('.delete-btn');
    assert.isNotNull(deleteButton);
    
    deleteButton.click();
    await waitForUpdate(el);
    
    // Check that dialog is shown
    assert.isTrue(el.showDeleteDialog);
    assert.isNotNull(el.employeeToDelete);
    assert.equal(el.employeeToDelete.id, 1);
    
    // Check that dialog is rendered
    const dialog = el.shadowRoot.querySelector('.dialog-overlay');
    assert.isNotNull(dialog);
  });

  test('delete employee removes from store', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    // Show delete dialog
    el.deleteEmployee(1);
    await waitForUpdate(el);
    
    // Confirm delete
    el.confirmDelete();
    await waitForUpdate(el);
    
    // Employee should be removed from store and component
    assert.equal(el.employees.length, 1);
    assert.equal(el.employees[0].id, 2);
    
    // Dialog should be closed
    assert.isFalse(el.showDeleteDialog);
    assert.isNull(el.employeeToDelete);
  });

  test('delete dialog can be closed', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    // Show delete dialog
    el.deleteEmployee(1);
    await waitForUpdate(el);
    
    assert.isTrue(el.showDeleteDialog);
    
    // Close dialog
    el.closeDeleteDialog();
    await waitForUpdate(el);
    
    assert.isFalse(el.showDeleteDialog);
    assert.isNull(el.employeeToDelete);
  });

  test('view mode toggle updates employees per page', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    assert.equal(el.employeesPerPage, 4); // Grid view
    
    el.toggleViewMode('table');
    await waitForUpdate(el);
    
    assert.equal(el.employeesPerPage, 9); // Table view
  });

  test('view mode toggle resets to page 1', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    // Set to page 2
    el.currentPage = 2;
    
    el.toggleViewMode('table');
    await waitForUpdate(el);
    
    assert.equal(el.currentPage, 1);
  });

  test('page navigation works correctly', async () => {
    // Create store with more employees to test pagination
    const storeWithManyEmployees = createMockReduxStore({
      employees: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        firstName: `Employee${i + 1}`,
        lastName: 'Test',
        dateOfEmployment: '01/01/2020',
        dateOfBirth: '01/01/1990',
        phoneNumber: '1234567890',
        emailAddress: `employee${i + 1}@test.com`,
        department: 'Tech',
        position: 'Junior'
      }))
    });
    
    const cleanupMany = setupTestEnvironment(storeWithManyEmployees, mockLocalization);
    
    try {
      const el = await fixture(html`<employee-list></employee-list>`);
      await waitForUpdate(el);
      
      assert.equal(el.totalPages, 3); // 10 employees, 4 per page = 3 pages
      
      // Test goToPage
      el.goToPage(2);
      assert.equal(el.currentPage, 2);
      
      // Test goToNextPage
      el.goToNextPage();
      assert.equal(el.currentPage, 3);
      
      // Test goToPreviousPage
      el.goToPreviousPage();
      assert.equal(el.currentPage, 2);
    } finally {
      cleanupMany();
    }
  });

  test('page numbers are calculated correctly', async () => {
    // Create store with many employees
    const storeWithManyEmployees = createMockReduxStore({
      employees: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        firstName: `Employee${i + 1}`,
        lastName: 'Test',
        dateOfEmployment: '01/01/2020',
        dateOfBirth: '01/01/1990',
        phoneNumber: '1234567890',
        emailAddress: `employee${i + 1}@test.com`,
        department: 'Tech',
        position: 'Junior'
      }))
    });
    
    const cleanupMany = setupTestEnvironment(storeWithManyEmployees, mockLocalization);
    
    try {
      const el = await fixture(html`<employee-list></employee-list>`);
      await waitForUpdate(el);
      
      const pageNumbers = el.getPageNumbers();
      assert.isArray(pageNumbers);
      assert.equal(pageNumbers.length, 4); // With 15 employees and 4 per page = 4 pages
      assert.include(pageNumbers, 1);
      assert.include(pageNumbers, el.currentPage);
    } finally {
      cleanupMany();
    }
  });

  test('select all checkbox functionality', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    el.toggleViewMode('table');
    await waitForUpdate(el);
    
    const selectAllCheckbox = el.shadowRoot.querySelector('thead .table-checkbox');
    const employeeCheckboxes = el.shadowRoot.querySelectorAll('.employee-checkbox');
    
    // Initially no checkboxes are checked
    employeeCheckboxes.forEach(checkbox => {
      assert.isFalse(checkbox.checked);
    });
    
    // Check select all
    selectAllCheckbox.checked = true;
    selectAllCheckbox.dispatchEvent(new Event('change'));
    
    // All employee checkboxes should be checked
    employeeCheckboxes.forEach(checkbox => {
      assert.isTrue(checkbox.checked);
    });
  });

  test('localization subscription works', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
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

  test('component cleanup on disconnect', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    await waitForUpdate(el);
    
    let storeUnsubscribed = false;
    let langUnsubscribed = false;
    
    // Mock unsubscribe functions
    el.unsubscribe = () => { storeUnsubscribed = true; };
    el.langUnsubscribe = () => { langUnsubscribed = true; };
    
    // Simulate disconnect
    el.disconnectedCallback();
    
    assert.isTrue(storeUnsubscribed);
    assert.isTrue(langUnsubscribed);
  });

  test('handles empty employee list', async () => {
    const emptyStore = createMockReduxStore({ employees: [] });
    const cleanupEmpty = setupTestEnvironment(emptyStore, mockLocalization);
    
    try {
      const el = await fixture(html`<employee-list></employee-list>`);
      await waitForUpdate(el);
      
      assert.equal(el.employees.length, 0);
      assert.equal(el.totalPages, 0); // With 0 employees, totalPages should be 0
      assert.equal(el.currentPage, 1);
      
      // Grid view should show no cards
      const employeeCards = el.shadowRoot.querySelectorAll('.employee-card');
      assert.equal(employeeCards.length, 0);
      
      // Table view should show no rows
      el.toggleViewMode('table');
      await waitForUpdate(el);
      
      const tableRows = el.shadowRoot.querySelectorAll('.employee-table tbody tr');
      assert.equal(tableRows.length, 0);
    } finally {
      cleanupEmpty();
    }
  });

  test('handles missing Redux store gracefully', async () => {
    const cleanupNoStore = setupTestEnvironment(null, mockLocalization);
    
    try {
      const el = await fixture(html`<employee-list></employee-list>`);
      await waitForUpdate(el);
      
      assert.equal(el.employees.length, 0);
      assert.isNotNull(el.shadowRoot.querySelector('.list-title'));
    } finally {
      cleanupNoStore();
    }
  });
});
