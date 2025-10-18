import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './localization.js';

class ManageEmployee extends LitElement {
  static properties = {
    location: { type: Object },
    employee: { type: Object },
    isNew: { type: Boolean },
    formErrors: { type: Object },
    isFormValid: { type: Boolean },
    currentLanguage: { type: String }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .page-wrapper {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 2rem;
      background: #f8f9fa;
    }

    .list-title {
      color: #FE6C10;
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .form-container {
      background: white;
      padding: 2rem 8rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2rem;
      margin-bottom: 1rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    label {
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #333;
    }
    
    input, select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: auto;
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    input.error, select.error {
      border-color: #dc3545;
      box-shadow: 0 0 0 2px rgba(220,53,69,0.25);
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(42%) sepia(98%) saturate(741%) hue-rotate(359deg) brightness(105%) contrast(98%);
      cursor: pointer;
    }
    
    .btn-group {
      display: flex;
      gap: 4rem;
      justify-content: center;
      margin-top: 3rem;
    }
    
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      min-width: 10rem;
    }
    
    .btn-primary {
      background: #FF6200;
      color: white;
    }
    
    .btn-primary:hover {
      background: #e55a00;
    }
    
    .btn-secondary {
      background: #FFFFFF;
      color: #525099;
      border: 1px solid #525099;
    }
    
    .btn-secondary:hover {
      background: #f8f9fa
    }
    
    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      color: #007bff;
      text-decoration: none;
    }
    
    .back-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .form-grid {
       display: block;
      }
      
    }
  `;

  constructor() {
    super();
    this.location = null;
    this.employee = null;
    this.isNew = false;
    this.unsubscribe = null;
    this.langUnsubscribe = null;
    this.formErrors = {};
    this.isFormValid = false;
    this.currentLanguage = 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    this.currentLanguage = window.localizationManager.getCurrentLanguage();
    this.langUnsubscribe = window.localizationManager.subscribe((language) => {
      this.currentLanguage = language;
    });
    this.loadEmployee();
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
        this.loadEmployee();
      });
    }
  }

  loadEmployee() {
    // Try different ways to get the ID
    const idFromParams = this.location?.params?.id;
    const idFromPathname = this.location?.pathname?.split('/').pop();
    const idFromWindowPath = window.location.pathname.split('/').pop();
    const id = idFromParams || idFromPathname || idFromWindowPath;
    
    if (id === 'new') {
      this.isNew = true;
      this.employee = {
        firstName: '',
        lastName: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        phoneNumber: '',
        emailAddress: '',
        department: '',
        position: ''
      };
    } else if (id && !isNaN(parseInt(id))) {
      this.isNew = false;
      if (window.__REDUX_STORE__) {
        const state = window.__REDUX_STORE__.getState();
        this.employee = state.employees.find(emp => emp.id === parseInt(id)) || null;
      }
    } else {
      this.isNew = false;
      this.employee = null;
    }
    
    // Validate existing employee data
    if (this.employee) {
      this.validateForm();
    }
  }

  handleInputChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    this.employee = { ...this.employee, [field]: value };
    this.validateField(field, value);
  }

  handlePhoneInputChange(e) {
    const value = e.target.value;
    // Only allow +, (, ), spaces, and digits 0-9
    const filteredValue = value.replace(/[^+\s()0-9]/g, '');
    this.employee = { ...this.employee, phoneNumber: filteredValue };
    this.validateField('phoneNumber', filteredValue);
  }

  handleDateChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    
    // Convert from YYYY-MM-DD (HTML5 date input format) to DD/MM/YYYY
    if (value) {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      this.employee = { ...this.employee, [field]: formattedDate };
    } else {
      this.employee = { ...this.employee, [field]: '' };
    }
    this.validateField(field, this.employee[field]);
  }

  convertToDateInputFormat(dateString) {
    if (!dateString || !dateString.includes('/')) return '';
    
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  validateField(field, value) {
    const errors = { ...this.formErrors };
    
    switch (field) {
      case 'firstName':
        if (!value || value.trim().length < 2) {
          errors[field] = window.localizationManager.translate('firstNameRequired');
        } else {
          delete errors[field];
        }
        break;
        
      case 'lastName':
        if (!value || value.trim().length < 2) {
          errors[field] = window.localizationManager.translate('lastNameRequired');
        } else {
          delete errors[field];
        }
        break;
        
      case 'emailAddress': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          errors.emailAddress = window.localizationManager.translate('validEmailRequired');
        } else {
          delete errors.emailAddress;
        }
        break;
      }
        
      case 'phoneNumber': {
        // Phone number validation: allows +, (, ), spaces, and digits 0-9
        // Examples: +(90) 536850824, 05368508524, 5368508524, 0536 850 8524
        const phoneRegex = /^[+]?[()\s\d]+$/;
        const hasDigits = /\d/.test(value);
        const minLength = 7; // Minimum reasonable phone number length
        
        if (!value || !phoneRegex.test(value) || !hasDigits || value.replace(/[\s()+]/g, '').length < minLength) {
          errors.phoneNumber = window.localizationManager.translate('validPhoneRequired');
        } else {
          delete errors.phoneNumber;
        }
        break;
      }
        
      default:
        if (!value || value.trim() === '') {
          errors[field] = window.localizationManager.translate('fieldRequired');
        } else {
          delete errors[field];
        }
        break;
    }
    
    this.formErrors = errors;
    this.validateForm();
  }

  validateForm() {
    const requiredFields = ['firstName', 'lastName', 'dateOfEmployment', 'dateOfBirth', 'phoneNumber', 'emailAddress', 'department', 'position'];
    const hasErrors = Object.keys(this.formErrors).length > 0;
    const allRequiredFilled = requiredFields.every(field => 
      this.employee[field] && this.employee[field].trim() !== ''
    );
    
    this.isFormValid = !hasErrors && allRequiredFilled;
  }

  handleSave() {
    if (window.__REDUX_STORE__) {
      if (this.isNew) {
        window.__REDUX_STORE__.dispatch({
          type: 'ADD_EMPLOYEE',
          payload: this.employee
        });
      } else {
        window.__REDUX_STORE__.dispatch({
          type: 'UPDATE_EMPLOYEE',
          payload: { id: this.employee.id, ...this.employee }
        });
      }
      
      // Navigate back to employee list using router
      this.navigateToHome();
    }
  }

  handleDelete() {
    if (window.__REDUX_STORE__ && !this.isNew) {
      if (confirm(window.localizationManager.translate('confirmDelete'))) {
        window.__REDUX_STORE__.dispatch({
          type: 'DELETE_EMPLOYEE',
          payload: this.employee.id
        });
        
        // Navigate back to employee list using router
        this.navigateToHome();
      }
    }
  }

  navigateToHome() {
   Router.go("/");
  }

  render() {
    if (!this.employee && !this.isNew) {
      return html`
        <div class="page-wrapper">
          <a href="/" class="back-link">${window.localizationManager.translate('backToEmployeeListLink')}</a>
          <div class="form-container">
            <h2>${window.localizationManager.translate('employeeNotFound')}</h2>
            <p>${window.localizationManager.translate('employeeNotFoundMessage')}</p>
            <div class="btn-group">
              <button class="btn-secondary" @click="${this.navigateToHome}">
                ${window.localizationManager.translate('backToEmployeeList')}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return html`
        <h2 class="list-title">${this.isNew ? window.localizationManager.translate('addNewEmployee') : window.localizationManager.translate('editEmployee')}</h2>
        <div class="form-container">
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">${window.localizationManager.translate('firstNameLabel')}</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                .value="${this.employee.firstName}"
                @input="${this.handleInputChange}"
                class="${this.formErrors.firstName ? 'error' : ''}"
                required
              >
              ${this.formErrors.firstName ? html`<div class="error-message">${this.formErrors.firstName}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label for="lastName">${window.localizationManager.translate('lastNameLabel')}</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                .value="${this.employee.lastName}"
                @input="${this.handleInputChange}"
                class="${this.formErrors.lastName ? 'error' : ''}"
                required
              >
              ${this.formErrors.lastName ? html`<div class="error-message">${this.formErrors.lastName}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label for="dateOfEmployment">${window.localizationManager.translate('dateOfEmploymentLabel')}</label>
              <input 
                type="date" 
                id="dateOfEmployment" 
                name="dateOfEmployment" 
                .value="${this.convertToDateInputFormat(this.employee.dateOfEmployment)}"
                @change="${this.handleDateChange}"
                class="${this.formErrors.dateOfEmployment ? 'error' : ''}"
                required
              >
              ${this.formErrors.dateOfEmployment ? html`<div class="error-message">${this.formErrors.dateOfEmployment}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label for="dateOfBirth">${window.localizationManager.translate('dateOfBirthLabel')}</label>
              <input 
                type="date" 
                id="dateOfBirth" 
                name="dateOfBirth" 
                .value="${this.convertToDateInputFormat(this.employee.dateOfBirth)}"
                @change="${this.handleDateChange}"
                class="${this.formErrors.dateOfBirth ? 'error' : ''}"
                required
              >
              ${this.formErrors.dateOfBirth ? html`<div class="error-message">${this.formErrors.dateOfBirth}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label for="phoneNumber">${window.localizationManager.translate('phoneNumberLabel')}</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber" 
                .value="${this.employee.phoneNumber}"
                @input="${this.handlePhoneInputChange}"
                class="${this.formErrors.phoneNumber ? 'error' : ''}"
                required
              >
              ${this.formErrors.phoneNumber ? html`<div class="error-message">${this.formErrors.phoneNumber}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label for="emailAddress">${window.localizationManager.translate('emailAddressLabel')}</label>
              <input 
                type="email" 
                id="emailAddress" 
                name="emailAddress" 
                .value="${this.employee.emailAddress}"
                @input="${this.handleInputChange}"
                class="${this.formErrors.emailAddress ? 'error' : ''}"
                required
              >
              ${this.formErrors.emailAddress ? html`<div class="error-message">${this.formErrors.emailAddress}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label for="department">${window.localizationManager.translate('departmentLabel')}</label>
              <select 
                id="department" 
                name="department" 
                .value="${this.employee.department}"
                @change="${this.handleInputChange}"
                class="${this.formErrors.department ? 'error' : ''}"
                required
              >
                <option value="">${window.localizationManager.translate('selectDepartment')}</option>
                <option value="Analytics">${window.localizationManager.translate('analytics')}</option>
                <option value="Tech">${window.localizationManager.translate('tech')}</option>
              </select>
              ${this.formErrors.department ? html`<div class="error-message">${this.formErrors.department}</div>` : ''}
            </div>
            
            <div class="form-group">
              <label for="position">${window.localizationManager.translate('positionLabel')}</label>
              <select 
                id="position" 
                name="position" 
                .value="${this.employee.position}"
                @change="${this.handleInputChange}"
                class="${this.formErrors.position ? 'error' : ''}"
                required
              >
                <option value="">${window.localizationManager.translate('selectPosition')}</option>
                <option value="Junior">${window.localizationManager.translate('junior')}</option>
                <option value="Medior">${window.localizationManager.translate('medior')}</option>
                <option value="Senior">${window.localizationManager.translate('senior')}</option>
              </select>
              ${this.formErrors.position ? html`<div class="error-message">${this.formErrors.position}</div>` : ''}
            </div>
          </div>
          <div class="btn-group">
          <button class="btn-primary" @click="${this.handleSave}" ?disabled="${!this.isFormValid}">
            ${window.localizationManager.translate('save')}
          </button>
          
          <button class="btn-secondary" @click="${this.navigateToHome}">
            ${window.localizationManager.translate('cancel')}
          </button>
        </div>
        </div>
    `;
  }
}

customElements.define('manage-employee', ManageEmployee);

export { ManageEmployee };
