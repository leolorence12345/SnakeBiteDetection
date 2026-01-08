import React from 'react';

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Victim Details' },
    { number: 2, label: 'Bite Details' },
    { number: 3, label: 'Clinical Confirmation' }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className={`step ${currentStep === step.number ? 'active' : ''}`}>
            <div className="step-number">{step.number}</div>
            <span className="step-label">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-line ${currentStep > step.number ? 'active' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default StepIndicator;

