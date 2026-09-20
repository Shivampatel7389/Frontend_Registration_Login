import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const from = location.state?.from?.pathname || '/home';

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
    if (!formData.name.trim()) {
      newErrors.name = 'User Name is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await login({
        name: formData.name.trim(),
        password: formData.password
      });

      // Redirect to /home or intended destination
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="main-content">
      <div className="auth-card">
        <div className="auth-header">
          <div className="framer-pill-badge">
            <span className="badge-dot"></span>
            <span>SECURE ACCESS PORTAL</span>
          </div>
          <h1 className="gradient-heading">Welcome Back</h1>
          <p>Sign in with your credentials to access your protected workspace</p>
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
            <label className="form-label" htmlFor="login-name">User Name</label>
            <div className="input-wrapper">
              <span className="input-icon"><User size={18} /></span>
              <input
                id="login-name"
                name="name"
                type="text"
                placeholder="Enter your username"
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

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><Lock size={18} /></span>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <span className="error-hint">
                <AlertCircle size={14} />{errors.password}
              </span>
            )}
          </div>

          {/* Login Button */}
          <button
            id="login-submit-button"
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/signup">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
