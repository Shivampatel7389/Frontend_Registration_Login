import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to={isAuthenticated ? "/home" : "/login"} className="navbar-brand">
        <div className="logo-icon">
          <ShieldCheck size={20} strokeWidth={2.4} />
        </div>
        <span>RegLog</span>
        <span className="brand-text-badge">PORTAL</span>
      </Link>

      <div className="navbar-user">
        {isAuthenticated && user ? (
          <>
            <div className="user-badge">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{user.name}</span>
            </div>
            <button className="btn-secondary" onClick={handleLogout} title="Sign Out">
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary-sm">
              <Sparkles size={14} style={{ marginRight: '5px' }} />
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
