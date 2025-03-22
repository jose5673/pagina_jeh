import React, { useState, useEffect } from 'react';
import './App.css';
import Gauge from './components/Gauge';
import Sidebar from './components/Sidebar';
import HorizontalNavbar from './components/HorizontalNavbar';

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

// Componente Navbar con enlaces de navegación
function Navbar({ currentPage, setCurrentPage, expandedMenu, setExpandedMenu }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'asset', label: 'Asset' },
    { id: 'group', label: 'Group' },
    { id: 'cocoon', label: 'Cocoon' },
    { id: 'management', label: 'Management' }
  ];
  
  // Función para manejar el clic en el ítem de Management
  const handleManagementClick = () => {
    if (currentPage !== 'Management') {
      setCurrentPage('Management'); 
    }
    setExpandedMenu(expandedMenu === 'management' ? null : 'management');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          Fleet Management
        </div>
        
        <ul className="navbar-menu">
          {menuItems.map(item => (
            item.id === 'management' ? (
              <li 
                key={item.id}
                className={`${currentPage === item.label ? 'active' : ''} ${expandedMenu === 'management' ? 'expanded' : ''}`}
                onClick={handleManagementClick}
              >
                <span>{item.label}</span>
                {expandedMenu === 'management' && (
                  <ul className="submenu">
                    <li 
                      className={currentPage === 'GaugeSettings' ? 'active' : ''}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage('GaugeSettings');
                      }}
                    >
                      <span>Configuración de Niveles</span>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li 
                key={item.id}
                className={currentPage === item.label ? 'active' : ''}
                onClick={() => setCurrentPage(item.label)}
              >
                <span>{item.label}</span>
              </li>
            )
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Componente GaugeSettings con diseño compacto
function GaugeSettings({ gaugeConfig, setGaugeConfig }) {
  const [localGauges, setLocalGauges] = useState([...gaugeConfig]);

  // Función para manejar cambios en los inputs
  const handleInputChange = (index, field, value) => {
    const updated = [...localGauges];
    updated[index][field] = Number(value);
    setLocalGauges(updated);
  };

  // Función para guardar la configuración
  const handleSave = () => {
    // Validar que min sea menor que max
    const isValid = localGauges.every(gauge => gauge.min < gauge.max);
    
    if (!isValid) {
      alert('Error: El valor mínimo debe ser menor que el máximo para todos los gauges.');
      return;
    }
    
    setGaugeConfig(localGauges);
    alert('¡Configuración guardada con éxito!');
  };

  // Mapeo de IDs a iconos de Font Awesome
  const iconMap = {
    'fuel': 'fas fa-gas-pump',
    'voltage': 'fas fa-bolt',
    'temperature': 'fas fa-thermometer-half',
    'oilPressure': 'fas fa-oil-can',
    'current': 'fas fa-bolt',
    'batteryLevel': 'fas fa-battery-half',
    'hoursOfUse': 'fas fa-clock',
    'operatingHours': 'fas fa-hourglass-half',
    'kva': 'fas fa-charging-station',
    'power': 'fas fa-plug'
  };

  return (
    <div className="main-content">
      <div className="gauge-settings-compact-container">
        {/* Cabecera condensada */}
        <div className="gauge-settings-compact-header">
          <h1>Configuración de Niveles</h1>
          <p className="gauge-settings-compact-subtitle">Ajusta los valores mínimos y máximos de cada medidor.</p>
        </div>
        
        {/* Grid compacto de tarjetas */}
        <div className="gauge-settings-compact-grid">
          {localGauges.map((gauge, idx) => {
            const range = gauge.max - gauge.min;
            const normalizedRange = Math.min(100, (range / 1000) * 100); // Normalizar para la barra
            
            return (
              <div key={gauge.id} className="gauge-compact-card">
                <div className="gauge-compact-header">
                  <i className={iconMap[gauge.id] || 'fas fa-tachometer-alt'} aria-hidden="true"></i>
                  <h3>{gauge.name}</h3>
                  <span className="gauge-compact-unit">{gauge.unit}</span>
                </div>
                
                <div className="gauge-compact-inputs">
                  <div className="gauge-compact-input-group">
                    <label htmlFor={`min-${gauge.id}`}>Mínimo</label>
                    <input
                      id={`min-${gauge.id}`}
                      type="number"
                      value={gauge.min}
                      onChange={(e) => handleInputChange(idx, 'min', e.target.value)}
                      className="gauge-compact-input"
                    />
                  </div>
                  
                  <div className="gauge-compact-input-group">
                    <label htmlFor={`max-${gauge.id}`}>Máximo</label>
                    <input
                      id={`max-${gauge.id}`}
                      type="number"
                      value={gauge.max}
                      onChange={(e) => handleInputChange(idx, 'max', e.target.value)}
                      className="gauge-compact-input"
                    />
                  </div>
                </div>
                
                {gauge.min >= gauge.max && (
                  <div className="gauge-compact-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Min debe ser menor que Max</span>
                  </div>
                )}
                
                <div className="gauge-compact-range">
                  <span className="gauge-compact-range-label">Rango:</span>
                  <div className="gauge-compact-range-bar">
                    <div 
                      className="gauge-compact-range-fill" 
                      style={{ width: `${normalizedRange}%` }}
                    ></div>
                  </div>
                  <span className="gauge-compact-range-value">{range}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="gauge-compact-save-button" onClick={handleSave}>
          <i className="fas fa-save"></i> Guardar
        </button>
      </div>
    </div>
  );
}

// Componente Dashboard simplificado para mostrar solo gauges en una cuadrícula
function Dashboard({ gaugeConfig }) {
  return (
    <div className="main-content dashboard-clean">
      <div className="gauge-dashboard-container">
        {gaugeConfig.map(gauge => (
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

// Componente Fleet
function Fleet() {
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
          <h2>Fleet List</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Truck-A1</td>
                <td><span className="status status-online">ONLINE</span></td>
                <td>10 min ago</td>
                <td><button className="btn btn-primary">View</button></td>
              </tr>
              <tr>
                <td>Generator-B2</td>
                <td><span className="status status-maintenance">MAINTENANCE</span></td>
                <td>2 hours ago</td>
                <td><button className="btn btn-primary">View</button></td>
              </tr>
              <tr>
                <td>Bulldozer-C3</td>
                <td><span className="status status-offline">OFFLINE</span></td>
                <td>1 day ago</td>
                <td><button className="btn btn-primary">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente Asset
function Asset() {
  return (
    <div className="main-content">
      <div className="container">
        <h1>Asset Management</h1>
        <p>Gestiona los detalles de cada activo individual.</p>
        
        <div className="asset-search">
          <input type="text" placeholder="Buscar activo..." className="search-input" />
          <button className="btn btn-primary">Buscar</button>
        </div>
        
        <div className="asset-list">
          <h2>Activos Recientes</h2>
          <div className="card-grid">
            <div className="card asset-card">
              <div className="card-header">Truck-A1</div>
              <p><span className="status status-online">ONLINE</span></p>
              <button className="btn btn-secondary">Ver Detalles</button>
            </div>
            <div className="card asset-card">
              <div className="card-header">Generator-B2</div>
              <p><span className="status status-maintenance">MAINTENANCE</span></p>
              <button className="btn btn-secondary">Ver Detalles</button>
            </div>
            <div className="card asset-card">
              <div className="card-header">Bulldozer-C3</div>
              <p><span className="status status-offline">OFFLINE</span></p>
              <button className="btn btn-secondary">Ver Detalles</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Group
function Group() {
  return (
    <div className="main-content">
      <div className="container">
        <h1>Group Management</h1>
        <p>Organiza tus activos en grupos lógicos.</p>
        
        <div className="group-list">
          <h2>Grupos Activos</h2>
          <div className="card-grid">
            <div className="card group-card">
              <div className="card-header">Trucks Group</div>
              <p>15 activos</p>
              <button className="btn btn-primary">Ver Grupo</button>
            </div>
            <div className="card group-card">
              <div className="card-header">Generators Group</div>
              <p>8 activos</p>
              <button className="btn btn-primary">Ver Grupo</button>
            </div>
            <div className="card group-card">
              <div className="card-header">Heavy Machinery</div>
              <p>12 activos</p>
              <button className="btn btn-primary">Ver Grupo</button>
            </div>
            <div className="card group-card">
              <div className="card-header">+ Nuevo Grupo</div>
              <p>Crear un nuevo grupo</p>
              <button className="btn btn-secondary">Crear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Cocoon
function Cocoon() {
  return (
    <div className="main-content">
      <div className="container">
        <h1>Cocoon Management</h1>
        <p>Gestiona los cocoons del sistema.</p>
        
        <div className="cocoon-status">
          <h2>Estado del Sistema</h2>
          <div className="card-grid">
            <div className="card">
              <div className="card-header">Cocoons Activos</div>
              <div className="big-number">5/7</div>
            </div>
            <div className="card">
              <div className="card-header">Rendimiento</div>
              <div className="big-number">95%</div>
            </div>
            <div className="card">
              <div className="card-header">Alertas del Sistema</div>
              <div className="big-number">2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Management
function Management() {
  return (
    <div className="main-content">
      <div className="container">
        <h1>System Management</h1>
        <p>Administración y configuración del sistema.</p>
        
        <div className="management-options">
          <h2>Opciones de Administración</h2>
          <div className="card-grid">
            <div class="card">
              <div class="card-header">Usuarios</div>
              <p>Gestiona usuarios y permisos</p>
              <button class="btn btn-primary">Administrar</button>
            </div>
            <div class="card">
              <div class="card-header">Configuración</div>
              <p>Ajustes generales del sistema</p>
              <button class="btn btn-primary">Configurar</button>
            </div>
            <div class="card">
              <div class="card-header">Reportes</div>
              <p>Informes y estadísticas</p>
              <button class="btn btn-primary">Ver</button>
            </div>
            <div class="card">
              <div class="card-header">Alertas</div>
              <p>Configuración de notificaciones</p>
              <button class="btn btn-primary">Ajustar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Función principal que renderiza el contenido según la página seleccionada
function renderContent(currentPage, gaugeConfig, setGaugeConfig) {
  switch(currentPage) {
    case 'Fleet':
      return <Fleet />;
    case 'Asset':
      return <Asset />;
    case 'Group':
      return <Group />;
    case 'Cocoon':
      return <Cocoon />;
    case 'Management':
      return <Management />;
    case 'GaugeSettings':
      return <GaugeSettings gaugeConfig={gaugeConfig} setGaugeConfig={setGaugeConfig} />;
    case 'Dashboard':
    default:
      return <Dashboard gaugeConfig={gaugeConfig} />;
  }
}

// Componente principal App
function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [expandedMenu, setExpandedMenu] = useState(null);
  
  // Estado actualizado para la configuración de los gauges con todos los medidores solicitados
  const [gaugeConfig, setGaugeConfig] = useState([
    { 
      id: 'fuel', 
      name: 'Nivel Combustible', 
      unit: '%', 
      initialValue: 78, 
      min: 0, 
      max: 100, 
      startColor: '#5a5d6d', 
      endColor: '#4287f5' 
    },
    { 
      id: 'voltage', 
      name: 'Voltaje', 
      unit: 'V', 
      initialValue: 230, 
      min: 190, 
      max: 240, 
      startColor: '#5a6d68', 
      endColor: '#00fabb' 
    },
    { 
      id: 'temperature', 
      name: 'Temperatura', 
      unit: '°C', 
      initialValue: 85, 
      min: -30, 
      max: 120, 
      startColor: '#6d5a5a', 
      endColor: '#ff7b00' 
    },
    { 
      id: 'oilPressure', 
      name: 'Presión de Aceite', 
      unit: 'Bar', 
      initialValue: 4.2, 
      min: 0, 
      max: 10, 
      startColor: '#5a6d64', 
      endColor: '#00fab0' 
    },
    { 
      id: 'current', 
      name: 'Corriente', 
      unit: 'A', 
      initialValue: 15, 
      min: 0, 
      max: 100, 
      startColor: '#6d625a', 
      endColor: '#ff9f00' 
    },
    { 
      id: 'batteryLevel', 
      name: 'Nivel de Batería', 
      unit: '%', 
      initialValue: 80, 
      min: 0, 
      max: 100, 
      startColor: '#5a6a6d', 
      endColor: '#00e1ff' 
    },
    { 
      id: 'hoursOfUse', 
      name: 'Horas de Uso', 
      unit: 'h', 
      initialValue: 250, 
      min: 0, 
      max: 9999, 
      startColor: '#665a6d', 
      endColor: '#d600ff' 
    },
    { 
      id: 'operatingHours', 
      name: 'Horas de Funcionamiento', 
      unit: 'h', 
      initialValue: 130, 
      min: 0, 
      max: 9999, 
      startColor: '#6d5a69', 
      endColor: '#ff00aa' 
    },
    { 
      id: 'kva', 
      name: 'kVA', 
      unit: 'kVA', 
      initialValue: 120, 
      min: 0, 
      max: 500, 
      startColor: '#5a676d', 
      endColor: '#00c3ff' 
    }
  ]);
  
  return (
    <div className="App">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      />
      {renderContent(currentPage, gaugeConfig, setGaugeConfig)}
    </div>
  );
}

export default App;