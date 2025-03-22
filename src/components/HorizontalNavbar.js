import React, { useState } from 'react';

function HorizontalNavbar({ currentPage, setCurrentPage }) {
  // Estado para controlar el menú desplegable
  const [openMenuId, setOpenMenuId] = useState(null);

  // Definición de menús y submenús con iconos
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', subItems: [] },
    { id: 'fleet', label: 'Fleet', icon: 'fas fa-truck', subItems: [] },
    { id: 'asset', label: 'Asset', icon: 'fas fa-boxes-stacked', subItems: [] },
    { id: 'group', label: 'Group', icon: 'fas fa-layer-group', subItems: [] },
    { id: 'cocoon', label: 'Cocoon', icon: 'fas fa-cube', subItems: [] },
    { 
      id: 'management', 
      label: 'Management', 
      icon: 'fas fa-cogs',
      subItems: [
        { id: 'gaugeSettings', label: 'Configuración de Niveles' },
        { id: 'users', label: 'Usuarios', underConstruction: true },
        { id: 'reports', label: 'Reportes', underConstruction: true }
      ] 
    }
  ];

  // Manejar clic en un elemento del menú
  const handleMenuClick = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      setOpenMenuId(openMenuId === item.id ? null : item.id);
    } else {
      setCurrentPage(item.label);
      setOpenMenuId(null);
    }
  };

  // Manejar clic en un elemento del submenú
  const handleSubMenuClick = (e, menuId, subItem) => {
    e.stopPropagation(); // Evitar que se cierre el menú principal
    
    if (subItem.underConstruction) {
      alert('Sección en construcción');
      return;
    }
    
    if (menuId === 'management' && subItem.id === 'gaugeSettings') {
      setCurrentPage('GaugeSettings');
    } else {
      setCurrentPage(`${menuId}-${subItem.id}`);
    }
    
    setOpenMenuId(null);
  };

  return (
    <header className="horizontal-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <span>H&H GRUPOS</span>
        </div>
        
        {/* Menú principal con iconos */}
        <nav className="navbar-menu">
          <ul className="menu-list">
            {menuItems.map(item => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openMenuId === item.id;
              const isActive = currentPage === item.label || 
                              (item.id === 'management' && currentPage === 'GaugeSettings');
              
              return (
                <li 
                  key={item.id} 
                  className={`menu-item ${isActive ? 'active' : ''}`}
                >
                  <div 
                    className="menu-link"
                    onClick={() => handleMenuClick(item)}
                  >
                    <i className={`${item.icon} menu-icon`}></i>
                    <span>{item.label}</span>
                    {hasSubItems && (
                      <i className={`menu-arrow ${isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-right'}`}></i>
                    )}
                  </div>
                  
                  {/* Submenú desplegable */}
                  {hasSubItems && isOpen && (
                    <ul className="submenu">
                      {item.subItems.map(subItem => (
                        <li 
                          key={subItem.id}
                          className={`submenu-item ${currentPage === (subItem.id === 'gaugeSettings' ? 'GaugeSettings' : `${item.id}-${subItem.id}`) ? 'active' : ''}`}
                          onClick={(e) => handleSubMenuClick(e, item.id, subItem)}
                        >
                          <span>{subItem.label}</span>
                          {subItem.underConstruction && (
                            <span className="construction-badge">En construcción</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HorizontalNavbar;
