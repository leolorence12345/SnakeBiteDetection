# Google Apps Script Deployment Instructions

## Step 1: Update Google Apps Script

1. Go to https://script.google.com
2. Open your existing project OR create a new one
3. **Replace ALL the code** with the updated code from `google-apps-script.js`
4. Make sure the `SPREADSHEET_ID` matches your Google Sheet ID: `1TLPK3NwAjDUioanyTFEiQoxTAAPXXvhcbFU5dq8LkX0`

## Step 2: Deploy the Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description:** Snake Bite Portal API (or any name)
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/AKfycby.../exec`)

## Step 3: Update Your React App Config

The URL in `src/config.js` is already set to your existing deployment:
```javascript
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbw47F5FlgP9yj8XgxL9KgGINuJoOH_ouXgJ-EcN_cOB_qc-nlbKIP370h7JohbK3NSSfA/exec';
```

**If you created a NEW deployment:**
- Replace this URL with your new Web App URL

**If you're UPDATING the existing deployment:**
- No change needed! The URL stays the same

## Step 4: Test the Integration

1. Build and deploy your React app:
   ```bash
   npm run build
   ```

2. Test form submission:
   - Fill in all form fields
   - Submit the form
   - Check your Google Sheet for the new row
   - You should see a success message

## What Was Fixed?

The issue was that your frontend sends data as **form-encoded** data (via iframe), but the old Google Apps Script was trying to parse it as **JSON body**. The updated script now:

1. ✅ Accepts form submissions from the iframe (`e.parameter.data`)
2. ✅ Also accepts direct JSON POST requests (backward compatible)
3. ✅ Returns HTML with `postMessage` to communicate back to the iframe
4. ✅ Proper error handling with messages back to the frontend

## Verify Your Google Sheet

Make sure your Google Sheet has these columns (they'll be auto-created if missing):
1. Name
2. Age
3. Sex
4. Phone
5. Address
6. District
7. Time
8. Season
9. Place
10. Local symptoms
11. Systematic symptoms
12. Prediction
13. Image URL
14. Notes
15. Clinical Snake
16. Clinical Notes

## Troubleshooting

### If data still doesn't save:

1. **Check Script Permissions:**
   - Run the script once manually in the editor
   - Approve any permission requests

2. **Check Sheet ID:**
   - Make sure `SPREADSHEET_ID` matches your actual Google Sheet ID
   - The ID is in your sheet URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

3. **Check Deployment Settings:**
   - Execute as: Me
   - Who has access: Anyone
   - Make sure you deployed the LATEST version

4. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for any error messages
   - Check if the postMessage event is received

5. **Test Direct Access:**
   - Visit your Web App URL directly in a browser
   - You should see: `{"status":"ok","message":"Snake Bite Management Portal API is running"}`
