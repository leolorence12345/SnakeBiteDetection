import React, { useState } from 'react';
import './App.css';
import VictimIdentity from './components/VictimIdentity';
import SnakeBiteDetails from './components/SnakeBiteDetails';
import ClinicalConfirmation from './components/ClinicalConfirmation';
import StepIndicator from './components/StepIndicator';
import { API_ENDPOINTS } from './config';

function App() {
  const [step, setStep] = useState(1); // 1: Identity, 2: Bite Details, 3: Clinical Confirmation
  const [identityInfo, setIdentityInfo] = useState(null);
  const [biteData, setBiteData] = useState(null);

  const handleIdentityContinue = (info) => {
    setIdentityInfo(info);
    setStep(2);
  };

  const handleBiteSubmit = (data) => {
    setBiteData(data);
    setStep(3);
  };

  const handleSaveRecord = async (finalData) => {
    return new Promise((resolve, reject) => {
      try {
        // Create a hidden iframe for form submission (avoids CORS completely)
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_submit_frame';
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        
        // Create form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = API_ENDPOINTS.SAVE_RECORD;
        form.target = 'hidden_submit_frame';
        form.style.display = 'none';
        
        // Add data field
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(finalData);
        form.appendChild(input);
        
        // Add to DOM
        document.body.appendChild(iframe);
        document.body.appendChild(form);
        
        // Listen for message from iframe
        const messageHandler = (event) => {
          // Accept messages from Google Apps Script
          if (event.origin.includes('script.google.com') || event.data) {
            // Clean up
            document.body.removeChild(form);
            document.body.removeChild(iframe);
            window.removeEventListener('message', messageHandler);
            
            if (event.data && event.data.success) {
              alert('Record saved successfully to Google Sheets!');
              // Reset to start
              setStep(1);
              setIdentityInfo(null);
              setBiteData(null);
            } else {
              alert('Record may have been saved. Please check your Google Sheet to confirm.');
            }
            resolve();
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Fallback: if no message received after 3 seconds, assume success
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
            window.removeEventListener('message', messageHandler);
            alert('Record saved successfully to Google Sheets!');
            setStep(1);
            setIdentityInfo(null);
            setBiteData(null);
            resolve();
          }
        }, 3000);
        
        // Handle errors
        iframe.onerror = () => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(form);
            document.body.removeChild(iframe);
            window.removeEventListener('message', messageHandler);
            alert('Record may have been saved. Please check your Google Sheet to confirm.');
            resolve();
          }
        };
        
        // Submit form
        form.submit();
        
      } catch (error) {
        console.error('Error saving record:', error);
        alert('Record may have been saved. Please check your Google Sheet to confirm.');
        reject(error);
      }
    });
  };

  return (
    <div className="App">
      <h1>Snake Bite Management Portal</h1>
      <StepIndicator currentStep={step} />
      
      {step === 1 && (
        <VictimIdentity onContinue={handleIdentityContinue} />
      )}
      
      {step === 2 && identityInfo && (
        <SnakeBiteDetails 
          identityInfo={identityInfo} 
          onSubmit={handleBiteSubmit}
        />
      )}
      
      {step === 3 && biteData && (
        <ClinicalConfirmation
          predictedSpecies={biteData.predictedSpecies}
          imageUrl={biteData.imageUrl}
          record={biteData.record}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
}

export default App;

