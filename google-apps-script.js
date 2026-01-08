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

// Your Google Sheet ID (extracted from your secrets.toml)
const SPREADSHEET_ID = '1TLPK3NwAjDUioanyTFEiQoxTAAPXXvhcbFU5dq8LkX0';
const SHEET_NAME = 'Snake';

/**
 * Handle POST request to save a record
 */
function doPost(e) {
  try {
    Logger.log('=== doPost called ===');
    Logger.log('e.parameter: ' + JSON.stringify(e.parameter));
    Logger.log('e.postData: ' + JSON.stringify(e.postData));

    let data;

    // Check if data is sent as form parameter or JSON body
    if (e.parameter && e.parameter.data) {
      // Form submission (from iframe)
      Logger.log('Using form parameter data');
      data = JSON.parse(e.parameter.data);
    } else {
      // Direct JSON POST
      Logger.log('Using postData contents');
      data = JSON.parse(e.postData.contents);
    }

    Logger.log('Parsed data: ' + JSON.stringify(data));

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
    Logger.log('Row appended successfully');

    // Return HTML with postMessage for iframe communication
    const html = `
      <html>
        <body>
          <script>
            window.parent.postMessage({success: true, message: 'Record saved successfully'}, '*');
          </script>
        </body>
      </html>
    `;

    return HtmlService.createHtmlOutput(html);
      
  } catch (error) {
    // Return HTML with error message for iframe communication
    const errorHtml = `
      <html>
        <body>
          <script>
            window.parent.postMessage({success: false, error: '${error.toString()}'}, '*');
          </script>
        </body>
      </html>
    `;

    return HtmlService.createHtmlOutput(errorHtml);
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

