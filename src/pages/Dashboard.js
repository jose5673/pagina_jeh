import React from 'react';

const Dashboard = () => {
  return (
    <div className="main-content">
      <div className="container">
        <h1>Dashboard</h1>
        
        {/* Nueva sección de overview */}
        <section className="dashboard-section">
          <h2>Overview</h2>
          <div className="dashboard-overview">
            <div className="overview-grid">
              <div className="card">
                <div className="card-header">Fuel Level</div>
                <div className="parameter-value">78%</div>
                <div className="parameter-trend positive">▲ 2%</div>
              </div>
              <div className="card">
                <div className="card-header">Voltage</div>
                <div className="parameter-value">230V</div>
                <div className="parameter-trend stable">■ Stable</div>
              </div>
              <div className="card">
                <div className="card-header">Current</div>
                <div className="parameter-value">15A</div>
                <div className="parameter-trend negative">▼ 3A</div>
              </div>
              <div className="card">
                <div className="card-header">Power Factor</div>
                <div className="parameter-value">0.92</div>
                <div className="parameter-trend stable">■ Stable</div>
              </div>
              <div className="card">
                <div className="card-header">Engine Temperature</div>
                <div className="parameter-value">85°C</div>
                <div className="parameter-trend negative">▼ 2°C</div>
              </div>
              <div className="card">
                <div className="card-header">Oil Pressure</div>
                <div className="parameter-value">4.2 Bar</div>
                <div class="parameter-trend positive">▲ 0.3 Bar</div>
              </div>
            </div>
            
            <aside className="overview-events">
              <h3>Recent Events</h3>
              <ul className="events-list">
                <li className="event-item warning">
                  <span className="event-time">10:45 AM</span>
                  <span className="event-description">High temperature warning in Generator-B2</span>
                </li>
                <li className="event-item critical">
                  <span className="event-time">09:30 AM</span>
                  <span className="event-description">Low fuel level in Truck-A1</span>
                </li>
                <li className="event-item info">
                  <span className="event-time">08:15 AM</span>
                  <span className="event-description">Scheduled maintenance for Bulldozer-C3</span>
                </li>
                <li className="event-item warning">
                  <span className="event-time">Yesterday</span>
                  <span className="event-description">Battery voltage drop in Excavator-D4</span>
                </li>
                <li className="event-item info">
                  <span className="event-time">Yesterday</span>
                  <span className="event-description">System update completed successfully</span>
                </li>
              </ul>
              <button className="btn btn-secondary view-all-btn">View All Events</button>
            </aside>
          </div>
        </section>
        
        <section className="dashboard-section">
          <h2>My Dashboards</h2>
          <div className="card-grid">
            <div className="card">
              <div className="card-header">Overview</div>
              <p>General status of all assets and systems</p>
            </div>
            <div className="card">
              <div className="card-header">Fleet Status</div>
              <p>Current status of fleet vehicles and equipment</p>
            </div>
            <div className="card">
              <div className="card-header">Geolocation</div>
              <p>Interactive map showing asset locations</p>
            </div>
            <div className="card">
              <div className="card-header">Alarms</div>
              <p>Active and recent alarms across the fleet</p>
            </div>
            <div className="card">
              <div className="card-header">Full Data</div>
              <p>Comprehensive data tables and reports</p>
            </div>
            <div className="card">
              <div className="card-header">+ Create New Dashboard</div>
              <p>Design a custom dashboard with selected metrics</p>
            </div>
          </div>
        </section>
        
        <section className="dashboard-section">
          <h2>Other Dashboards</h2>
          <div className="card-grid">
            <div className="card">
              <div className="card-header">Maintenance Schedule</div>
              <p>View and manage upcoming maintenance tasks</p>
            </div>
            <div className="card">
              <div className="card-header">Fuel Consumption</div>
              <p>Analyze fuel usage patterns across the fleet</p>
            </div>
          </div>
        </section>
        
        <section className="dashboard-section">
          <h2>Quick Status</h2>
          <div className="card-grid">
            <div className="card">
              <div className="card-header">Assets Online</div>
              <div className="big-number">42/50</div>
            </div>
            <div className="card">
              <div className="card-header">Active Alarms</div>
              <div className="big-number">7</div>
            </div>
            <div className="card">
              <div className="card-header">Maintenance Due</div>
              <div className="big-number">3</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
