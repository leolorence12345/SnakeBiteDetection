/**
 * Google Apps Script Web App for Snake Bite Management Portal
 * 
 * ✅ READY TO USE - Sheet ID already configured!
 * 
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this ENTIRE code
 * 4. Make sure YOUR Google account has edit access to the Sheet
 * 5. Deploy as Web App (Execute as: Me, Who has access: Anyone)
 * 6. Copy the Web App URL
 * 7. Update your React app config.js with that URL
 */

// Your Google Sheet ID (already configured from your secrets.toml)
const SPREADSHEET_ID = '1TLPK3NwAjDUioanyTFEiQoxTAAPXXvhcbFU5dq8LkX0';
const SHEET_NAME = 'Snake';

/**
 * Handle POST request to save a record
 */
function doPost(e) {
  try {
    let data;
    
    // Handle both JSON and form-encoded data
    if (e.postData && e.postData.contents) {
      try {
        // Try parsing as JSON first
        data = JSON.parse(e.postData.contents);
      } catch (e) {
        // If not JSON, try parsing as form data
        const params = e.parameter;
        if (params.data) {
          data = JSON.parse(params.data);
        } else {
          // Use parameters directly
          data = params;
        }
      }
    } else if (e.parameter && e.parameter.data) {
      // Form submission with data field
      data = JSON.parse(e.parameter.data);
    } else {
      // Use parameters directly
      data = e.parameter || {};
    }
    
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
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
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
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

