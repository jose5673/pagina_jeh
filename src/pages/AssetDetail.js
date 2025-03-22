import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AssetDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a la API
    setTimeout(() => {
      setAssetData({
        id: parseInt(id),
        name: `Asset-${id}`,
        type: 'Truck',
        status: 'online',
        lastActivity: '10 min ago',
        metrics: {
          runningTime: '120 hours',
          activePower: '75 kW',
          powerFactor: '0.95',
          fuelConsumption: '12.5 L/h',
          battery: '95%',
          temperature: '65°C'
        },
        alarms: [
          { id: 1, type: 'warning', message: 'High temperature', timestamp: '2023-10-15 14:30:00' },
          { id: 2, type: 'critical', message: 'Low fuel level', timestamp: '2023-10-15 15:45:00' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return <div className="main-content container">Loading asset data...</div>;
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="asset-header">
          <h1>{assetData.name}</h1>
          <span className={`status status-${assetData.status}`}>
            {assetData.status.toUpperCase()}
          </span>
        </div>

        <div className="asset-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button 
            className={`tab-btn ${activeTab === 'alarms' ? 'active' : ''}`}
            onClick={() => setActiveTab('alarms')}
          >
            Alarms
          </button>
          <button 
            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fullData' ? 'active' : ''}`}
            onClick={() => setActiveTab('fullData')}
          >
            Full Data
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <h2>Overview</h2>
              <div className="card-grid">
                <div className="card metric-card">
                  <div className="card-header">Running Time</div>
                  <div className="metric-value">{assetData.metrics.runningTime}</div>
                </div>
                <div className="card metric-card">
                  <div className="card-header">Active Power</div>
                  <div className="metric-value">{assetData.metrics.activePower}</div>
                </div>
                <div className="card metric-card">
                  <div className="card-header">Power Factor</div>
                  <div className="metric-value">{assetData.metrics.powerFactor}</div>
                </div>
                <div className="card metric-card">
                  <div className="card-header">Fuel Consumption</div>
                  <div className="metric-value">{assetData.metrics.fuelConsumption}</div>
                </div>
                <div className="card metric-card">
                  <div className="card-header">Battery</div>
                  <div className="metric-value">{assetData.metrics.battery}</div>
                </div>
                <div className="card metric-card">
                  <div className="card-header">Temperature</div>
                  <div className="metric-value">{assetData.metrics.temperature}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="tab-pane">
              <h2>Reports</h2>
              <div className="reports-actions">
                <button className="btn btn-primary">Generate New Report</button>
                <button className="btn btn-secondary">Export to PDF</button>
                <button className="btn btn-secondary">Export to CSV</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Generated Date</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monthly Performance Report</td>
                    <td>2023-10-01</td>
                    <td>Performance</td>
                    <td>
                      <button className="btn btn-primary">View</button>
                      <button className="btn btn-secondary">Download</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Fuel Consumption Analysis</td>
                    <td>2023-09-15</td>
                    <td>Consumption</td>
                    <td>
                      <button className="btn btn-primary">View</button>
                      <button className="btn btn-secondary">Download</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'alarms' && (
            <div className="tab-pane">
              <h2>Alarms</h2>
              <div className="alarms-summary">
                <div className="card">
                  <div className="card-header">Active Alarms</div>
                  <div className="big-number">{assetData.alarms.length}</div>
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Timestamp</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assetData.alarms.map(alarm => (
                    <tr key={alarm.id}>
                      <td>
                        <span className={`status status-${alarm.type === 'critical' ? 'offline' : 'maintenance'}`}>
                          {alarm.type.toUpperCase()}
                        </span>
                      </td>
                      <td>{alarm.message}</td>
                      <td>{alarm.timestamp}</td>
                      <td>
                        <button className="btn btn-primary">Acknowledge</button>
                        <button className="btn btn-secondary">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="tab-pane">
              <h2>Summary</h2>
              <div className="summary-content">
                <p>This is a summary view for Asset-{id}.</p>
                <p>Last maintenance: 2023-09-30</p>
                <p>Next scheduled maintenance: 2023-11-15</p>
                <p>Total operating hours: 1,235 hours</p>
                <p>Average fuel consumption: 10.5 L/h</p>
              </div>
            </div>
          )}

          {activeTab === 'fullData' && (
            <div className="tab-pane">
              <h2>Full Data</h2>
              <div className="full-data-filters">
                <input type="date" className="date-filter" />
                <select className="data-type-filter">
                  <option value="all">All Data Types</option>
                  <option value="performance">Performance</option>
                  <option value="fuel">Fuel</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <button className="btn btn-primary">Apply Filters</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2023-10-15 16:00:00</td>
                    <td>Active Power</td>
                    <td>75</td>
                    <td>kW</td>
                  </tr>
                  <tr>
                    <td>2023-10-15 16:00:00</td>
                    <td>Fuel Consumption</td>
                    <td>12.5</td>
                    <td>L/h</td>
                  </tr>
                  <tr>
                    <td>2023-10-15 16:00:00</td>
                    <td>Temperature</td>
                    <td>65</td>
                    <td>°C</td>
                  </tr>
                  {/* Más datos irían aquí */}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
