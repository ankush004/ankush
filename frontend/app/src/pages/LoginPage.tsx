import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

// Add these types if they don't exist in your types file
interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeField, setActiveField] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  // Define API URL - use import.meta.env for Vite or properly access environment variables
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
    setErrors(prevErrors => ({ ...prevErrors, [name as keyof FormErrors]: '' }));
    }
    
    // Clear global error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Shake animation for form when errors occur
      const form = document.querySelector('.auth-form-container');
      form?.classList.add('shake');
      setTimeout(() => {
        form?.classList.remove('shake');
      }, 500);
      
      return; // Stop execution here if there are validation errors
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/login`, formData);
      
      console.log("Login Success:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Add a small delay to show the loading state before navigating
      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (error: any) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || "Invalid login credentials");
      setIsSubmitting(false);
      
      // Shake animation for form when login fails
      const form = document.querySelector('.auth-form-container');
      form?.classList.add('shake');
      setTimeout(() => {
        form?.classList.remove('shake');
      }, 500);
    }
  };

  const getProgressBarWidth = (): number => {
    const fields = ['email', 'password'];
    const filledFields = fields.filter(field => !!formData[field as keyof LoginFormData]);
    return (filledFields.length / fields.length) * 100;
  };

  const renderField = (
    id: keyof LoginFormData, 
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
        autoComplete={id === 'password' ? 'current-password' : 'on'}
      />
      {errors[id] && (
        <p className="error-message">
          <span className="error-icon">⚠️</span> {errors[id]}
        </p>
      )}
      {id === 'password' && (
        <a href="/forgot-password" className="forgot-password accent-link">
          Forgot Password?
        </a>
      )}
    </div>
  );

  return (
    <div className="auth-page">
      <div className={`auth-container ${animationComplete ? 'visible' : ''}`}>
        <div className="auth-form-container">
          <div className="form-header">
            <h2 className="auth-title">Log In</h2>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${getProgressBarWidth()}%` }}></div>
            </div>
          </div>
          
          {errorMessage && (
            <div className="error-message-container">
              <span className="error-icon">⚠️</span> {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {renderField('email', 'Email Address', 'email', '✉️')}
            {renderField('password', 'Password', 'password', '🔒')}
            
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
                'Log In'
              )}
            </button>
          </form>
          
          <div className="form-footer">
            <p>Don't have an account? <a href="/signup" className="accent-link">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;