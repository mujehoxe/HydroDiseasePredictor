import Cookies from 'js-cookie';

// Get the authentication token from cookies
export const getAuthToken = () => {
  return Cookies.get('authToken');
};

// Get the user data from cookies
export const getUser = () => {
  try {
    const userData = Cookies.get('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from cookies:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout function - remove all auth-related cookies
export const logout = () => {
  Cookies.remove('authToken');
  Cookies.remove('user');
};

// Set Authorization header for API requests
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};
