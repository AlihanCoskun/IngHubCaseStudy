import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    currentPage: { type: Number },
    employeesPerPage: { type: Number },
    totalPages: { type: Number }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    
    .list-title {
      color: #FE6C10;
    }

    .employee-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1rem;
      justify-items: center;
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
  `;

  constructor() {
    super();
    this.employees = [];
    this.currentPage = 1;
    this.employeesPerPage = 4; // 2 per line × 2 lines
    this.totalPages = 1;
    this.unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
    this.subscribeToStore();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
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
    if (confirm('Are you sure you want to delete this employee?')) {
      if (window.__REDUX_STORE__) {
        window.__REDUX_STORE__.dispatch({
          type: 'DELETE_EMPLOYEE',
          payload: id
        });
      }
    }
  }

  render() {
    const currentPageEmployees = this.getCurrentPageEmployees();
    const pageNumbers = this.getPageNumbers();
    
    return html`
      <h2 class="list-title">Employee List</h2>
      
      <div class="employee-grid">
        ${currentPageEmployees.map(employee => html`
          <div class="employee-card">
            <div class="employee-info">
              <div class="info-item">
                <span class="info-label">First Name:</span>
                <span class="info-value" title="${employee.firstName}">${employee.firstName}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Last Name:</span>
                <span class="info-value" title="${employee.lastName}">${employee.lastName}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date of Employment:</span>
                <span class="info-value" title="${employee.dateOfEmployment}">${employee.dateOfEmployment}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date of Birth:</span>
                <span class="info-value" title="${employee.dateOfBirth}">${employee.dateOfBirth}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value" title="${employee.phoneNumber}">${employee.phoneNumber}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value" title="${employee.emailAddress}">${employee.emailAddress}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Department:</span>
                <span class="info-value" title="${employee.department}">${employee.department}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Position:</span>
                <span class="info-value" title="${employee.position}">${employee.position}</span>
              </div>
            </div>
            
            <div class="card-actions">
              <button class="action-btn edit-btn" @click="${() => this.editEmployee(employee.id)}">
                <span class="icon">✏️</span>
                Edit
              </button>
              <button class="action-btn delete-btn" @click="${() => this.deleteEmployee(employee.id)}">
                <span class="icon">🗑️</span>
                Delete
              </button>
            </div>
          </div>
        `)}
      </div>
      
      ${this.totalPages > 1 ? html`
        <div class="pagination">
          <button 
            @click="${this.goToPreviousPage}" 
            ?disabled="${this.currentPage === 1}"
          >
            Previous
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
            Next
          </button>
          
          <div class="pagination-info">
            Page ${this.currentPage} of ${this.totalPages}
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
