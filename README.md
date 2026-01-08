# Snake Bite Management Portal - React Version

This is a React version of the Snake Bite Management Portal, converted from the original Streamlit Python application while maintaining the same flow, logic, and color scheme.

## Features

- **Step 1: Victim Identity** - Collect personal details (Name, Age, Sex, Phone, Address)
- **Step 2: Snake Bite Details** - Capture/upload bite images, location detection, symptoms, time, and season
- **Step 3: Clinical Confirmation** - View prediction and enter clinical confirmation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the images folder to the public directory:
```bash
# On Windows (PowerShell)
Copy-Item -Path images -Destination public\images -Recurse

# On Linux/Mac
cp -r images public/images
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
  ├── components/
  │   ├── VictimIdentity.js      # Step 1: Victim details form
  │   ├── SnakeBiteDetails.js    # Step 2: Bite details and image capture
  │   └── ClinicalConfirmation.js # Step 3: Clinical confirmation
  ├── utils/
  │   └── prediction.js          # Prediction algorithm (same logic as Python)
  ├── metadata.js                # Constants (LOCATION_OPTIONS, TIME, SEASON, etc.)
  ├── App.js                     # Main app component
  ├── App.css                    # Styling (same colors as original)
  └── index.js                   # Entry point
```

## Notes

- The prediction algorithm logic is identical to the Python version
- Color scheme matches the original (#0b3d0b background, #b0f2b4 headers, etc.)
- Image upload/capture functionality is implemented
- Location detection uses browser geolocation API
- For Google Sheets integration, you'll need to set up a backend API endpoint

## Backend Integration

To integrate with Google Sheets (like the original app), you'll need to:

1. Create a backend API (Node.js/Express, Python/Flask, etc.)
2. Set up Google Sheets API credentials
3. Update the `handleSaveRecord` function in `App.js` to call your API
4. Update the image upload in `SnakeBiteDetails.js` to upload to your server/Google Drive

