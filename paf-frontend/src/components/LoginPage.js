import React from 'react';
import '../styles/LoginPage.css';

function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome</h1>
        <p>Sign in to access your dashboard</p>
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img 
            src="/google-logo.png" 
            alt="Google Logo" 
            className="google-icon" 
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;