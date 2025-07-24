import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * ProtectedRoute component that redirects unauthenticated users to login
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} [props.redirectTo="/"] - Path to redirect to if not authenticated
 * @returns {React.ReactNode} - Children if authenticated, nothing if redirecting
 */
function ProtectedRoute({ children, redirectTo = "/" }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);

  // Only render children if user is authenticated
  return isAuthenticated() ? children : null;
}

export default ProtectedRoute;
