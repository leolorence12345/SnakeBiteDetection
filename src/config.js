// API Configuration
// For Google Apps Script: Use your Web App URL from script.google.com
// For local backend: Use http://localhost:5000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://script.google.com/macros/s/AKfycbw47F5FlgP9yj8XgxL9KgGINuJoOH_ouXgJ-EcN_cOB_qc-nlbKIP370h7JohbK3NSSfA/exec';

// Check if using Google Apps Script (URL contains script.google.com)
const isGoogleAppsScript = API_BASE_URL.includes('script.google.com');

export const API_ENDPOINTS = {
  // Google Apps Script uses the same URL for all requests (doPost handles it)
  // Local backend uses /api/save-record
  SAVE_RECORD: isGoogleAppsScript ? API_BASE_URL : `${API_BASE_URL}/api/save-record`,
  UPLOAD_IMAGE: `${API_BASE_URL}/api/upload-image`, // Not used with Google Apps Script
  HEALTH: isGoogleAppsScript ? API_BASE_URL : `${API_BASE_URL}/api/health`
};

export default API_ENDPOINTS;

