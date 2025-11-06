import React from 'react';
import './RecordsList.css';

const RecordsList = ({ records, onDelete }) => {
  if (records.length === 0) {
    return (
      <div className="empty-state">
        <p>📝 No fuel records yet</p>
        <p className="subtext">Add your first record to start tracking!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="records-list">
      <h2>📋 Fuel Records</h2>
      <div className="records-container">
        {sortedRecords.map((record, index) => (
          <div key={record.id} className="record-card">
            <div className="record-header">
              <span className="record-number">#{sortedRecords.length - index}</span>
              <span className="record-date">{formatDate(record.date)}</span>
            </div>
            
            <div className="record-body">
              <div className="record-detail">
                <span className="icon">📊</span>
                <div>
                  <div className="detail-label">Odometer</div>
                  <div className="detail-value">{record.odometer.toLocaleString()} km</div>
                </div>
              </div>
              
              <div className="record-detail">
                <span className="icon">⛽</span>
                <div>
                  <div className="detail-label">Fuel Amount</div>
                  <div className="detail-value">{record.fuelAmount} L</div>
                </div>
              </div>
              
              {record.price > 0 && (
                <div className="record-detail">
                  <span className="icon">💵</span>
                  <div>
                    <div className="detail-label">Price</div>
                    <div className="detail-value">₹{record.price.toFixed(2)}</div>
                  </div>
                </div>
              )}
              
              {record.efficiency && (
                <div className="record-detail highlight">
                  <span className="icon">📈</span>
                  <div>
                    <div className="detail-label">Efficiency</div>
                    <div className="detail-value">{record.efficiency} km/L</div>
                  </div>
                </div>
              )}
              
              {record.notes && (
                <div className="record-notes">
                  <strong>Notes:</strong> {record.notes}
                </div>
              )}
            </div>
            
            <div className="record-footer">
              <button 
                className="btn-delete"
                onClick={() => onDelete(record.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordsList;
