import React from 'react';
import { calculateAverageEfficiency } from '../utils/database';
import './Dashboard.css';

const Dashboard = ({ records }) => {
  const calculateStats = () => {
    if (records.length === 0) {
      return {
        totalRecords: 0,
        totalFuel: 0,
        totalDistance: 0,
        totalCost: 0,
        averageEfficiency: 0,
        bestEfficiency: 0,
        worstEfficiency: 0,
      };
    }

    const sortedRecords = [...records].sort((a, b) => a.odometer - b.odometer);
    
    const totalFuel = records.reduce((sum, r) => sum + r.fuelAmount, 0);
    const totalCost = records.reduce((sum, r) => sum + (r.price || 0), 0);
    
    const totalDistance = sortedRecords.length > 1 
      ? sortedRecords[sortedRecords.length - 1].odometer - sortedRecords[0].odometer
      : 0;
    
    const recordsWithEfficiency = records.filter(r => r.efficiency);
    const bestEfficiency = recordsWithEfficiency.length > 0
      ? Math.max(...recordsWithEfficiency.map(r => r.efficiency))
      : 0;
    const worstEfficiency = recordsWithEfficiency.length > 0
      ? Math.min(...recordsWithEfficiency.map(r => r.efficiency))
      : 0;

    const averageEfficiency = calculateAverageEfficiency(records);

    return {
      totalRecords: records.length,
      totalFuel: totalFuel.toFixed(2),
      totalDistance: totalDistance.toFixed(0),
      totalCost: totalCost.toFixed(2),
      averageEfficiency,
      bestEfficiency: bestEfficiency.toFixed(2),
      worstEfficiency: worstEfficiency.toFixed(2),
    };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">⛽ Fuelio Dashboard</h1>
      
      {stats.totalRecords === 0 ? (
        <div className="welcome-card">
          <h2>👋 Welcome to Fuelio!</h2>
          <p>Start tracking your fuel efficiency by adding your first record.</p>
          <div className="feature-list">
            <div className="feature">📷 Capture fuel bills with OCR</div>
            <div className="feature">📊 Read odometer automatically</div>
            <div className="feature">📈 Track fuel efficiency over time</div>
            <div className="feature">💾 All data stored locally on your device</div>
          </div>
        </div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Total Records</div>
              <div className="stat-value">{stats.totalRecords}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⛽</div>
            <div className="stat-content">
              <div className="stat-label">Total Fuel</div>
              <div className="stat-value">{stats.totalFuel} L</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛣️</div>
            <div className="stat-content">
              <div className="stat-label">Total Distance</div>
              <div className="stat-value">{stats.totalDistance} km</div>
            </div>
          </div>

          {stats.totalCost > 0 && (
            <div className="stat-card">
              <div className="stat-icon">💵</div>
              <div className="stat-content">
                <div className="stat-label">Total Cost</div>
                <div className="stat-value">₹{stats.totalCost}</div>
              </div>
            </div>
          )}

          {stats.averageEfficiency > 0 && (
            <div className="stat-card highlight">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-label">Average Efficiency</div>
                <div className="stat-value">{stats.averageEfficiency} km/L</div>
              </div>
            </div>
          )}

          {stats.bestEfficiency > 0 && (
            <div className="stat-card success">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-label">Best Efficiency</div>
                <div className="stat-value">{stats.bestEfficiency} km/L</div>
              </div>
            </div>
          )}

          {stats.worstEfficiency > 0 && stats.worstEfficiency !== stats.bestEfficiency && (
            <div className="stat-card warning">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <div className="stat-label">Lowest Efficiency</div>
                <div className="stat-value">{stats.worstEfficiency} km/L</div>
              </div>
            </div>
          )}
        </div>
      )}

      {records.length > 0 && (
        <div className="recent-activity">
          <h3>📅 Last Record</h3>
          <div className="last-record-card">
            <div className="last-record-item">
              <span>Odometer:</span>
              <strong>{records[records.length - 1].odometer.toLocaleString()} km</strong>
            </div>
            <div className="last-record-item">
              <span>Fuel:</span>
              <strong>{records[records.length - 1].fuelAmount} L</strong>
            </div>
            {records[records.length - 1].efficiency && (
              <div className="last-record-item">
                <span>Efficiency:</span>
                <strong>{records[records.length - 1].efficiency} km/L</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
