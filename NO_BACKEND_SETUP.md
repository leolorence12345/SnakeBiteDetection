# Setup Without Backend - Quick Guide

This setup uses **Google Apps Script** (free, no server needed) to save data directly to Google Sheets!

## ✅ What You Get

- ✅ **No backend server** - Everything runs on Google's servers
- ✅ **Free** - No hosting costs
- ✅ **Image uploads** - Uses Imgur API (free, no auth needed)
- ✅ **Works immediately** - Just follow the steps below

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Google Apps Script

1. Go to [https://script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Copy the code from `google-apps-script.js` file
4. **Replace** `YOUR_SPREADSHEET_ID_HERE` with your actual Google Sheet ID
   - Find it in your Sheet URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
5. Click **Save** (name it "Snake Bite API")

### Step 2: Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Click the gear ⚙️ → Choose **"Web app"**
3. Settings:
   - **Execute as**: Me
   - **Who has access**: **Anyone** ⚠️ (Important!)
4. Click **"Deploy"**
5. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`)

### Step 3: Authorize

1. Click **"Authorize access"**
2. Choose your account
3. Click **"Advanced"** → **"Go to [Project] (unsafe)"**
4. Click **"Allow"**

### Step 4: Update Your React App

**Option A: Update config.js directly**

Edit `src/config.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

**Option B: Use environment variable (Recommended)**

Create `.env.production` file:
```
REACT_APP_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Step 5: Deploy

```bash
npm run deploy
```

## 🎉 Done!

Your site will now save data to Google Sheets without any backend server!

## 📝 How It Works

1. **Data Saving**: Google Apps Script receives POST requests and saves to your Sheet
2. **Image Uploads**: Images are uploaded to Imgur (free image hosting) and the URL is saved
3. **No Backend**: Everything runs on Google's infrastructure

## 🔧 Troubleshooting

**"Script function not found"**
- Make sure you saved the script before deploying
- Check function names are `doPost` and `doGet`

**"Access denied"**
- Make sure "Who has access" is set to **"Anyone"**
- Redeploy after changing access

**Data not saving**
- Check the Sheet ID is correct
- Check Apps Script execution log: View → Executions
- Make sure you authorized the script

**Images not uploading**
- Imgur might be rate-limited (free tier)
- Images will fallback to base64 data URLs (stored in the Sheet)

## 📊 Your Data

All data will be saved to your Google Sheet in the "Snake" worksheet with these columns:
- Name, Age, Sex, Phone, Address
- District, Time, Season, Place
- Local symptoms, Systematic symptoms
- Prediction, Image URL, Notes
- Clinical Snake, Clinical Notes

That's it! No backend needed! 🎉

