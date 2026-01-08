// API Configuration
// For development: uses localhost
// For production: update this to your backend API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  SAVE_RECORD: `${API_BASE_URL}/api/save-record`,
  UPLOAD_IMAGE: `${API_BASE_URL}/api/upload-image`,
  HEALTH: `${API_BASE_URL}/api/health`
};

export default API_ENDPOINTS;

