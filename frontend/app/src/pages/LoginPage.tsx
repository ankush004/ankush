import React, { useState } from 'react';
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
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
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
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await axios.post("http://localhost:5000/api/login", formData);
        
        console.log("Login Success:", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        navigate("/home");
      } catch (error: any) {
        console.error("Login Error:", error.response?.data?.message || error.message);
        setErrorMessage(error.response?.data?.message || "Invalid login credentials");
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const renderField = (
    id: keyof LoginFormData, 
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
      {id === 'password' && <a href="/forgot-password" className="forgot-password">Forgot Password?</a>}
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">Log In</h2>
        
        {errorMessage && (
          <div className="error-message-container">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderField('email', 'Email Address', 'email')}
          {renderField('password', 'Password', 'password')}
          
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="form-footer">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;