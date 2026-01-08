"""
Helper script to set up backend credentials from Streamlit secrets
"""
import json
import os
import toml

def setup_credentials():
    """Extract credentials from Streamlit secrets and create credentials.json"""
    
    # Try to read from .streamlit/secrets.toml
    secrets_path = '.streamlit/secrets.toml'
    
    if not os.path.exists(secrets_path):
        print("❌ .streamlit/secrets.toml not found!")
        print("\nPlease create credentials.json manually with your Google Sheets credentials.")
        return False
    
    try:
        # Read Streamlit secrets
        with open(secrets_path, 'r') as f:
            secrets = toml.load(f)
        
        # Get Google Sheets connection info
        # Streamlit stores it as connections.gsheets
        connections = secrets.get('connections', {})
        gsheets_config = connections.get('gsheets', {})
        
        if not gsheets_config:
            print("❌ Google Sheets configuration not found in secrets.toml")
            print("Expected format: [connections.gsheets]")
            return False
        
        # The gsheets config should contain the full service account JSON
        # It might be stored as a nested dict or as individual keys
        if isinstance(gsheets_config, dict):
            # If it's already a dict with service account keys, use it directly
            if "type" in gsheets_config and gsheets_config["type"] == "service_account":
                credentials = gsheets_config.copy()
                # Add spreadsheet URL if it exists
                if "spreadsheet" in gsheets_config:
                    credentials["spreadsheet_url"] = gsheets_config["spreadsheet"]
            else:
                # Otherwise, construct from individual keys
                credentials = {
                    "type": "service_account",
                    "project_id": gsheets_config.get("project_id", ""),
                    "private_key_id": gsheets_config.get("private_key_id", ""),
                    "private_key": gsheets_config.get("private_key", "").replace('\\n', '\n'),
                    "client_email": gsheets_config.get("client_email", ""),
                    "client_id": gsheets_config.get("client_id", ""),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": gsheets_config.get("client_x509_cert_url", ""),
                    "spreadsheet_url": gsheets_config.get("spreadsheet", "")
                }
        else:
            print("❌ Unexpected format in secrets.toml")
            return False
        
        # Save to credentials.json
        with open('credentials.json', 'w') as f:
            json.dump(credentials, f, indent=2)
        
        print("✅ credentials.json created successfully!")
        print(f"📊 Spreadsheet URL: {credentials['spreadsheet_url']}")
        print("\nYou can now run the backend with: python backend.py")
        return True
        
    except Exception as e:
        print(f"❌ Error setting up credentials: {str(e)}")
        print("\nPlease create credentials.json manually.")
        return False

if __name__ == '__main__':
    setup_credentials()

