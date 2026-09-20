import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Hash, ShieldCheck, LogOut, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../services/api';

export default function Home() {
  const { user, logout, showToast } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const data = await getCurrentUser();
      setProfile(data);
    } catch (err) {
      showToast('Failed to fetch profile details', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const username = profile?.name || user?.name || 'User';

  return (
    <main className="main-content">
      <div className="home-container">
        <div className="welcome-card">
          <div className="welcome-badge">
            <CheckCircle size={15} />
            <span>ACTIVE SESSION VERIFIED</span>
          </div>

          <h1 className="welcome-title">
            Welcome, <span className="gradient-accent-text">{username}</span>!
          </h1>
          <p className="welcome-subtitle">
            Your account is authenticated and securely protected. Session credentials are encrypted via HttpOnly JWT cookies.
          </p>

          {/* User Details Grid */}
          <div className="profile-grid">
            <div className="profile-item">
              <div className="profile-item-label">
                <Hash size={14} />
                <span>Account ID</span>
              </div>
              <div className="profile-item-value">#{profile?.id || '—'}</div>
            </div>

            <div className="profile-item">
              <div className="profile-item-label">
                <User size={14} />
                <span>Username</span>
              </div>
              <div className="profile-item-value">{profile?.name || username}</div>
            </div>

            <div className="profile-item">
              <div className="profile-item-label">
                <Mail size={14} />
                <span>Email Address</span>
              </div>
              <div className="profile-item-value">{profile?.email || '—'}</div>
            </div>

            <div className="profile-item">
              <div className="profile-item-label">
                <Phone size={14} />
                <span>Phone Number</span>
              </div>
              <div className="profile-item-value">{profile?.phone || '—'}</div>
            </div>
          </div>

          {/* Security & HttpOnly Protection Banner */}
          <div className="security-panel">
            <div className="security-info">
              <div className="security-icon">
                <ShieldCheck size={22} strokeWidth={2.2} />
              </div>
              <div className="security-text">
                <h4>HttpOnly Cookie Protection Active</h4>
                <p>Tokens are secured against client-side script inspection (XSS immunity).</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                className="btn-secondary"
                onClick={fetchProfile}
                disabled={loadingProfile}
                title="Refresh Profile"
              >
                <RefreshCw size={15} className={loadingProfile ? 'spin' : ''} />
                <span>Refresh</span>
              </button>

              <button
                className="btn-secondary btn-danger-outline"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
