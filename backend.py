from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import json
import os
from datetime import datetime
import time
import gc

app = Flask(__name__)
CORS(app)  # Enable CORS for React app

# Load Google Sheets credentials
# You can either use environment variables or a credentials file
# For now, we'll use a config approach similar to Streamlit secrets

def get_google_credentials():
    """Load Google Sheets credentials"""
    # Option 1: From environment variable (recommended for production)
    creds_json = os.getenv('GOOGLE_CREDENTIALS_JSON')
    if creds_json:
        creds_dict = json.loads(creds_json)
    else:
        # Option 2: From a local file (for development)
        # Create a credentials.json file with your Google Sheets credentials
        try:
            with open('credentials.json', 'r') as f:
                creds_dict = json.load(f)
        except FileNotFoundError:
            raise Exception("Google credentials not found. Please run 'python setup_backend.py' to create credentials.json or set GOOGLE_CREDENTIALS_JSON environment variable")
    
    # Remove spreadsheet_url from creds_dict if present (it's not part of the credentials)
    spreadsheet_url = creds_dict.pop('spreadsheet_url', None)
    if spreadsheet_url:
        # Store it for later use
        os.environ['SPREADSHEET_URL'] = spreadsheet_url
    
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = Credentials.from_service_account_info(creds_dict, scopes=scope)
    return creds

def get_spreadsheet():
    """Get the Google Sheets spreadsheet"""
    creds = get_google_credentials()
    gc = gspread.authorize(creds)
    
    # Get spreadsheet URL from environment or config
    spreadsheet_url = os.getenv('SPREADSHEET_URL')
    if not spreadsheet_url:
        # Try to get from credentials file
        try:
            with open('credentials.json', 'r') as f:
                creds_dict = json.load(f)
                spreadsheet_url = creds_dict.get('spreadsheet_url')
        except:
            pass
    
    if not spreadsheet_url:
        raise Exception("Spreadsheet URL not found. Please run 'python setup_backend.py' or set SPREADSHEET_URL environment variable")
    
    spreadsheet = gc.open_by_url(spreadsheet_url)
    worksheet = spreadsheet.worksheet("Snake")
    return worksheet

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"})

@app.route('/api/save-record', methods=['POST'])
def save_record():
    """Save a snake bite record to Google Sheets"""
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Get the worksheet
        worksheet = get_spreadsheet()
        
        # Get existing data
        existing_data = pd.DataFrame(worksheet.get_all_records())
        
        # Prepare the new record
        new_record = {
            "Name": data.get("Name", ""),
            "Age": data.get("Age", ""),
            "Sex": data.get("Sex", ""),
            "Phone": data.get("Phone", ""),
            "Address": data.get("Address", ""),
            "District": data.get("District", ""),
            "Time": data.get("Time", ""),
            "Season": data.get("Season", ""),
            "Place": data.get("Place", ""),
            "Local symptoms": data.get("Local symptoms", ""),
            "Systematic symptoms": data.get("Systematic symptoms", ""),
            "Prediction": data.get("Prediction", ""),
            "Image URL": data.get("Image URL", ""),
            "Notes": data.get("Notes", ""),
            "Clinical Snake": data.get("Clinical Snake", ""),
            "Clinical Notes": data.get("Clinical Notes", "")
        }
        
        # Add to existing data
        updated_df = pd.concat([existing_data, pd.DataFrame([new_record])], ignore_index=True)
        
        # Clean up the data (replace NaN, None, inf with empty strings)
        updated_df = updated_df.fillna("")
        updated_df = updated_df.replace([float('inf'), float('-inf')], "")
        
        # Update the worksheet
        worksheet.clear()
        worksheet.update([updated_df.columns.tolist()] + updated_df.values.tolist())
        
        return jsonify({
            "success": True,
            "message": "Record saved successfully"
        }), 200
        
    except Exception as e:
        print(f"Error saving record: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    """Upload image to Google Drive and return URL"""
    filename = None
    media = None
    image_url = None
    
    try:
        if 'image' not in request.files:
            return jsonify({"success": False, "error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
        
        # Save temporarily
        filename = f"bite_{datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"
        file.save(filename)
        print(f"Temporary file saved: {filename}")
        
        # Upload to Google Drive
        print("Getting Google credentials...")
        creds = get_google_credentials()
        print("Building Drive service...")
        drive_service = build("drive", "v3", credentials=creds)
        
        file_metadata = {"name": filename}
        media = MediaFileUpload(filename, mimetype="image/jpeg")
        print("Uploading to Google Drive...")
        uploaded_file = drive_service.files().create(
            body=file_metadata,
            media_body=media,
            fields="id"
        ).execute()
        
        file_id = uploaded_file["id"]
        print(f"File uploaded with ID: {file_id}")
        
        # Make file publicly accessible
        print("Setting file permissions...")
        drive_service.permissions().create(
            fileId=file_id,
            body={"type": "anyone", "role": "reader"}
        ).execute()
        
        # Get the URL
        image_url = f"https://drive.google.com/uc?id={file_id}"
        print(f"Image URL: {image_url}")
        
        # Prepare success response - upload succeeded!
        response_data = {
            "success": True,
            "imageUrl": image_url
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error uploading image: {error_msg}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            "success": False,
            "error": error_msg
        }), 500
    
    finally:
        # Cleanup: Always try to clean up, but don't let errors here affect the response
        # This runs even if there was an error, but we only return success if upload worked
        try:
            # Close media file handle
            if media:
                try:
                    del media
                    gc.collect()
                except:
                    pass
                media = None
            
            # Clean up temp file - use a retry mechanism for Windows
            if filename and os.path.exists(filename):
                max_retries = 5
                for i in range(max_retries):
                    try:
                        os.remove(filename)
                        print("Temporary file removed")
                        break
                    except (PermissionError, OSError) as e:
                        if i < max_retries - 1:
                            time.sleep(0.3)  # Wait 300ms before retry
                        else:
                            print(f"Warning: Could not delete temp file {filename}, but upload succeeded. Error: {e}")
        except Exception as cleanup_error:
            print(f"Cleanup warning (non-critical): {cleanup_error}")
    
    # Return success response only if we have an image_url (upload succeeded)
    if image_url:
        return jsonify(response_data), 200
    else:
        return jsonify({
            "success": False,
            "error": "Upload failed"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
