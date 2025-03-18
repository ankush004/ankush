import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Animation effect when component mounts
    setTimeout(() => {
      setAnimationComplete(true);
    }, 300);

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${animationComplete ? 'visible' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔍</span>
          <span className="brand-text">Deepfake</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/login" className="navbar-link">
            <span className="link-icon">🔑</span>
            <span className="link-text">Login</span>
          </Link>
          
          <Link to="/signup" className="navbar-button">
            <span className="button-text">Sign Up</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;