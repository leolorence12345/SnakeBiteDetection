import React, { useState } from 'react';

function ClinicalConfirmation({ predictedSpecies, imageUrl, record, onSave }) {
  const [clinical, setClinical] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const getImagePath = (species) => {
    // Map species names to actual image filenames
    const imageMap = {
      "Monocled Cobra": "monocled_cobra.jpg",
      "Spectacled Cobra": "spectacled_cobra.jpg",
      "Russell's Viper": "russell's_viper.jpg",
      "Krait Species": "krait_species.jpg"
    };
    return `/images/${imageMap[species] || species.toLowerCase().replace(/\s+/g, '_').replace("'", '') + '.jpg'}`;
  };

  const handleSave = async () => {
    if (!clinical.trim()) {
      setError('Please enter clinical identification.');
      return;
    }

    setError('');
    setSaving(true);

    const finalData = {
      ...record,
      "Clinical Snake": clinical,
      "Clinical Notes": clinicalNotes
    };

    // Call the onSave callback which will send to backend API
    // The backend will save to Google Sheets
    try {
      onSave(finalData);
    } catch (err) {
      setError('Error saving record. Please try again.');
      console.error('Save error:', err);
      setSaving(false);
    }
  };

  return (
    <div className="form-container">
      <div className="prediction-result">
        <h2>Predicted Snake: {predictedSpecies}</h2>
        <div className="image-container">
          <img
            src={getImagePath(predictedSpecies)}
            alt={predictedSpecies}
            className="image-preview predicted-snake-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none', color: '#ffa726' }}>
            Image not available.
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="clinical">Clinical Snake Identification *</label>
        <input
          type="text"
          id="clinical"
          value={clinical}
          onChange={(e) => {
            setClinical(e.target.value);
            setError('');
          }}
          placeholder="Enter confirmed species"
        />
      </div>

      <div className="form-group">
        <label htmlFor="clinicalNotes">Additional Clinical Notes (optional)</label>
        <textarea
          id="clinicalNotes"
          value={clinicalNotes}
          onChange={(e) => setClinicalNotes(e.target.value)}
          placeholder="Enter any additional clinical notes"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Final Record'}
      </button>
    </div>
  );
}

export default ClinicalConfirmation;

