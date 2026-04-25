import React from 'react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            Nutri <span>Feriani</span>
          </div>
          <h2>{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
