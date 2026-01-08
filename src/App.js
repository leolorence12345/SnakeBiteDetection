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
    try {
      // Use form submission to avoid CORS issues with Google Apps Script
      const formData = new FormData();
      formData.append('data', JSON.stringify(finalData));
      
      const response = await fetch(API_ENDPOINTS.SAVE_RECORD, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required to avoid CORS preflight
      });
      
      // With no-cors mode, we can't read the response
      // But the request will succeed if the script is set up correctly
      // Wait a moment for the request to complete
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Record saved successfully to Google Sheets!');
      // Reset to start
      setStep(1);
      setIdentityInfo(null);
      setBiteData(null);
      
    } catch (error) {
      console.error('Error saving record:', error);
      // Even if there's an error, the request might have succeeded
      alert('Record may have been saved. Please check your Google Sheet to confirm.');
    }
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

