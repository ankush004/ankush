export interface User {
    name: string;
    email: string;
    password: string;
  }
  
  export interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }
  