import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AddRecord from './components/AddRecord';
import RecordsList from './components/RecordsList';
import { getAllFuelRecords, deleteFuelRecord, initDB } from './utils/database';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      await initDB();
      const allRecords = await getAllFuelRecords();
      setRecords(allRecords);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAdded = () => {
    loadRecords();
    setActiveTab('dashboard');
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteFuelRecord(id);
        loadRecords();
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record. Please try again.');
      }
    }
  };

  const getLastOdometer = () => {
    if (records.length === 0) return null;
    const sortedRecords = [...records].sort((a, b) => b.odometer - a.odometer);
    return sortedRecords[0].odometer;
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-large"></div>
        <p>Loading Fuelio...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-logo">⛽ Fuelio</h1>
          <p className="app-tagline">Smart Fuel Efficiency Tracker</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          ➕ Add Record
        </button>
        <button
          className={`nav-button ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          📋 History
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard records={records} />}
        {activeTab === 'add' && (
          <AddRecord 
            onRecordAdded={handleRecordAdded}
            lastOdometer={getLastOdometer()}
          />
        )}
        {activeTab === 'records' && (
          <RecordsList 
            records={records}
            onDelete={handleDeleteRecord}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 Fuelio - All data stored locally on your device</p>
        {records.length > 0 && (
          <p className="footer-stats">
            📊 {records.length} record{records.length !== 1 ? 's' : ''} stored
          </p>
        )}
      </footer>
    </div>
  );
}

export default App;
