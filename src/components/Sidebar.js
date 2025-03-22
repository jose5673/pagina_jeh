import React, { useState } from 'react';

function Sidebar({ currentPage, setCurrentPage }) {
  // Estado para controlar qué submenús están abiertos
  const [openMenus, setOpenMenus] = useState({});

  // Definición de los menús y submenús
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      subItems: []
    },
    {
      id: 'fleet',
      label: 'Fleet',
      icon: 'fas fa-truck',
      subItems: []
    },
    {
      id: 'asset',
      label: 'Asset',
      icon: 'fas fa-boxes-stacked',
      subItems: []
    },
    {
      id: 'group',
      label: 'Group',
      icon: 'fas fa-layer-group',
      subItems: []
    },
    {
      id: 'cocoon',
      label: 'Cocoon',
      icon: 'fas fa-cube',
      subItems: []
    },
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

  // Función para alternar el estado de un submenú
  const toggleMenu = (id) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Función para manejar el clic en un ítem de menú
  const handleMenuClick = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleMenu(item.id);
    } else {
      setCurrentPage(item.label);
      // Cerramos otros submenús cuando navegamos a una nueva página
      setOpenMenus({});
    }
  };

  // Función para manejar el clic en un submenú
  const handleSubMenuClick = (e, menuId, subItem) => {
    e.stopPropagation();
    
    if (subItem.underConstruction) {
      alert('Sección en construcción');
      return;
    }
    
    if (menuId === 'management' && subItem.id === 'gaugeSettings') {
      setCurrentPage('GaugeSettings');
    } else {
      setCurrentPage(`${menuId}-${subItem.id}`);
    }
    
    // Corregido: usamos setOpenMenus en lugar de setOpenMenuId
    setOpenMenus({});
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <h2>H&H GRUPOS</h2>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map(item => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openMenus[item.id] || false;
          const isActive = !hasSubItems && currentPage === item.label;
          
          return (
            <li 
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''} ${isOpen ? 'expanded' : ''}`}
            >
              <div 
                className="sidebar-link"
                onClick={() => handleMenuClick(item)}
              >
                <i className={`${item.icon} sidebar-icon`}></i>
                <span>{item.label}</span>
                {hasSubItems && (
                  <span className="sidebar-arrow">
                    {isOpen ? '▼' : '►'}
                  </span>
                )}
              </div>
              
              {hasSubItems && isOpen && (
                <ul className="sidebar-submenu">
                  {item.subItems.map(subItem => (
                    <li 
                      key={subItem.id}
                      className={`sidebar-submenu-item ${currentPage === (subItem.id === 'gaugeSettings' ? 'GaugeSettings' : `${item.id}-${subItem.id}`) ? 'active' : ''}`}
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
  );
}

export default Sidebar;
