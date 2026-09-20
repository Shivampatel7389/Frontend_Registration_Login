const API_BASE_URL = 'http://localhost:8080/api';

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
        // Collect field validation error messages if present
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
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, password, email, phone })
  });

  return handleResponse(response);
}

/**
 * Authenticate user credentials & obtain HttpOnly JWT cookie
 * POST /api/login
 */
export async function loginUser({ name, password }) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include', // CRITICAL: Allows browser to receive and store HttpOnly cookie
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, password })
  });

  return handleResponse(response);
}

/**
 * Fetch authenticated user information using HttpOnly cookie
 * GET /api/me
 */
export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    credentials: 'include', // CRITICAL: Automatically sends HttpOnly cookie to backend
    headers: {
      'Accept': 'application/json'
    }
  });

  return handleResponse(response);
}

/**
 * Logout current user & clear HttpOnly cookie
 * POST /api/logout
 */
export async function logoutUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    return handleResponse(response);
  } catch (error) {
    // Proceed with client-side cleanup even if backend is unreachable
    return { message: 'Logged out' };
  }
}
