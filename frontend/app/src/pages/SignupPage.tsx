import React, { useState, useEffect } from 'react';
import { SignupFormData, FormErrors } from '../types';
import '../styles/auth.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);

  // Define API URL using import.meta.env for Vite
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Animation effect when component mounts
    setTimeout(() => {
      setAnimationComplete(true);
    }, 300);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (field: string): void => {
    setActiveField(field);
  };

  const handleBlur = (): void => {
    setActiveField(null);
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
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Shake animation for form when errors occur
      const form = document.querySelector('.auth-form-container');
      form?.classList.add('shake');
      setTimeout(() => {
        form?.classList.remove('shake');
      }, 500);
      
      return; // Stop execution if there are validation errors
    }
    
    setIsSubmitting(true); // Show loading state
    
    try {
      const response = await axios.post(`${API_URL}/api/signup`, formData);
      console.log("Signup Success:", response.data);
      setIsSubmitted(true);
      setErrors({});
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data?.message || error.message);
      setErrors({ email: error.response?.data?.message || "Signup failed" });
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const renderField = (
    id: keyof SignupFormData, 
    label: string, 
    type: string = 'text',
    icon: string = '✉️'
  ) => (
    <div className={`form-group ${activeField === id ? 'active' : ''}`}>
      <label className="form-label" htmlFor={id}>
        <span className="icon">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        onFocus={() => handleFocus(id)}
        onBlur={handleBlur}
        className={`form-input ${errors[id] ? 'error' : ''} ${formData[id] ? 'filled' : ''}`}
        autoComplete={id === 'password' || id === 'confirmPassword' ? 'new-password' : 'on'}
      />
      {errors[id] && (
        <p className="error-message">
          <span className="error-icon">⚠️</span> {errors[id]}
        </p>
      )}
    </div>
  );

  const getProgressBarWidth = (): number => {
    const fields = ['name', 'email', 'password', 'confirmPassword'];
    const filledFields = fields.filter(field => !!formData[field as keyof SignupFormData]);
    return (filledFields.length / fields.length) * 100;
  };

  if (isSubmitted) {
    return (
      <div className="auth-page">
        <div className="auth-container success-container">
          <div className="auth-form-container success-animation">
            <div className="success-icon">✅</div>
            <h2 className="auth-title">Registration Successful!</h2>
            <div className="success-message">
              Your account has been created. Please <Link to="/login" className="accent-link">login</Link>to continue.
            </div>
            <div className="confetti"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className={`auth-container ${animationComplete ? 'visible' : ''}`}>
        <div className="auth-form-container">
          <div className="form-header">
            <h2 className="auth-title">Create an Account</h2>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${getProgressBarWidth()}%` }}></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {renderField('name', 'Full Name', 'text', '👤')}
            {renderField('email', 'Email Address', 'email', '✉️')}
            {renderField('password', 'Password', 'password', '🔒')}
            {renderField('confirmPassword', 'Confirm Password', 'password', '🔐')}
            
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading-text">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          
          <div className="form-footer">
            <p>Already have an account? <Link to="/login" className="accent-link">login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;