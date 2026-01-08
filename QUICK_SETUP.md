# Quick Setup - Google Apps Script (No Backend!)

## ✅ Good News!

Your Google Sheet is already configured! The Sheet ID is: `1TLPK3NwAjDUioanyTFEiQoxTAAPXXvhcbFU5dq8LkX0`

## ⚠️ Important Difference

- **Service Account** (what you have now): Uses `sankedatabase@snakeapp-406218.iam.gserviceaccount.com`
- **Google Apps Script**: Uses YOUR personal Google account permissions

**You need to make sure YOUR Google account has edit access to the Sheet!**

## 🚀 3-Step Setup

### Step 1: Share Sheet with Your Account (if needed)

1. Open your Sheet: https://docs.google.com/spreadsheets/d/1TLPK3NwAjDUioanyTFEiQoxTAAPXXvhcbFU5dq8LkX0
2. Click **Share** (top right)
3. Add your Google account email (the one you'll use for Apps Script)
4. Give it **Editor** permission
5. Click **Done**

### Step 2: Create & Deploy Google Apps Script

1. Go to [https://script.google.com](https://script.google.com)
2. Click **"New Project"**
3. **Delete all default code**
4. Copy the **ENTIRE** code from `GOOGLE_APPS_SCRIPT_READY.js`
5. Paste it into the script editor
6. Click **Save** (name it "Snake Bite API")
7. Click **Deploy** → **New deployment**
8. Click gear ⚙️ → Choose **"Web app"**
9. Settings:
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** ⚠️ (Important!)
10. Click **Deploy**
11. **Authorize** when prompted (click "Advanced" → "Go to [Project] (unsafe)" → "Allow")
12. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`)

### Step 3: Update React App

Edit `src/config.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://script.google.com/macros/s/YOUR_COPIED_URL_HERE/exec';
```

Replace `YOUR_COPIED_URL_HERE` with the URL you copied.

Then deploy:
```bash
npm run deploy
```

## ✅ Done!

Your site will now save to the same Google Sheet without any backend server!

## 🔍 How to Verify

1. Visit your GitHub Pages site
2. Fill out and submit a test record
3. Check your Google Sheet - the data should appear in the "Snake" worksheet!

## ❓ Troubleshooting

**"You do not have permission"**
- Make sure you shared the Sheet with your Google account
- Make sure you gave Editor permission

**"Script function not found"**
- Make sure you copied the ENTIRE code from `GOOGLE_APPS_SCRIPT_READY.js`
- Make sure you saved the script before deploying

**Data not appearing**
- Check the Apps Script execution log: View → Executions
- Make sure the Sheet name is "Snake" (case-sensitive)

That's it! 🎉

