# Backend API Setup

This backend API connects your React app to Google Sheets, just like your Python Streamlit app.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r backend_requirements.txt
```

### 2. Configure Google Sheets Credentials

You have two options:

#### Option A: Use credentials.json file (Development)
1. Copy your Google Sheets credentials from `.streamlit/secrets.toml`
2. Create a `credentials.json` file in the root directory with your credentials
3. Add the spreadsheet URL to the credentials file:

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
  "client_x509_cert_url": "...",
  "spreadsheet_url": "https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID"
}
```

#### Option B: Use Environment Variables (Production - Recommended)
Set these environment variables:
```bash
export GOOGLE_CREDENTIALS_JSON='{"type":"service_account",...}'
export SPREADSHEET_URL='https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID'
```

### 3. Run the Backend

```bash
python backend.py
```

The API will run on `http://localhost:5000`

### 4. Update React App

The React app will automatically connect to the backend API when it's running.

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/save-record` - Save a snake bite record to Google Sheets
- `POST /api/upload-image` - Upload an image to Google Drive

## Notes

- The backend uses the same Google Sheets setup as your Streamlit app
- Data is saved to the same "Snake" worksheet
- Images are uploaded to Google Drive and made publicly accessible
- CORS is enabled so the React app can communicate with the backend

