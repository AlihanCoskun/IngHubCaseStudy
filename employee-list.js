import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './localization.js';

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    currentPage: { type: Number },
    employeesPerPage: { type: Number },
    totalPages: { type: Number },
    viewMode: { type: String },
    currentLanguage: { type: String }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      max-width: 100%;
      overflow-x: hidden;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      padding: 0 4rem 0 4rem;
      max-width: 100%;
      box-sizing: border-box;
    }
    
    .list-title {
      color: #FE6C10;
    }

    .list-type-selection {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
    }

    .employee-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1rem;
      justify-items: center;
      height: 100%;
    }
    
   .employee-card {
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1rem;
      background: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      width: 100%;
      max-width: 550px;
      max-height: 20rem;
      box-sizing: border-box;
    }

    
    .employee-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
    
    .employee-info {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    
    .info-item {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    
    .info-label {
      font-size: 1rem;
      color: #666;
      margin-bottom: 0.25rem;
      font-weight: 500;
    }
    
    .info-value {
      font-size: 1.2rem;
      color: #333;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      display: block;
      min-width: 0;
    }

    
    .card-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-start;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .edit-btn {
      background: #525099;
      color: white;
    }
    
    .edit-btn:hover {
      background: #7C3AED;
    }
    
    .delete-btn {
      background: #FF6200;
      color: white;
    }
    
    .delete-btn:hover {
      background: #D97706;
    }
    
    .icon {
      font-size: 0.9rem;
    }
    
    .add-employee-btn:hover {
      background: #0056b3;
    }
    
    .employee-link {
      color: #007bff;
      text-decoration: none;
    }
    
    .employee-link:hover {
      text-decoration: underline;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 2rem;
      gap: 0.5rem;
    }
    
    .pagination button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    
    .pagination button:hover:not(:disabled) {
      background: #f8f9fa;
    }
    
    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .pagination button.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    .pagination-info {
      margin: 0 1rem;
      font-size: 0.9rem;
      color: #666;
    }
    
    .page-numbers {
      display: flex;
      gap: 0.25rem;
    }
    
    .page-numbers button {
      min-width: 2rem;
      padding: 0.5rem;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      max-width: 100%;
      overflow-x: hidden;
      height: 100%;
    }

    .content-area {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .pointer {
      cursor: pointer
    }

    .icon-button {
      background: inherit;
      border: none;
    }

    /* Table View Styles */
    .table-container {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      margin-top: 1rem;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
    }

    .employee-table {
      width: 100%;
      min-width: 800px;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .employee-table th {
      color: #FE6C10;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .employee-table td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      font-size: 0.9rem;
    }

    .employee-table tr:hover {
      background: #f8f9fa;
    }

    .employee-table tr:last-child td {
      border-bottom: none;
    }

    .table-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .table-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .table-action-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .table-action-btn:hover {
      background: #f0f0f0;
    }

    .table-action-btn img {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 768px) {
      .employee-grid { 
        grid-template-columns: repeat(1, 1fr);
      }
      
      .list-header {
        padding: 0 1rem;
      }
      
      .table-container {
        margin-left: 0;
        margin-right: 0;
        padding: 0;
      }
      
      .employee-table {
        font-size: 0.8rem;
        min-width: 600px;
      }
      
      .employee-table th,
      .employee-table td {
        padding: 0.5rem 0.25rem;
        white-space: nowrap;
      }
      
      .employee-table th:first-child,
      .employee-table td:first-child {
        position: sticky;
        left: 0;
        background: white;
        z-index: 1;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.currentPage = 1;
    this.employeesPerPage = 4; // Default for grid view
    this.totalPages = 1;
    this.viewMode = 'grid'; // 'grid' or 'table'
    this.currentLanguage = 'en';
    this.unsubscribe = null;
    this.langUnsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.currentLanguage = window.localizationManager.getCurrentLanguage();
    this.langUnsubscribe = window.localizationManager.subscribe((language) => {
      this.currentLanguage = language;
    });
    this.loadEmployees();
    this.subscribeToStore();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.langUnsubscribe) {
      this.langUnsubscribe();
    }
  }

  subscribeToStore() {
    if (window.__REDUX_STORE__) {
      this.unsubscribe = window.__REDUX_STORE__.subscribe(() => {
        this.loadEmployees();
      });
    }
  }

  loadEmployees() {
    if (window.__REDUX_STORE__) {
      const state = window.__REDUX_STORE__.getState();
      this.employees = state.employees || [];
      this.employeesPerPage = this.getEmployeesPerPage();
      this.calculateTotalPages();
    }
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.employees.length / this.employeesPerPage);
    // Reset to page 1 if current page is beyond total pages
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }

  getCurrentPageEmployees() {
    const startIndex = (this.currentPage - 1) * this.employeesPerPage;
    const endIndex = startIndex + this.employeesPerPage;
    return this.employees.slice(startIndex, endIndex);
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getPageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  editEmployee(id) {
    Router.go(`/user/${id}`);
  }

  deleteEmployee(id) {
    if (confirm(window.localizationManager.translate('confirmDelete'))) {
      if (window.__REDUX_STORE__) {
        window.__REDUX_STORE__.dispatch({
          type: 'DELETE_EMPLOYEE',
          payload: id
        });
      }
    }
  }

  getEmployeesPerPage() {
    return this.viewMode === 'table' ? 9 : 4;
  }

  toggleViewMode(mode) {
    this.viewMode = mode;
    this.employeesPerPage = this.getEmployeesPerPage();
    this.calculateTotalPages();
    // Reset to page 1 when switching views
    this.currentPage = 1;
  }

  handleSelectAll(e) {
    const isChecked = e.target.checked;
    const checkboxes = this.shadowRoot.querySelectorAll('.employee-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });
  }

  handleEmployeeCheckbox() {
    // For now, this doesn't do anything as requested
    // In the future, this could be used to track selected employees
  }

  render() {
    const currentPageEmployees = this.getCurrentPageEmployees();
    const pageNumbers = this.getPageNumbers();
    
    return html`
    <div class="wrapper">
      <div class="content-area">
        <div class="list-header">
          <h2 class="list-title">${window.localizationManager.translate('employeeList')}</h2>
          <div class="list-type-selection">
            <button class="icon-button" @click="${() => this.toggleViewMode('table')}">
              <img class="pointer" src="icons/bars.svg" alt="table-view" width="24px" height="24px">
            </button>
            <button class="icon-button" @click="${() => this.toggleViewMode('grid')}">
              <img class="pointer" src="icons/grid.svg" alt="grid-view" width="24px" height="24px">
            </button>
          </div>
        </div>
     
      
      ${this.viewMode === 'table' ? html`
        <div class="table-container">
          <table class="employee-table">
            <thead>
              <tr>
                <th><input type="checkbox" class="table-checkbox" @change="${this.handleSelectAll}"></th>
                <th>${window.localizationManager.translate('firstName')}</th>
                <th>${window.localizationManager.translate('lastName')}</th>
                <th>${window.localizationManager.translate('dateOfEmployment')}</th>
                <th>${window.localizationManager.translate('dateOfBirth')}</th>
                <th>${window.localizationManager.translate('phone')}</th>
                <th>${window.localizationManager.translate('email')}</th>
                <th>${window.localizationManager.translate('department')}</th>
                <th>${window.localizationManager.translate('position')}</th>
                <th>${window.localizationManager.translate('actions')}</th>
              </tr>
            </thead>
            <tbody>
              ${currentPageEmployees.map(employee => html`
                <tr>
                  <td><input type="checkbox" class="table-checkbox employee-checkbox" @change="${this.handleEmployeeCheckbox}"></td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${employee.dateOfEmployment}</td>
                  <td>${employee.dateOfBirth}</td>
                  <td>${employee.phoneNumber}</td>
                  <td>${employee.emailAddress}</td>
                  <td>${employee.department}</td>
                  <td>${employee.position}</td>
                  <td>
                    <div class="table-actions">
                      <button class="table-action-btn" @click="${() => this.editEmployee(employee.id)}" title="Edit">
                        <img src="icons/edit.svg" alt="Edit">
                      </button>
                      <button class="table-action-btn" @click="${() => this.deleteEmployee(employee.id)}" title="Delete">
                        <img src="icons/delete.svg" alt="Delete">
                      </button>
                    </div>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      ` : html`
        <div class="employee-grid">
          ${currentPageEmployees.map(employee => html`
            <div class="employee-card">
              <div class="employee-info">
                <div class="info-item">
                  <span class="info-label">${window.localizationManager.translate('firstName')}:</span>
                  <span class="info-value" title="${employee.firstName}">${employee.firstName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${window.localizationManager.translate('lastName')}:</span>
                  <span class="info-value" title="${employee.lastName}">${employee.lastName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${window.localizationManager.translate('dateOfEmployment')}:</span>
                  <span class="info-value" title="${employee.dateOfEmployment}">${employee.dateOfEmployment}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${window.localizationManager.translate('dateOfBirth')}:</span>
                  <span class="info-value" title="${employee.dateOfBirth}">${employee.dateOfBirth}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${window.localizationManager.translate('phone')}:</span>
                  <span class="info-value" title="${employee.phoneNumber}">${employee.phoneNumber}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${window.localizationManager.translate('email')}:</span>
                  <span class="info-value" title="${employee.emailAddress}">${employee.emailAddress}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${window.localizationManager.translate('department')}:</span>
                  <span class="info-value" title="${employee.department}">${employee.department}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">${window.localizationManager.translate('position')}:</span>
                  <span class="info-value" title="${employee.position}">${employee.position}</span>
                </div>
              </div>
              
              <div class="card-actions">
                <button class="action-btn edit-btn" @click="${() => this.editEmployee(employee.id)}">
                  <span class="icon">✏️</span>
                  ${window.localizationManager.translate('edit')}
                </button>
                <button class="action-btn delete-btn" @click="${() => this.deleteEmployee(employee.id)}">
                  <span class="icon">🗑️</span>
                  ${window.localizationManager.translate('delete')}
                </button>
              </div>
            </div>
          `)}
        </div>
      `}
      </div>
      
      ${this.totalPages > 1 ? html`
        <div class="pagination">
          <button 
            @click="${this.goToPreviousPage}" 
            ?disabled="${this.currentPage === 1}"
          >
            ${window.localizationManager.translate('previous')}
          </button>
          
          <div class="page-numbers">
            ${pageNumbers.map(page => html`
              <button 
                @click="${() => this.goToPage(page)}"
                class="${page === this.currentPage ? 'active' : ''}"
              >
                ${page}
              </button>
            `)}
          </div>
          
          <button 
            @click="${this.goToNextPage}" 
            ?disabled="${this.currentPage === this.totalPages}"
          >
            ${window.localizationManager.translate('next')}
          </button>
          
          <div class="pagination-info">
            ${window.localizationManager.translate('page')} ${this.currentPage} ${window.localizationManager.translate('of')} ${this.totalPages}
          </div>
        </div>
      ` : ''}
    </div>
  
    `;
  }
}

customElements.define('employee-list', EmployeeList);

export { EmployeeList };
