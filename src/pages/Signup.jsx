import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Username validation
    if (!formData.name.trim()) {
      newErrors.name = 'User Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'User Name must be at least 2 characters';
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // 3. Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Phone Number must be a valid 10-digit number';
    }

    // 4. Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // 5. Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password
      });

      showToast(response.message || 'Registration successful! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="main-content">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="framer-pill-badge">
            <span className="badge-dot"></span>
            <span>NEW ACCOUNT REGISTRATION</span>
          </div>
          <h1 className="gradient-heading">Get Started</h1>
          <p>Create your credentials with enterprise-grade protection</p>
        </div>

        {serverError && (
          <div className="auth-alert" role="alert">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* User Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">User Name</label>
            <div className="input-wrapper">
              <span className="input-icon"><User size={18} /></span>
              <input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Choose a username"
                className={`form-input ${errors.name ? 'has-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
              />
            </div>
            {errors.name && (
              <span className="error-hint">
                <AlertCircle size={14} />{errors.name}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><Mail size={18} /></span>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="error-hint">
                <AlertCircle size={14} />{errors.email}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-phone">Phone Number</label>
            <div className="input-wrapper">
              <span className="input-icon"><Phone size={18} /></span>
              <input
                id="signup-phone"
                name="phone"
                type="tel"
                placeholder="10-digit phone number"
                className={`form-input ${errors.phone ? 'has-error' : ''}`}
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <span className="error-hint">
                <AlertCircle size={14} />{errors.phone}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><Lock size={18} /></span>
              <input
                id="signup-password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.password && (
              <span className="error-hint">
                <AlertCircle size={14} />{errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="signup-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><ShieldCheck size={18} /></span>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <span className="error-hint">
                <AlertCircle size={14} />{errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="signup-submit-button"
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
