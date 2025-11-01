import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Section } from '../components/Layout';
import { Button, Input, Card } from '../components/UI';
import { api, LoginRequest, RegisterRequest } from '../services/apiClient';
import { useUser } from '../state/UserContext';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  const handleInputChange = (field: keyof LoginRequest) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Section background="gradient" padding="xl" className="auth-page">
      <Container size="sm">
        <div className="auth-container">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-text">ShopSquare</span>
            </Link>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to your account to continue shopping
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
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                error={error ? 'Invalid credentials' : undefined}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
              />

              <div className="auth-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox" />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="auth-submit-btn"
              >
                {loading ? 'Signing In...' : 'Sign In'}
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
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create one here
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
          max-width: 400px;
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

        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: var(--spacing-sm) 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          font-size: var(--font-size-sm);
          color: var(--text-white);
        }

        .checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--primary-orange);
        }

        .checkbox-text {
          user-select: none;
        }

        .forgot-link {
          color: var(--primary-orange);
          text-decoration: none;
          font-size: var(--font-size-sm);
          transition: color var(--transition-normal);
        }

        .forgot-link:hover {
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

          .auth-options {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: flex-start;
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
