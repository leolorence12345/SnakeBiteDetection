import React, { useState, useEffect, useRef } from 'react';
import { LOCATION_OPTIONS, PLACE, LOCAL_SYMPTOMS, SYSTEMATIC_SYMPTOMS } from '../metadata';
import { predictSnakeSpecies, mapHourToTimeCategory, mapMonthToSeason } from '../utils/prediction';
import { API_ENDPOINTS } from '../config';
import { uploadImageToImgur, imageToDataURL } from '../utils/imageUpload';

function SnakeBiteDetails({ identityInfo, onSubmit }) {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [finalDistrict, setFinalDistrict] = useState('');
  const [finalPincode, setFinalPincode] = useState('');
  const [overrideLocation, setOverrideLocation] = useState(false);
  const [manualPincode, setManualPincode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    district: '',
    pincode: '',
    hour: 12,
    minute: 0,
    meridian: 'AM',
    month: 'January',
    place: '',
    customPlace: '',
    localSymptoms: [],
    customLocalSymptoms: '',
    sysSymptoms: [],
    customSysSymptoms: '',
    notes: ''
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use CORS proxy to bypass CORS restrictions
            const corsProxy = 'https://cors-anywhere.herokuapp.com/';
            const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
            const response = await fetch(corsProxy + nominatimUrl);
            const data = await response.json();
            const address = data.address || {};
            const district = (address.state_district || '').toUpperCase();
            const pincode = address.postcode || '';
            setFinalDistrict(district);
            setFinalPincode(pincode);
            setFormData(prev => ({
              ...prev,
              district: district,
              pincode: pincode
            }));
          } catch (error) {
            console.error('Geocoding error:', error);
            // Silently fail - user can manually enter location
          }
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  }, []);

  // Match district with LOCATION_OPTIONS
  useEffect(() => {
    if (finalDistrict) {
      for (const districtKey in LOCATION_OPTIONS) {
        if (finalDistrict.includes(districtKey) || districtKey.includes(finalDistrict)) {
          setFinalDistrict(districtKey);
          setFormData(prev => ({
            ...prev,
            district: districtKey
          }));
          break;
        }
      }
    }
  }, [finalDistrict]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'overrideLocation') {
        setOverrideLocation(checked);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (checked) {
        // Add to array if checked
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      } else {
        // Remove from array if unchecked
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setCapturedImage(null);
      setShowCamera(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setShowCamera(true);
      // Use setTimeout to ensure the video element is rendered before setting srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
        setCapturedImage(file);
        setShowCamera(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }, 'image/jpeg');
    }
  };

  // Set up video stream when camera is shown
  useEffect(() => {
    if (showCamera && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [showCamera]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualPincode = async () => {
    if (!manualPincode || manualPincode.trim().length !== 6) {
      setLookupError('Please enter a valid 6-digit pincode.');
      return;
    }

    setLookupLoading(true);
    setLookupError('');

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${manualPincode.trim()}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const district = (postOffice.District || postOffice.DistrictName || '').toUpperCase();
        
        if (district) {
          setFinalDistrict(district);
          setFinalPincode(manualPincode.trim());
          setFormData(prev => ({
            ...prev,
            district: district,
            pincode: manualPincode.trim()
          }));
          setLookupError('');
        } else {
          setLookupError('District information not found for this pincode.');
        }
      } else {
        setLookupError('Invalid pincode. Please check and try again.');
      }
    } catch (error) {
      console.error('Pincode lookup error:', error);
      setLookupError('Error looking up pincode. Please check your internet connection and try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const hour24 = (formData.hour % 12) + (formData.meridian === 'PM' ? 12 : 0);
      const timeKey = mapHourToTimeCategory(hour24);
      
      const monthNum = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ].indexOf(formData.month) + 1;
      const seasonKey = mapMonthToSeason(monthNum);
      
      const finalPlace = formData.customPlace || formData.place;
      const finalLocalSymptoms = formData.localSymptoms.filter(s => s !== 'Others');
      if (formData.customLocalSymptoms) {
        finalLocalSymptoms.push(formData.customLocalSymptoms);
      }
      const finalSysSymptoms = formData.sysSymptoms.filter(s => s !== 'Others');
      if (formData.customSysSymptoms) {
        finalSysSymptoms.push(formData.customSysSymptoms);
      }
      
      const prediction = predictSnakeSpecies({
        district: formData.district,
        timeKey,
        seasonKey,
        place: finalPlace,
        localSymptoms: finalLocalSymptoms,
        sysSymptoms: finalSysSymptoms,
        hasImage: !!(capturedImage || uploadedImage)
      });
      
      const imageFile = capturedImage || uploadedImage;
      let imageUrl = '';
      if (imageFile) {
        // Try to upload to Imgur (free, no backend needed)
        try {
          imageUrl = await uploadImageToImgur(imageFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          // Fallback: use data URL (base64 encoded image)
          try {
            imageUrl = await imageToDataURL(imageFile);
            console.log('Using data URL as fallback');
          } catch (dataUrlError) {
            console.error('Error creating data URL:', dataUrlError);
            alert('Warning: Could not process image. Continuing without image.');
          }
        }
      }
      
      const record = {
        ...identityInfo,
        District: formData.district || '',
        Time: timeKey || '',
        Season: seasonKey || '',
        Place: finalPlace || '',
        "Local symptoms": finalLocalSymptoms.join(', '),
        "Systematic symptoms": finalSysSymptoms.join(', '),
        Prediction: prediction,
        "Image URL": imageUrl,
        Notes: formData.notes
      };
      
      onSubmit({
        predictedSpecies: prediction,
        imageUrl: imageUrl,
        record: record,
        imageFile: imageFile
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeOptions = [...Object.keys(PLACE), 'Others'];
  const localOptions = [...Object.keys(LOCAL_SYMPTOMS), 'Others'];
  const sysOptions = [...Object.keys(SYSTEMATIC_SYMPTOMS), 'Others'];

  return (
    <div className="form-container">
      <h2>Snake Bite Details</h2>
      <p style={{ marginBottom: '20px' }}>Upload or capture an image of the bite area:</p>
      
      <div className="form-row">
        <div className="form-group">
          {!showCamera ? (
            <button type="button" onClick={handleCameraCapture} style={{ marginTop: 0 }}>Open Camera</button>
          ) : (
            <div className="camera-container">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ 
                  width: '100%', 
                  borderRadius: '10px',
                  display: 'block',
                  backgroundColor: '#000',
                  minHeight: '300px',
                  objectFit: 'cover',
                  marginBottom: '15px'
                }} 
              />
              <button type="button" onClick={capturePhoto}>Capture Photo</button>
            </div>
          )}
          {capturedImage && (
            <div className="image-container">
              <img src={URL.createObjectURL(capturedImage)} alt="Captured" className="image-preview" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="file-upload" className="file-upload-label">
            Upload Image
          </label>
          <input
            type="file"
            id="file-upload"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileUpload}
            className="file-upload-input"
          />
          {uploadedImage && (
            <div className="image-container">
              <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" className="image-preview" />
            </div>
          )}
        </div>
      </div>

      {finalDistrict && (
        <div className="success-message">
          Auto Detected District: {finalDistrict} | Pincode: {finalPincode}
        </div>
      )}

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="overrideLocation"
          name="overrideLocation"
          checked={overrideLocation}
          onChange={handleChange}
        />
        <label htmlFor="overrideLocation" style={{ marginBottom: 0 }}>Provide location manually if not accurate</label>
      </div>

      {overrideLocation && (
        <div className="form-group">
          <label htmlFor="manualPincode">Enter Pincode</label>
          <div className="pincode-lookup-container">
            <input
              type="text"
              id="manualPincode"
              value={manualPincode}
              onChange={(e) => {
                setManualPincode(e.target.value);
                setLookupError('');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleManualPincode();
                }
              }}
              placeholder="Enter 6-digit pincode"
              maxLength="6"
              disabled={lookupLoading}
            />
            <button 
              type="button" 
              onClick={handleManualPincode} 
              className="lookup-button"
              disabled={lookupLoading || !manualPincode.trim()}
            >
              {lookupLoading ? 'Looking up...' : 'Lookup'}
            </button>
          </div>
          {lookupError && <div className="error-message">{lookupError}</div>}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="district">District</label>
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Enter district"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
          />
        </div>

        <div className="form-group">
          <label htmlFor="place">Where did the bite happen</label>
          <select
            id="place"
            name="place"
            value={formData.place}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {placeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {formData.place === 'Others' && (
          <div className="form-group">
            <label htmlFor="customPlace">Please specify the place of bite</label>
            <input
              type="text"
              id="customPlace"
              name="customPlace"
              value={formData.customPlace}
              onChange={handleChange}
              placeholder="Enter place"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="localSymptoms">Local symptoms</label>
          <div className="select-multiple" style={{ 
            border: '1px solid #4caf50', 
            borderRadius: '10px', 
            backgroundColor: '#184c18', 
            padding: '8px',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {localOptions.map(opt => (
              <div key={opt} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '5px',
                cursor: 'pointer'
              }} onClick={() => {
                const isChecked = formData.localSymptoms.includes(opt);
                handleCheckboxChange({ 
                  target: { value: opt, checked: !isChecked } 
                }, 'localSymptoms');
              }}>
                <input
                  type="checkbox"
                  id={`local_${opt}`}
                  name="localSymptoms"
                  value={opt}
                  checked={formData.localSymptoms.includes(opt)}
                  onChange={(e) => handleCheckboxChange(e, 'localSymptoms')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor={`local_${opt}`} style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal', flex: 1 }}>
                  {opt}
                </label>
              </div>
            ))}
          </div>
        </div>

        {formData.localSymptoms.includes('Others') && (
          <div className="form-group">
            <label htmlFor="customLocalSymptoms">Specify other local symptoms</label>
            <input
              type="text"
              id="customLocalSymptoms"
              name="customLocalSymptoms"
              value={formData.customLocalSymptoms}
              onChange={handleChange}
              placeholder="Enter symptoms"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="sysSymptoms">Systematic symptoms</label>
          <div className="select-multiple" style={{ 
            border: '1px solid #4caf50', 
            borderRadius: '10px', 
            backgroundColor: '#184c18', 
            padding: '8px',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {sysOptions.map(opt => (
              <div key={opt} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '5px',
                cursor: 'pointer'
              }} onClick={() => {
                const isChecked = formData.sysSymptoms.includes(opt);
                handleCheckboxChange({ 
                  target: { value: opt, checked: !isChecked } 
                }, 'sysSymptoms');
              }}>
                <input
                  type="checkbox"
                  id={`sys_${opt}`}
                  name="sysSymptoms"
                  value={opt}
                  checked={formData.sysSymptoms.includes(opt)}
                  onChange={(e) => handleCheckboxChange(e, 'sysSymptoms')}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor={`sys_${opt}`} style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal', flex: 1 }}>
                  {opt}
                </label>
              </div>
            ))}
          </div>
        </div>

        {formData.sysSymptoms.includes('Others') && (
          <div className="form-group">
            <label htmlFor="customSysSymptoms">Specify other systemic symptoms</label>
            <input
              type="text"
              id="customSysSymptoms"
              name="customSysSymptoms"
              value={formData.customSysSymptoms}
              onChange={handleChange}
              placeholder="Enter symptoms"
            />
          </div>
        )}

        <h3>Bite Time</h3>
        <div className="time-selectors">
          <div className="form-group">
            <label htmlFor="hour">Hour</label>
            <select
              id="hour"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="minute">Minute</label>
            <select
              id="minute"
              name="minute"
              value={formData.minute}
              onChange={handleChange}
            >
              {Array.from({ length: 60 }, (_, i) => i).map(m => (
                <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="meridian">AM/PM</label>
            <select
              id="meridian"
              name="meridian"
              value={formData.meridian}
              onChange={handleChange}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <h3>Month of Bite</h3>
        <div className="form-group">
          <label htmlFor="month">Month</label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
          >
            {["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes"
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span className="loader"></span>
              Processing...
            </span>
          ) : (
            'Submit Snake Bite Details'
          )}
        </button>
      </form>
    </div>
  );
}

export default SnakeBiteDetails;

