# Setting Up Google Sheets Credentials

Since your `secrets.toml` is empty, you have two options:

## Option 1: Copy from Your Working Streamlit App

If your Streamlit app (app.py) is working, the credentials are stored somewhere. You can:

1. **Check Streamlit Cloud secrets** (if deployed)
2. **Check your local Streamlit config** - credentials might be in a different location
3. **Extract from app.py** - If credentials are hardcoded (not recommended but might be there)

## Option 2: Create credentials.json Manually

1. **Get your Google Service Account credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create or select a project
   - Enable Google Sheets API and Google Drive API
   - Create a Service Account
   - Download the JSON key file

2. **Copy the JSON content** and add the spreadsheet URL:
   - Open the downloaded JSON file
   - Copy all the content
   - Add `"spreadsheet_url": "YOUR_SPREADSHEET_URL"` to it
   - Save as `credentials.json` in the project root

3. **Share your Google Sheet with the service account:**
   - Open your Google Sheet
   - Click "Share"
   - Add the service account email (from the JSON file, `client_email` field)
   - Give it "Editor" access

## Quick Setup

If you have the credentials JSON file from Google Cloud:

```bash
# Copy your service account JSON file to credentials.json
cp path/to/your-service-account-key.json credentials.json

# Then add the spreadsheet URL to the JSON file
# Edit credentials.json and add: "spreadsheet_url": "YOUR_SPREADSHEET_URL"
```

## Test the Setup

Once `credentials.json` is created, test it:

```bash
.\venv\Scripts\python.exe backend.py
```

If it starts without errors, you're good to go!

