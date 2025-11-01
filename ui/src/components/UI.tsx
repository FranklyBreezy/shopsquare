import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  href
}) => {
  const baseClasses = `btn btn-${variant} btn-${size} ${className}`;
  
  if (href) {
    return (
      <a 
        href={href} 
        className={baseClasses}
        onClick={onClick}
      >
        {loading && <span className="loading" />}
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {loading && <span className="loading" />}
      {children}
    </button>
  );
};

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  required = false,
  error,
  className = '',
  icon
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <div className="input-icon">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`input ${error ? 'error' : ''} ${icon ? 'with-icon' : ''}`}
        />
      </div>
      {error && <div className="input-error">{error}</div>}
      
      <style jsx>{`
        .input-group {
          width: 100%;
        }

        .input-label {
          display: block;
          margin-bottom: var(--spacing-sm);
          color: var(--text-white);
          font-weight: 500;
          font-size: var(--font-size-sm);
        }

        .required {
          color: var(--primary-orange);
          margin-left: var(--spacing-xs);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: var(--spacing-md);
          color: var(--subtext-gray);
          z-index: 1;
        }

        .input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          background-color: var(--button-bg);
          border: 1px solid var(--border-gray);
          border-radius: var(--radius-md);
          color: var(--text-white);
          font-family: var(--font-family);
          font-size: var(--font-size-base);
          transition: all var(--transition-normal);
        }

        .input.with-icon {
          padding-left: calc(var(--spacing-md) + 24px + var(--spacing-sm));
        }

        .input:focus {
          outline: none;
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 3px rgba(255, 61, 0, 0.1);
        }

        .input.error {
          border-color: #ef4444;
        }

        .input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .input::placeholder {
          color: var(--subtext-gray);
        }

        .input-error {
          margin-top: var(--spacing-xs);
          color: #ef4444;
          font-size: var(--font-size-sm);
        }
      `}</style>
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick
}) => {
  return (
    <div 
      className={`card ${hover ? 'card-hover' : ''} ${glow ? 'card-glow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
      
      <style jsx>{`
        .card {
          background-color: var(--button-bg);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          border: 1px solid var(--border-gray);
          transition: all var(--transition-normal);
        }

        .card-hover:hover {
          border-color: var(--primary-orange);
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .card-glow {
          box-shadow: var(--shadow-glow);
        }

        .card-glow:hover {
          box-shadow: var(--shadow-glow-hover);
        }

        @media (max-width: 768px) {
          .card {
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`loading-spinner loading-spinner-${size} ${className}`}>
      <div className="spinner"></div>
      
      <style jsx>{`
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .spinner {
          border: 2px solid var(--border-gray);
          border-radius: 50%;
          border-top-color: var(--primary-orange);
          animation: spin 1s ease-in-out infinite;
        }

        .loading-spinner-sm .spinner {
          width: 16px;
          height: 16px;
        }

        .loading-spinner-md .spinner {
          width: 24px;
          height: 24px;
        }

        .loading-spinner-lg .spinner {
          width: 32px;
          height: 32px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
        )}
        <div className="modal-content">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: var(--spacing-md);
        }

        .modal {
          background-color: var(--button-bg);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-gray);
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
        }

        .modal-sm { max-width: 400px; width: 100%; }
        .modal-md { max-width: 600px; width: 100%; }
        .modal-lg { max-width: 800px; width: 100%; }
        .modal-xl { max-width: 1000px; width: 100%; }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--border-gray);
        }

        .modal-title {
          margin: 0;
          color: var(--text-white);
          font-size: var(--font-size-xl);
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--subtext-gray);
          font-size: var(--font-size-2xl);
          cursor: pointer;
          padding: var(--spacing-xs);
          line-height: 1;
        }

        .modal-close:hover {
          color: var(--text-white);
        }

        .modal-content {
          padding: var(--spacing-lg);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: var(--spacing-sm);
          }

          .modal-header,
          .modal-content {
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
};
