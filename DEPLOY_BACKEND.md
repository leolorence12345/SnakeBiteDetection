# Backend Deployment Guide

This guide will help you deploy the backend API so your GitHub Pages site can save data to Google Sheets.

## Quick Deploy Options

### Option 1: Railway (Easiest - Recommended)

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python
5. Add environment variables:
   - `GOOGLE_CREDENTIALS_JSON` - Your full Google credentials JSON as a string
   - `SPREADSHEET_URL` - Your Google Sheets URL
6. Deploy!

Your backend URL will be: `https://your-app-name.railway.app`

### Option 2: Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Build Command**: `pip install -r backend_requirements.txt`
   - **Start Command**: `python backend.py`
   - **Environment**: Python 3
5. Add environment variables:
   - `GOOGLE_CREDENTIALS_JSON` - Your full Google credentials JSON
   - `SPREADSHEET_URL` - Your Google Sheets URL
6. Deploy!

Your backend URL will be: `https://your-app-name.onrender.com`

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set GOOGLE_CREDENTIALS_JSON='{"type":"service_account",...}'
   heroku config:set SPREADSHEET_URL='https://docs.google.com/spreadsheets/d/YOUR_ID'
   ```
5. Deploy: `git push heroku master`

## After Deployment

1. Get your backend URL (e.g., `https://your-backend.railway.app`)

2. Update your React app to use the deployed backend:
   - Option A: Create `.env.production` file:
     ```
     REACT_APP_API_URL=https://your-backend.railway.app
     ```
   - Option B: Update `src/config.js` directly:
     ```javascript
     const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend.railway.app';
     ```

3. Rebuild and redeploy your React app:
   ```bash
   npm run deploy
   ```

## Getting Your Google Credentials

Your credentials are in `.streamlit/secrets.toml`. You need to convert them to JSON format:

```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

**Important**: When setting `GOOGLE_CREDENTIALS_JSON` as an environment variable, you need to escape it properly or use the JSON as a single-line string.

## Testing

After deployment, test your backend:
- Health check: `https://your-backend-url/api/health`
- Should return: `{"status": "ok"}`

Then test saving from your GitHub Pages site!

