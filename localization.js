// Localization utility for Turkish and English support
class LocalizationManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {
      en: {
        // Layout translations
        'employees': 'Employees',
        'addNew': 'Add New',
        
        // Employee List translations
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
        
        // Manage Employee translations
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
        'validPhoneRequired': 'Please enter a valid phone number (only +, (, ), spaces, and digits 0-9 allowed)',
        'fieldRequired': 'This field is required',
        'backToEmployeeListLink': '← Back to Employee List'
      },
      tr: {
        // Layout translations
        'employees': 'Çalışanlar',
        'addNew': 'Yeni Ekle',
        
        // Employee List translations
        'employeeList': 'Çalışan Listesi',
        'firstName': 'Ad',
        'lastName': 'Soyad',
        'dateOfEmployment': 'İşe Giriş Tarihi',
        'dateOfBirth': 'Doğum Tarihi',
        'phone': 'Telefon',
        'email': 'E-posta',
        'department': 'Departman',
        'position': 'Pozisyon',
        'actions': 'İşlemler',
        'edit': 'Düzenle',
        'delete': 'Sil',
        'previous': 'Önceki',
        'next': 'Sonraki',
        'page': 'Sayfa',
        'of': '/',
        'employeeNotFound': 'Çalışan bulunamadı',
        'employeeNotFoundMessage': 'Aradığınız çalışan mevcut değil.',
        'backToEmployeeList': 'Çalışan Listesine Dön',
        'confirmDelete': 'Bu çalışanı silmek istediğinizden emin misiniz?',
        
        // Manage Employee translations
        'addNewEmployee': 'Yeni Çalışan Ekle',
        'editEmployee': 'Çalışan Düzenle',
        'firstNameLabel': 'Ad:',
        'lastNameLabel': 'Soyad:',
        'dateOfEmploymentLabel': 'İşe Giriş Tarihi:',
        'dateOfBirthLabel': 'Doğum Tarihi:',
        'phoneNumberLabel': 'Telefon Numarası:',
        'emailAddressLabel': 'E-posta Adresi:',
        'departmentLabel': 'Departman:',
        'positionLabel': 'Pozisyon:',
        'selectDepartment': 'Departman Seçin',
        'selectPosition': 'Pozisyon Seçin',
        'analytics': 'Analitik',
        'tech': 'Teknoloji',
        'junior': 'Junior',
        'medior': 'Medior',
        'senior': 'Senior',
        'save': 'Kaydet',
        'cancel': 'İptal',
        'firstNameRequired': 'Ad en az 2 karakter olmalıdır',
        'lastNameRequired': 'Soyad en az 2 karakter olmalıdır',
        'validEmailRequired': 'Lütfen geçerli bir e-posta adresi girin',
        'validPhoneRequired': 'Lütfen geçerli bir telefon numarası girin (sadece +, (, ), boşluk ve 0-9 rakamlarına izin verilir)',
        'fieldRequired': 'Bu alan zorunludur',
        'backToEmployeeListLink': '← Çalışan Listesine Dön'
      }
    };
    
    this.listeners = [];
    this.init();
  }
  
  init() {
    // Get initial language from HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang && (htmlLang === 'tr' || htmlLang === 'en')) {
      this.currentLanguage = htmlLang;
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
  }
  
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      document.documentElement.lang = language;
      this.notifyListeners();
    }
  }
  
  translate(key) {
    return this.translations[this.currentLanguage][key] || key;
  }
  
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }
  
  toggleLanguage() {
    const newLanguage = this.currentLanguage === 'en' ? 'tr' : 'en';
    this.setLanguage(newLanguage);
    return newLanguage;
  }
}

// Create global instance
window.localizationManager = new LocalizationManager();

// Export for module usage
export default window.localizationManager;
