// Normalize base URL so it handles URLs with or without trailing / or /api
const RAW_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').trim().replace(/\/+$/, '');
const API_BASE_URL = RAW_BASE_URL.endsWith('/api') ? RAW_BASE_URL : `${RAW_BASE_URL}/api`;

/**
 * Standard HTTP header builder including Bearer token if present
 */
function getHeaders(contentType = 'application/json') {
  const headers = {
    'Accept': 'application/json'
  };

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const token = localStorage.getItem('jwt_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Standard HTTP error handler extracting server-side JSON message
 */
async function handleResponse(response) {
  let data = null;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    if (data) {
      if (data.message) {
        errorMessage = data.message;
      } else if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        if (firstKey && typeof data[firstKey] === 'string') {
          errorMessage = data[firstKey];
        }
      }
    } else if (response.status === 401) {
      errorMessage = 'Invalid username or password';
    } else if (response.status === 403) {
      errorMessage = 'Access denied';
    } else if (response.status === 409) {
      errorMessage = 'Email address is already registered';
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Register a new user
 * POST /api/reg
 */
export async function registerUser({ name, password, email, phone }) {
  const response = await fetch(`${API_BASE_URL}/reg`, {
    method: 'POST',
    headers: getHeaders('application/json'),
    body: JSON.stringify({ name, password, email, phone })
  });

  return handleResponse(response);
}

/**
 * Authenticate user credentials & obtain JWT token / HttpOnly cookie
 * POST /api/login
 */
export async function loginUser({ name, password }) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: getHeaders('application/json'),
    body: JSON.stringify({ name, password })
  });

  const data = await handleResponse(response);

  // Store token for seamless cross-site communication (e.g. Vercel frontend to Render backend)
  if (data && data.token) {
    localStorage.setItem('jwt_token', data.token);
  }

  return data;
}

/**
 * Fetch authenticated user profile
 * GET /api/me
 */
export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(null)
  });

  return handleResponse(response);
}

/**
 * Logout current user & clear tokens
 * POST /api/logout
 */
export async function logoutUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: getHeaders(null)
    });

    return await handleResponse(response);
  } catch (error) {
    return { message: 'Logged out' };
  } finally {
    localStorage.removeItem('jwt_token');
  }
}
