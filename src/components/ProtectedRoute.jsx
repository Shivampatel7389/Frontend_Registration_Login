import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Verifying security session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving intended path in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
