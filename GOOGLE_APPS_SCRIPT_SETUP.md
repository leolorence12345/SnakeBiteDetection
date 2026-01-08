# Google Apps Script Setup (No Backend Required!)

This is the easiest way to save data to Google Sheets without deploying a separate backend server.

## Step 1: Create Google Apps Script

1. Go to [https://script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Delete the default code
4. Copy and paste the code from `google-apps-script.js` file
5. **Important**: Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Google Sheet ID
   - Your Sheet ID is in the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
   - Copy just the ID part (the long string between `/d/` and `/edit`)

## Step 2: Save the Script

1. Click the **Save** icon (or Ctrl+S)
2. Give it a name like "Snake Bite Portal API"

## Step 3: Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Set the following:
   - **Description**: "Snake Bite Management Portal API"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (this allows your React app to call it)
5. Click **"Deploy"**
6. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
   ⚠️ **Save this URL!** You'll need it in the next step.

## Step 4: Authorize the Script

1. When you first deploy, you'll be asked to authorize
2. Click **"Authorize access"**
3. Choose your Google account
4. Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
5. Click **"Allow"**

## Step 5: Update Your React App

1. Open `src/config.js` in your project
2. Update the API URL to use your Google Apps Script URL:

```javascript
// Replace with your Google Apps Script Web App URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

Or create a `.env.production` file:

```
REACT_APP_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Step 6: Rebuild and Redeploy

```bash
npm run deploy
```

## Testing

1. Visit your GitHub Pages site
2. Fill out the form and submit
3. Check your Google Sheet - the data should appear!

## Troubleshooting

### "Script function not found"
- Make sure you saved the script before deploying
- Check that the function names are exactly `doPost` and `doGet`

### "Access denied" or CORS errors
- Make sure "Who has access" is set to **"Anyone"**
- Redeploy after changing access settings

### Data not appearing in Sheet
- Check that the SPREADSHEET_ID is correct
- Make sure the Sheet exists and you have edit permissions
- Check the Apps Script execution log: View → Executions

### 405 Method Not Allowed
- Google Apps Script Web Apps need to handle both GET and POST
- Make sure both `doGet` and `doPost` functions exist

## Advantages

✅ **No backend server needed** - Runs on Google's servers  
✅ **Free** - No hosting costs  
✅ **Secure** - Credentials stay with Google  
✅ **Easy to update** - Just edit the script  
✅ **No CORS issues** - Google handles it  

## Limitations

- Image uploads need to be handled separately (Google Apps Script has file size limits)
- For images, you might still need a simple backend or use Google Drive API directly from the frontend (with proper OAuth)

## Image Upload Alternative

If you need image uploads, you can:
1. Upload images to a free service like Imgur API
2. Or use Google Drive API with OAuth from the frontend
3. Or keep a minimal backend just for image uploads

Let me know if you need help with any of these steps!

