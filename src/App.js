import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './App.css';
// Componentes existentes
import Dashboard from './components/Dashboard';
import Gauge from './components/Gauge';
import VerticalNavbarAccordion from './components/VerticalNavbarAccordion';
import ManageGroups from './components/ManageGroups';
import { GroupsProvider, useGroups } from './components/GroupsContext';
import Registros from "./components/Registros";
import Configuraciones from './components/Configuraciones';
// Nuevo componente Menu
import Menu from './components/Menu';

function App() {
  const [currentPage, setCurrentPage] = useState('Menu');
  
  return (
    <GroupsProvider>
      <Router>
        <VerticalNavbarAccordion />
        <div style={{ marginLeft: '280px', padding: '1rem' }}>
          <Routes>
            <Route path="/manage-groups" element={<ManageGroups />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/asset" element={<Asset />} />
            <Route path="/group" element={<Group />} />
            <Route path="/cocoon" element={<Cocoon />} />
            <Route path="/management" element={<Management />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/grupo/:groupId/gauges" element={<GroupGauges />} />
            <Route path="/grupo/:groupId/config" element={<GroupConfig />} />
            <Route path="/configuraciones" element={<Configuraciones />} />
            <Route path="/registros" element={<Registros />} />
            <Route path="/" element={<Menu />} />
          </Routes>
        </div>
      </Router>
    </GroupsProvider>
  );
}

// Componente TopNavbar para la parte superior
function TopNavbar({ currentPage }) {
  return (
    <div className="top-navbar">
      <div className="top-navbar-content">
        <div className="current-path">
          <span className="path-label">Estás en:</span> {currentPage}
        </div>
        <div className="top-navbar-user">
          <span className="user-name">John Doe</span>
          <div className="user-avatar">JD</div>
        </div>
      </div>
    </div>
  );
}

// Componente Fleet mejorado con listado de vehículos
function Fleet() {
  const fleetData = [
    { id: 1, name: 'Truck-A1', status: 'online', lastActivity: '10 min ago', location: 'Zona Norte', fuelLevel: 78 },
    { id: 2, name: 'Generator-B2', status: 'maintenance', lastActivity: '2 hours ago', location: 'Zona Central', fuelLevel: 45 },
    { id: 3, name: 'Bulldozer-C3', status: 'offline', lastActivity: '1 day ago', location: 'Zona Sur', fuelLevel: 12 },
    { id: 4, name: 'Excavator-D4', status: 'online', lastActivity: '30 min ago', location: 'Zona Este', fuelLevel: 65 },
    { id: 5, name: 'Crane-E5', status: 'online', lastActivity: '45 min ago', location: 'Zona Oeste', fuelLevel: 92 }
  ];

  return (
    <div className="main-content">
      <div className="container">
        <h1>Fleet Management</h1>
        <p>Visualiza y gestiona tu flota de vehículos y activos.</p>
        
        <div className="card-grid">
          <div className="card">
            <div className="card-header">Total Assets</div>
            <div className="big-number">50</div>
          </div>
          <div className="card">
            <div className="card-header">Online</div>
            <div className="big-number">42</div>
          </div>
          <div className="card">
            <div className="card-header">Maintenance</div>
            <div className="big-number">5</div>
          </div>
          <div className="card">
            <div className="card-header">Offline</div>
            <div className="big-number">3</div>
          </div>
        </div>
        
        <div className="fleet-table-container">
          <div className="table-header">
            <h2>Fleet List</h2>
            <input 
              type="text" 
              placeholder="Buscar activo..." 
              className="search-input" 
              style={{ maxWidth: '300px', marginLeft: 'auto' }}
            />
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asset Name</th>
                <th>Status</th>
                <th>Location</th>
                <th>Fuel Level</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fleetData.map(item => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <span className={`status status-${item.status}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{item.location}</td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${item.fuelLevel}%`,
                          backgroundColor: item.fuelLevel < 20 ? '#dc3545' : 
                                          item.fuelLevel < 50 ? '#ffc107' : '#28a745'
                        }}
                      ></div>
                      <span className="progress-text">{item.fuelLevel}%</span>
                    </div>
                  </td>
                  <td>{item.lastActivity}</td>
                  <td>
                    <button className="btn btn-primary btn-sm">View</button>
                    <button className="btn btn-secondary btn-sm" style={{marginLeft: '5px'}}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button className="btn btn-sm">Previous</button>
            <span className="page-info">Page 1 of 3</span>
            <button className="btn btn-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Asset mejorado con tarjetas detalladas
function Asset() {
  return (
    <div className="main-content">
      <div className="container">
        <h1>Asset Management</h1>
        <p>Gestiona los detalles de cada activo individual.</p>
        
        <div className="search-section" style={{display: 'flex', marginBottom: '20px'}}>
          <input type="text" placeholder="Buscar por nombre, ID o ubicación..." className="search-input" style={{flex: 1}}/>
          <select className="form-select" style={{width: '150px', marginLeft: '10px'}}>
            <option>Todos</option>
            <option>Online</option>
            <option>Offline</option>
            <option>Maintenance</option>
          </select>
          <button className="btn btn-primary" style={{marginLeft: '10px'}}>Buscar</button>
        </div>
        
        <div className="card-grid">
          <div className="card asset-card">
            <div className="card-header">Truck-A1</div>
            <div className="status-container">
              <span className="status status-online">ONLINE</span>
              <span className="asset-type">Vehículo</span>
            </div>
            <div className="asset-details">
              <div className="asset-detail-item">
                <span className="detail-label">Ubicación:</span>
                <span className="detail-value">Zona Norte</span>
              </div>
              <div className="asset-detail-item">
                <span className="detail-label">Combustible:</span>
                <span className="detail-value">78%</span>
              </div>
              <div className="asset-detail-item">
                <span className="detail-label">Última actividad:</span>
                <span className="detail-value">10 min ago</span>
              </div>
            </div>
            <div className="btn-container">
              <button className="btn btn-primary">Ver Detalles</button>
              <button className="btn btn-secondary">Ver Telemetría</button>
            </div>
          </div>

          <div className="card asset-card">
            <div className="card-header">Generator-B2</div>
            <div className="status-container">
              <span className="status status-maintenance">MAINTENANCE</span>
              <span className="asset-type">Generador</span>
            </div>
            <div className="asset-details">
              <div className="asset-detail-item">
                <span className="detail-label">Ubicación:</span>
                <span className="detail-value">Zona Central</span>
              </div>
              <div className="asset-detail-item">
                <span className="detail-label">Combustible:</span>
                <span className="detail-value">45%</span>
              </div>
              <div className="asset-detail-item">
                <span className="detail-label">Última actividad:</span>
                <span className="detail-value">2 hours ago</span>
              </div>
            </div>
            <div className="btn-container">
              <button className="btn btn-primary">Ver Detalles</button>
              <button className="btn btn-secondary">Ver Telemetría</button>
            </div>
          </div>

          <div className="card asset-card">
            <div className="card-header">Bulldozer-C3</div>
            <div className="status-container">
              <span className="status status-offline">OFFLINE</span>
              <span className="asset-type">Maquinaria</span>
            </div>
            <div className="asset-details">
              <div className="asset-detail-item">
                <span className="detail-label">Ubicación:</span>
                <span className="detail-value">Zona Sur</span>
              </div>
              <div className="asset-detail-item">
                <span className="detail-label">Combustible:</span>
                <span className="detail-value">12%</span>
              </div>
              <div className="asset-detail-item">
                <span className="detail-label">Última actividad:</span>
                <span className="detail-value">1 day ago</span>
              </div>
            </div>
            <div className="btn-container">
              <button className="btn btn-primary">Ver Detalles</button>
              <button className="btn btn-secondary">Ver Telemetría</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Group mejorado con estadísticas y gráficos
function Group() {
  return (
    <div className="main-content">
      <div className="container">
        <h1>Group Management</h1>
        <p>Organiza tus activos en grupos lógicos para una mejor gestión y monitoreo.</p>
        
        <div className="group-list">
          <h2>Grupos Activos</h2>
          <div className="card-grid">
            <div className="card group-card">
              <div className="card-header">Trucks Group</div>
              <div className="group-stats">
                <div className="stat-item">
                  <span className="stat-value">15</span>
                  <span className="stat-label">Activos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Online</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">3</span>
                  <span className="stat-label">Alertas</span>
                </div>
              </div>
              <div className="group-progress">
                <div className="progress-label">Uso combustible</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '65%'}}></div>
                </div>
                <div className="progress-label">Rendimiento</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '82%', backgroundColor: '#28a745'}}></div>
                </div>
              </div>
              <div className="group-actions">
                <button className="btn btn-primary">Ver Grupo</button>
                <button className="btn btn-secondary">Configurar</button>
              </div>
            </div>
            
            <div className="card group-card">
              <div className="card-header">Generators Group</div>
              <div className="group-stats">
                <div className="stat-item">
                  <span className="stat-value">8</span>
                  <span className="stat-label">Activos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">6</span>
                  <span className="stat-label">Online</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">1</span>
                  <span className="stat-label">Alertas</span>
                </div>
              </div>
              <div className="group-progress">
                <div className="progress-label">Uso combustible</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '45%'}}></div>
                </div>
                <div className="progress-label">Rendimiento</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '78%', backgroundColor: '#28a745'}}></div>
                </div>
              </div>
              <div className="group-actions">
                <button className="btn btn-primary">Ver Grupo</button>
                <button className="btn btn-secondary">Configurar</button>
              </div>
            </div>
            
            <div className="card group-card">
              <div className="card-header">Heavy Machinery</div>
              <div className="group-stats">
                <div className="stat-item">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Activos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">10</span>
                  <span className="stat-label">Online</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">2</span>
                  <span className="stat-label">Alertas</span>
                </div>
              </div>
              <div className="group-progress">
                <div className="progress-label">Uso combustible</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '72%'}}></div>
                </div>
                <div className="progress-label">Rendimiento</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '91%', backgroundColor: '#28a745'}}></div>
                </div>
              </div>
              <div className="group-actions">
                <button className="btn btn-primary">Ver Grupo</button>
                <button className="btn btn-secondary">Configurar</button>
              </div>
            </div>
            
            <div className="card group-card create-card">
              <div className="card-header">+ Nuevo Grupo</div>
              <div className="create-icon">+</div>
              <p className="create-text">Crea un nuevo grupo para organizar tus activos</p>
              <button className="btn btn-secondary" style={{marginTop: 'auto'}}>Crear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Cocoon mejorado con más detalles y estadísticas
