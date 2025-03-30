import axios from "axios";

const API_BASE_URL = "https://cms-project-rknw.onrender.com/api/";



// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Prevents long waits if API is unresponsive
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get the token from localStorage
function getToken() {
  return localStorage.getItem("access_token");
}

// Request Interceptor (Logs requests & Adds Token)
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handles errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ✅ Check if User Exists
export async function checkUserExists(username) {
  try {
    console.log("Checking if user exists...");
    const response = await api.post("auth/check-user/", { username });
    return { exists: response.data.exists };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { exists: false };
  }
}

// ✅ Login User
export async function loginUser(username, password) {
  try {
    const response = await api.post("auth/login/", { username, password });

    if (response.data.token) {
      localStorage.setItem("access_token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ Signup User
export async function signupUser(username, password) {
  try {
    const response = await api.post("auth/signup/", { username, password });

    if (response.data.token) {
      localStorage.setItem("access_token", response.data.token);
      return { success: true, token: response.data.token };
    }
    return { success: false };
  } catch (error) {
    if (error.response?.data?.error === "Username already taken") {
      console.warn("User exists, switching to login...");
      return { existingUser: true };
    }
    console.error("Signup failed:", error.response?.data || error.message);
    throw error;
  }
}

// ✅ Fetch User Profile
export async function getUserProfile() {
  try {
    const response = await api.get("auth/profile/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// ✅ Logout User (Clear all user-related data)
export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("username");
}

// ✅ Fetch User Details (Same as getUserProfile, removed duplication)
export async function getUserDetails() {
  return getUserProfile();
}

// ✅ Export only `api`
export default api;
