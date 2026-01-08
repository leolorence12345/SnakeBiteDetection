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
      const response = await fetch(API_ENDPOINTS.SAVE_RECORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Record saved successfully to Google Sheets!');
        // Reset to start
        setStep(1);
        setIdentityInfo(null);
        setBiteData(null);
      } else {
        alert(`Error saving record: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Error connecting to server. Please check your backend API configuration.');
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

