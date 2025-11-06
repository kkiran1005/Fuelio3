import React, { useState, useRef } from 'react';
import { processFuelBillImage, processOdometerImage } from '../utils/ocr';
import './ImageCapture.css';

const ImageCapture = ({ onExtractData, type = 'fuel' }) => {
  const [capturing, setCapturing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setProcessing(true);

    try {
      let result;
      if (type === 'fuel') {
        result = await processFuelBillImage(file);
      } else {
        result = await processOdometerImage(file);
      }
      
      onExtractData(result);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current.click();
  };

  const resetCapture = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-capture">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {!preview && (
        <div className="capture-controls">
          <button 
            className="btn btn-primary btn-large"
            onClick={handleCameraCapture}
            disabled={processing}
          >
            📷 {type === 'fuel' ? 'Capture Fuel Bill' : 'Capture Odometer'}
          </button>
        </div>
      )}

      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
          {processing && (
            <div className="processing-overlay">
              <div className="spinner"></div>
              <p>Processing image...</p>
            </div>
          )}
          {!processing && (
            <button 
              className="btn btn-secondary"
              onClick={resetCapture}
            >
              ↻ Retake
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageCapture;