function Cocoon() {
  return (
    <div className="main-content">
      <div className="container">
        <h1>Cocoon Management</h1>
        <p>Gestiona los cocoons del sistema y monitorea su rendimiento en tiempo real.</p>
        
        <div className="cocoon-status">
          <h2>Estado del Sistema</h2>
          <div className="card-grid">
            <div className="card">
              <div className="card-header">Cocoons Activos</div>
              <div className="big-number">5/7</div>
              <div className="change-indicator positive">+1 desde ayer</div>
            </div>
            <div className="card">
              <div className="card-header">Rendimiento</div>
              <div className="big-number">95%</div>
              <div className="change-indicator positive">+2.3% desde ayer</div>
            </div>
            <div className="card">
              <div className="card-header">Alertas del Sistema</div>
              <div className="big-number">2</div>
              <div className="change-indicator negative">+1 desde ayer</div>
            </div>
            <div className="card">
              <div className="card-header">Tiempo de Actividad</div>
              <div className="big-number">99.8%</div>
              <div className="change-indicator neutral">Sin cambios</div>
            </div>
          </div>
        </div>
        
        <div className="cocoon-list">
          <h2>Cocoons Disponibles</h2>
          <div className="card-grid">
            {[1, 2, 3, 4, 5].map(id => (
              <div key={id} className="card cocoon-card">
                <div className="cocoon-header">
                  <div className="cocoon-title">Cocoon #{id}</div>
                  <span className="status status-online">ACTIVO</span>
                </div>
                <div className="cocoon-stats">
                  <div className="cocoon-stat">
                    <span className="stat-label">Ubicación:</span>
                    <span className="stat-value">Zona {id}</span>
                  </div>
                  <div className="cocoon-stat">
                    <span className="stat-label">CPU:</span>
                    <div className="mini-progress">
                      <div className="mini-fill" style={{width: `${60 + id * 5}%`}}></div>
                      <span className="mini-text">{60 + id * 5}%</span>
                    </div>
                  </div>
                  <div className="cocoon-stat">
                    <span className="stat-label">Memoria:</span>
                    <div className="mini-progress">
                      <div className="mini-fill" style={{width: `${40 + id * 7}%`}}></div>
                      <span className="mini-text">{40 + id * 7}%</span>
                    </div>
                  </div>
                  <div className="cocoon-stat">
                    <span className="stat-label">Temperatura:</span>
                    <span className="stat-value">{35 + id}°C</span>
                  </div>
                </div>
                <div className="cocoon-actions">
                  <button className="btn btn-sm btn-primary">Detalles</button>
                  <button className="btn btn-sm btn-secondary">Reiniciar</button>
                  <button className="btn btn-sm btn-secondary">Configurar</button>
                </div>
              </div>
            ))}
            
            <div className="card cocoon-card offline">
              <div className="cocoon-header">
                <div className="cocoon-title">Cocoon #6</div>
                <span className="status status-offline">INACTIVO</span>
              </div>
              <div className="cocoon-stats inactive">
                <p className="offline-message">Este cocoon está actualmente fuera de línea.</p>
                <p className="offline-message">Último contacto: hace 3 días</p>
              </div>
              <div className="cocoon-actions">
                <button className="btn btn-sm btn-primary">Verificar Estado</button>
                <button className="btn btn-sm btn-secondary">Iniciar</button>
              </div>
            </div>
            
            <div className="card cocoon-card maintenance">
              <div className="cocoon-header">
                <div className="cocoon-title">Cocoon #7</div>
                <span className="status status-maintenance">MANTENIMIENTO</span>
              </div>
              <div className="cocoon-stats inactive">
                <p className="maintenance-message">Este cocoon está en mantenimiento programado.</p>
                <p className="maintenance-message">Regreso estimado: 2 horas</p>
              </div>
              <div className="cocoon-actions">
                <button className="btn btn-sm btn-primary">Ver Progreso</button>
                <button className="btn btn-sm btn-secondary">Finalizar Mantenimiento</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Management() {
  return (
    <div className="main-content">
      <div className="container">
        <h1>System Management</h1>
        <p>Administración y configuración del sistema.</p>
        
        <div className="management-options">
          <h2>Opciones de Administración</h2>
          <div className="card-grid">
            <div className="card">
              <div className="card-header">Usuarios</div>
              <p>Gestiona usuarios y permisos</p>
              <button className="btn btn-primary">Administrar</button>
            </div>
            <div className="card">
              <div className="card-header">Configuración</div>
              <p>Ajustes generales del sistema</p>
              <button className="btn btn-primary">Configurar</button>
            </div>
            <div className="card">
              <div className="card-header">Reportes</div>
              <p>Informes y estadísticas</p>
              <button className="btn btn-primary">Ver</button>
            </div>
            <div className="card">
              <div className="card-header">Alertas</div>
              <p>Configuración de notificaciones</p>
              <button className="btn btn-primary">Ajustar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Nuevo componente para visualizar gauges específicos de un grupo
function GroupGauges() {
  const { groupId } = useParams();
  const { groups } = useGroups();
  const [gaugeConfig, setGaugeConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastConfigUpdate, setLastConfigUpdate] = useState(Date.now());
  const configCheckIntervalRef = useRef(null);
  
  // Encuentra el grupo actual
  const currentGroup = groups.find(g => g.id === groupId) || { name: 'Desconocido', refNumber: '000' };
  
  // Función para verificar si hay cambios en la configuración
  const checkConfigChanges = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/gauge-config/check', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const { lastUpdate } = await response.json();
        
        // Si hay un cambio en la configuración, recargar
        if (lastUpdate > lastConfigUpdate) {
          console.log('Cambios detectados en GroupGauges, recargando configuración');
          fetchConfig();
          setLastConfigUpdate(lastUpdate);
        }
      }
    } catch (error) {
      console.error('Error al verificar cambios en la configuración:', error);
    }
  };
  
  // Cargar la configuración
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/gauge-config', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // El backend ahora envía directamente el array
        setGaugeConfig(data);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Configurar intervalo para verificar cambios
  useEffect(() => {
    // Carga inicial
    fetchConfig();
    
    // Verificar cambios cada 3 segundos
    configCheckIntervalRef.current = setInterval(checkConfigChanges, 3000);
    
    return () => {
      if (configCheckIntervalRef.current) {
        clearInterval(configCheckIntervalRef.current);
      }
    };
  }, []);
  
  if (loading) {
    return <div className="loading-indicator">Cargando...</div>;
  }
  
  return (
    <div className="main-content">
      <div className="group-header">
        <h1>{currentGroup.name}</h1>
        <span className="ref-number">Ref: {currentGroup.refNumber}</span>
        <p className="group-description">Visualización de medidores del grupo.</p>
      </div>
      
      <div className="gauge-dashboard-container">
        {Array.isArray(gaugeConfig) && gaugeConfig.map(gauge => (
          <Gauge
            key={gauge.id}
            id={gauge.id}
            title={gauge.name}
            unit={gauge.unit}
            initialValue={gauge.initialValue}
            minValue={gauge.min}
            maxValue={gauge.max}
            startColor={gauge.startColor}
            endColor={gauge.endColor}
          />
        ))}
      </div>
    </div>
  );
}

// Nuevo componente para configuración de grupo
function GroupConfig() {
  const { groupId } = useParams();
  const { groups } = useGroups();
  
  // Encuentra el grupo actual
  const currentGroup = groups.find(g => g.id === groupId) || { name: 'Desconocido', refNumber: '000' };
  
  return (
    <div className="main-content">
      <div className="group-header">
        <h1>Configuración: {currentGroup.name}</h1>
        <span className="ref-number">Ref: {currentGroup.refNumber}</span>
      </div>
      
      <div className="config-container">
        <h2>Configuraciones del Grupo</h2>
        <div className="config-form">
          <div className="form-group">
            <label>Nombre del Grupo</label>
            <input type="text" className="form-input" defaultValue={currentGroup.name} />
          </div>
          <div className="form-group">
            <label>Número de Referencia</label>
            <input type="text" className="form-input" defaultValue={currentGroup.refNumber} />
          </div>
          <div className="form-group">
            <label>Notificaciones</label>
            <select className="form-input">
              <option>Todas las alertas</option>
              <option>Solo alertas críticas</option>
              <option>Sin alertas</option>
            </select>
          </div>
          <div className="form-group">
            <label>Intervalo de Actualización</label>
            <select className="form-input">
              <option>5 segundos</option>
              <option>10 segundos</option>
              <option>30 segundos</option>
              <option>1 minuto</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary">Cancelar</button>
            <button className="btn btn-primary">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;