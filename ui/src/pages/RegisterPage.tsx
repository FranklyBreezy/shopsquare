import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Section } from '../components/Layout';
import { Button, Input, Card } from '../components/UI';
import { api, RegisterRequest } from '../services/apiClient';
import { useUser } from '../state/UserContext';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const user = await api.users.register(formData);
      setSuccess(true);
      
      // Auto-login after successful registration
      setTimeout(async () => {
        try {
          const loginResponse = await api.users.login({
            email: formData.email,
            password: formData.password
          });
          setUser(loginResponse.user);
          localStorage.setItem('auth_token', loginResponse.token);
          
          // Redirect based on user role
          if (loginResponse.user.role === 'SELLER') {
            navigate('/vendor-dashboard');
          } else {
            navigate('/');
          }
        } catch (loginError) {
          navigate('/login');
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterRequest) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (role: 'CUSTOMER' | 'SELLER') => {
    setFormData(prev => ({ ...prev, role }));
  };

  if (success) {
    return (
      <Section background="gradient" padding="xl" className="auth-page">
        <Container size="sm">
          <div className="success-container">
            <Card className="success-card">
              <div className="success-icon">✅</div>
              <h1 className="success-title">Account Created Successfully!</h1>
              <p className="success-message">
                Welcome to ShopSquare! You're being redirected to your dashboard...
              </p>
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </Card>
          </div>
        </Container>

        <style jsx>{`
          .auth-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .success-container {
            width: 100%;
            max-width: 400px;
          }

          .success-card {
            text-align: center;
            padding: var(--spacing-2xl);
          }

          .success-icon {
            font-size: var(--font-size-4xl);
            margin-bottom: var(--spacing-lg);
          }

          .success-title {
            font-size: var(--font-size-2xl);
            font-weight: 600;
            margin-bottom: var(--spacing-md);
            color: var(--text-white);
          }

          .success-message {
            color: var(--subtext-gray);
            margin-bottom: var(--spacing-lg);
          }

          .loading-spinner {
            display: flex;
            justify-content: center;
          }

          .spinner {
            width: 24px;
            height: 24px;
            border: 2px solid var(--border-gray);
            border-radius: 50%;
            border-top-color: var(--primary-orange);
            animation: spin 1s ease-in-out infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </Section>
    );
  }

  return (
    <Section background="gradient" padding="xl" className="auth-page">
      <Container size="sm">
        <div className="auth-container">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-text">ShopSquare</span>
            </Link>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join ShopSquare and start shopping from amazing vendors
            </p>
          </div>

          <Card className="auth-card">
            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
              />

              <div className="role-selection">
                <label className="role-label">Account Type</label>
                <div className="role-options">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="CUSTOMER"
                      checked={formData.role === 'CUSTOMER'}
                      onChange={() => handleRoleChange('CUSTOMER')}
                      className="role-radio"
                    />
                    <div className="role-card">
                      <div className="role-icon">🛒</div>
                      <div className="role-info">
                        <div className="role-name">Customer</div>
                        <div className="role-description">Shop and buy products</div>
                      </div>
                    </div>
                  </label>

                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="SELLER"
                      checked={formData.role === 'SELLER'}
                      onChange={() => handleRoleChange('SELLER')}
                      className="role-radio"
                    />
                    <div className="role-card">
                      <div className="role-icon">🏪</div>
                      <div className="role-info">
                        <div className="role-name">Vendor</div>
                        <div className="role-description">Sell products on our platform</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="terms-agreement">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox" required />
                  <span className="checkbox-text">
                    I agree to the{' '}
                    <Link to="/terms" className="terms-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="terms-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="auth-submit-btn"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <div className="social-login">
                <Button variant="secondary" size="lg" className="social-btn">
                  <span className="social-icon">🔍</span>
                  Continue with Google
                </Button>
                <Button variant="secondary" size="lg" className="social-btn">
                  <span className="social-icon">📘</span>
                  Continue with Facebook
                </Button>
              </div>
            </form>
          </Card>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-container {
          width: 100%;
          max-width: 500px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .auth-logo {
          text-decoration: none;
          display: inline-block;
          margin-bottom: var(--spacing-lg);
        }

        .logo-text {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--primary-orange);
        }

        .auth-title {
          font-size: var(--font-size-3xl);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
        }

        .auth-subtitle {
          color: var(--subtext-gray);
          font-size: var(--font-size-base);
        }

        .auth-card {
          margin-bottom: var(--spacing-lg);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          text-align: center;
        }

        .role-selection {
          margin: var(--spacing-md) 0;
        }

        .role-label {
          display: block;
          margin-bottom: var(--spacing-md);
          color: var(--text-white);
          font-weight: 500;
          font-size: var(--font-size-sm);
        }

        .role-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .role-option {
          cursor: pointer;
        }

        .role-radio {
          display: none;
        }

        .role-card {
          padding: var(--spacing-md);
          border: 2px solid var(--border-gray);
          border-radius: var(--radius-lg);
          text-align: center;
          transition: all var(--transition-normal);
          background-color: var(--hover-bg);
        }

        .role-option:hover .role-card {
          border-color: var(--primary-orange);
          background-color: var(--button-bg);
        }

        .role-radio:checked + .role-card {
          border-color: var(--primary-orange);
          background-color: rgba(255, 61, 0, 0.1);
        }

        .role-icon {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-sm);
        }

        .role-name {
          font-weight: 600;
          color: var(--text-white);
          margin-bottom: var(--spacing-xs);
        }

        .role-description {
          font-size: var(--font-size-xs);
          color: var(--subtext-gray);
        }

        .terms-agreement {
          margin: var(--spacing-sm) 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          cursor: pointer;
          font-size: var(--font-size-sm);
          color: var(--text-white);
          line-height: 1.4;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--primary-orange);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .checkbox-text {
          user-select: none;
        }

        .terms-link {
          color: var(--primary-orange);
          text-decoration: none;
          transition: color var(--transition-normal);
        }

        .terms-link:hover {
          color: #e63500;
        }

        .auth-submit-btn {
          width: 100%;
          box-shadow: var(--shadow-glow);
        }

        .auth-divider {
          position: relative;
          text-align: center;
          margin: var(--spacing-lg) 0;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--border-gray);
        }

        .auth-divider span {
          background-color: var(--button-bg);
          color: var(--subtext-gray);
          padding: 0 var(--spacing-md);
          font-size: var(--font-size-sm);
        }

        .social-login {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .social-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
        }

        .social-icon {
          font-size: var(--font-size-lg);
        }

        .auth-footer {
          text-align: center;
        }

        .auth-footer-text {
          color: var(--subtext-gray);
          font-size: var(--font-size-sm);
        }

        .auth-link {
          color: var(--primary-orange);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--transition-normal);
        }

        .auth-link:hover {
          color: #e63500;
        }

        @media (max-width: 768px) {
          .auth-container {
            max-width: 100%;
            padding: 0 var(--spacing-sm);
          }

          .auth-title {
            font-size: var(--font-size-2xl);
          }

          .role-options {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .auth-title {
            font-size: var(--font-size-xl);
          }

          .logo-text {
            font-size: var(--font-size-xl);
          }
        }
      `}</style>
    </Section>
  );
};
