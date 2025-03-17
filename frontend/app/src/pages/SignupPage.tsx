import React, { useState } from 'react';
import { SignupFormData, FormErrors } from '../types';
import '../styles/auth.css';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const newErrors = validateForm();
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:5000/api/signup", formData);
        console.log("Signup Success:", response.data);
        setIsSubmitted(true);
        setErrors({});
      } catch (error: any) {
        console.error("Signup Error:", error.response?.data?.message || error.message);
        setErrors({ email: error.response?.data?.message || "Signup failed" });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const renderField = (
    id: keyof SignupFormData, 
    label: string, 
    type: string = 'text'
  ) => (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        className={`form-input ${errors[id] ? 'error' : ''}`}
      />
      {errors[id] && <p className="error-message">{errors[id]}</p>}
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <h2 className="auth-title">Registration Successful!</h2>
          <div className="success-message">
            Your account has been created. Please <a href="/login">login</a> to continue.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">Create an Account</h2>
        
        <form onSubmit={handleSubmit}>
          {renderField('name', 'Full Name')}
          {renderField('email', 'Email Address', 'email')}
          {renderField('password', 'Password', 'password')}
          {renderField('confirmPassword', 'Confirm Password', 'password')}
          
          <button
            type="submit"
            className="submit-button"
          >
            Sign Up
          </button>
        </form>
        
        <div className="form-footer">
          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;