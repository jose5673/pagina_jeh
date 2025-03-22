import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Fleet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Datos de ejemplo para la flota
  const fleetData = [
    { id: 1, name: 'Truck-A1', status: 'online', lastActivity: '10 min ago', fuelLevel: '75%', alerts: 0 },
    { id: 2, name: 'Truck-B2', status: 'maintenance', lastActivity: '2 hours ago', fuelLevel: '45%', alerts: 2 },
    { id: 3, name: 'Generator-C3', status: 'offline', lastActivity: '1 day ago', fuelLevel: '10%', alerts: 3 },
    { id: 4, name: 'Excavator-D4', status: 'online', lastActivity: '5 min ago', fuelLevel: '90%', alerts: 0 },
    { id: 5, name: 'Bulldozer-E5', status: 'online', lastActivity: '30 min ago', fuelLevel: '60%', alerts: 1 },
  ];
  
  // Filtrar datos según la búsqueda y filtro de estado
  const filteredData = fleetData.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="main-content">
      <div className="container">
        <h1>Fleet Management</h1>
        
        <div className="filters">
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Status</th>
              <th>Last Activity</th>
              <th>Fuel Level</th>
              <th>Alerts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(asset => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>
                  <span className={`status status-${asset.status}`}>
                    {asset.status.toUpperCase()}
                  </span>
                </td>
                <td>{asset.lastActivity}</td>
                <td>{asset.fuelLevel}</td>
                <td>{asset.alerts > 0 ? `${asset.alerts} alerts` : 'None'}</td>
                <td>
                  <Link to={`/asset/${asset.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fleet;
