import React, { useState, useEffect } from 'react';
import ImageCapture from './ImageCapture';
import { addFuelRecord } from '../utils/database';
import './AddRecord.css';

const AddRecord = ({ onRecordAdded, lastOdometer }) => {
  const [formData, setFormData] = useState({
    odometer: '',
    fuelAmount: '',
    price: '',
    notes: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [efficiency, setEfficiency] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (lastOdometer && formData.odometer && formData.fuelAmount) {
      const distance = formData.odometer - lastOdometer;
      if (distance > 0) {
        const eff = (distance / formData.fuelAmount).toFixed(2);
        setEfficiency(eff);
      }
    }
  }, [formData.odometer, formData.fuelAmount, lastOdometer]);

  const handleOdometerData = (data) => {
    if (data.odometer) {
      setFormData(prev => ({ ...prev, odometer: data.odometer }));
    }
  };

  const handleFuelBillData = (data) => {
    const updates = {};
    if (data.fuelAmount) updates.fuelAmount = data.fuelAmount;
    if (data.price) updates.price = data.price;
    
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.odometer || !formData.fuelAmount) {
      alert('Please fill in odometer reading and fuel amount');
      return;
    }

    setSaving(true);
    try {
      await addFuelRecord({
        odometer: parseFloat(formData.odometer),
        fuelAmount: parseFloat(formData.fuelAmount),
        price: parseFloat(formData.price) || 0,
        notes: formData.notes,
        efficiency: efficiency ? parseFloat(efficiency) : null,
      });

      setFormData({
        odometer: '',
        fuelAmount: '',
        price: '',
        notes: '',
      });
      setCurrentStep(1);
      setEfficiency(null);
      
      if (onRecordAdded) {
        onRecordAdded();
      }
      
      alert('Record saved successfully!');
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Failed to save record. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-record">
      <div className="steps-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Odometer</div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Fuel Bill</div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Review</div>
      </div>

      {currentStep === 1 && (
        <div className="step-content">
          <h2>📊 Capture Odometer Reading</h2>
          <ImageCapture 
            type="odometer" 
            onExtractData={handleOdometerData} 
          />
          <div className="manual-input">
            <label>Odometer (km):</label>
            <input
              type="number"
              name="odometer"
              value={formData.odometer}
              onChange={handleInputChange}
              placeholder="Enter manually or capture"
              min="0"
            />
          </div>
          {formData.odometer && (
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentStep(2)}
            >
              Next →
            </button>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="step-content">
          <h2>⛽ Capture Fuel Bill</h2>
          <ImageCapture 
            type="fuel" 
            onExtractData={handleFuelBillData} 
          />
          <div className="manual-input">
            <label>Fuel Amount (L):</label>
            <input
              type="number"
              name="fuelAmount"
              value={formData.fuelAmount}
              onChange={handleInputChange}
              placeholder="Enter manually or capture"
              step="0.01"
              min="0"
            />
            
            <label>Price (optional):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Total price"
              step="0.01"
              min="0"
            />
          </div>
          <div className="step-navigation">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              ← Back
            </button>
            {formData.fuelAmount && (
              <button 
                className="btn btn-primary"
                onClick={() => setCurrentStep(3)}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="step-content">
          <h2>✅ Review & Save</h2>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="summary-card">
              <div className="summary-item">
                <span className="label">Odometer:</span>
                <span className="value">{formData.odometer} km</span>
              </div>
              <div className="summary-item">
                <span className="label">Fuel Amount:</span>
                <span className="value">{formData.fuelAmount} L</span>
              </div>
              {formData.price > 0 && (
                <div className="summary-item">
                  <span className="label">Price:</span>
                  <span className="value">₹{formData.price}</span>
                </div>
              )}
              {efficiency && (
                <div className="summary-item highlight">
                  <span className="label">Fuel Efficiency:</span>
                  <span className="value">{efficiency} km/L</span>
                </div>
              )}
            </div>

            <div className="manual-input">
              <label>Notes (optional):</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any notes..."
                rows="3"
              />
            </div>

            <div className="step-navigation">
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep(2)}
                disabled={saving}
              >
                ← Back
              </button>
              <button 
                type="submit"
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddRecord;
