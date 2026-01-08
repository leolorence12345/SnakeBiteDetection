# Google Sheets Integration Setup

Follow these steps to connect your React app to Google Sheets:

## Step 1: Install Backend Dependencies

```bash
pip install -r backend_requirements.txt
```

## Step 2: Set Up Credentials

Run the setup script to extract credentials from your Streamlit secrets:

```bash
python setup_backend.py
```

This will create a `credentials.json` file from your `.streamlit/secrets.toml`.

**Note:** If the script doesn't work, you can manually create `credentials.json` with your Google Sheets service account credentials and add the spreadsheet URL.

## Step 3: Start the Backend Server

```bash
python backend.py
```

The backend will run on `http://localhost:5000`

## Step 4: Start the React App

In a separate terminal:

```bash
npm start
```

The React app will run on `http://localhost:3000`

## How It Works

1. **React App** (port 3000) - Your frontend
2. **Backend API** (port 5000) - Connects to Google Sheets
3. **Google Sheets** - Stores all the data (same as your Python app)

When you save a record in the React app:
- Data is sent to the backend API
- Backend saves it to Google Sheets (same "Snake" worksheet)
- Images are uploaded to Google Drive
- You'll see the data in your Google Sheet!

## Troubleshooting

**Backend won't start:**
- Make sure `credentials.json` exists
- Check that all dependencies are installed
- Verify your Google Sheets credentials are correct

**React app can't connect:**
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify CORS is enabled (it should be by default)

**Data not saving:**
- Check backend console for error messages
- Verify Google Sheets permissions
- Make sure the "Snake" worksheet exists

## Security Note

- `credentials.json` is in `.gitignore` - don't commit it!
- For production, use environment variables instead
- Keep your Google Sheets credentials secure

