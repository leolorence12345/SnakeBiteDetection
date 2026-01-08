/**
 * Google Apps Script Web App for Snake Bite Management Portal
 * 
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Deploy as Web App (Execute as: Me, Who has access: Anyone)
 * 5. Copy the Web App URL
 * 6. Update your React app to use this URL
 */

// Replace with your Google Sheet ID (from the URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Snake';

/**
 * Handle POST request to save a record
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      const headers = [
        'Name', 'Age', 'Sex', 'Phone', 'Address',
        'District', 'Time', 'Season', 'Place',
        'Local symptoms', 'Systematic symptoms',
        'Prediction', 'Image URL', 'Notes',
        'Clinical Snake', 'Clinical Notes'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    // Prepare row data
    const row = [
      data.Name || '',
      data.Age || '',
      data.Sex || '',
      data.Phone || '',
      data.Address || '',
      data.District || '',
      data.Time || '',
      data.Season || '',
      data.Place || '',
      data['Local symptoms'] || '',
      data['Systematic symptoms'] || '',
      data.Prediction || '',
      data['Image URL'] || '',
      data.Notes || '',
      data['Clinical Snake'] || '',
      data['Clinical Notes'] || ''
    ];
    
    // Append the row
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Record saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET request (health check)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Snake Bite Management Portal API is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

