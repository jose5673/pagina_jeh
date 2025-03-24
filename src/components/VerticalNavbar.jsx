import React, { useState } from 'react';

function VerticalNavbar({ currentPage, setCurrentPage }) {
  // Simulamos un array dinámico de grupos electrógenos
  const [groups] = useState([
    { id: 'g1', name: 'Grupo Electrógeno 1' },
    { id: 'g2', name: 'Grupo Electrógeno 2' },
    { id: 'g3', name: 'Grupo Electrógeno 3' }
  ]);

  // Estado para controlar qué ítems (y subítems) están abiertos
  // Usamos un objeto para poder controlar múltiples niveles
  const [openItems, setOpenItems] = useState({});

  // Función para alternar un ítem
  const toggleItem = (path) => {
    setOpenItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Configuración base de los ítems del menú principal
  const baseMenuItems = [
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

  // Agregamos el ítem "Grupo" con submenús dinámicos
  const menuItems = [
    ...baseMenuItems,
    {
      id: 'grupo',
      label: 'Grupo',
      icon: 'fas fa-sitemap',
      subItems: groups.map(group => ({
        id: group.id,
        label: group.name,
        icon: 'fas fa-cubes',
        subItems: [
          { id: `${group.id}-gauges`, label: 'Gauges' },
          { id: `${group.id}-config`, label: 'Configuraciones' }
        ]
      }))
    }
  ];

  // Función para manejar clic en ítems del menú
  const handleMenuClick = (item, path) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleItem(path);
    } else if (!item.underConstruction) {
      setCurrentPage(item.label);
    } else {
      alert('Sección en construcción');
    }
  };

  // Función para manejar clic en subítems
  const handleSubItemClick = (e, menuId, subItem, path) => {
    e.stopPropagation();
    
    if (subItem.underConstruction) {
      alert('Sección en construcción');
      return;
    }
    
    if (menuId === 'management' && subItem.id === 'gaugeSettings') {
      setCurrentPage('GaugeSettings');
    } else if (subItem.subItems && subItem.subItems.length > 0) {
      toggleItem(path);
    } else {
      setCurrentPage(`${menuId}-${subItem.id}`);
    }
  };

  // Función recursiva para renderizar ítems y subítems
  const renderMenuItems = (items, parentId = null, level = 0) => {
    return (
      <ul style={styles.menuList(level)}>
        {items.map((item, index) => {
          const path = parentId ? `${parentId}-${item.id}` : item.id;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openItems[path] || false;
          
          // Determinar si el ítem está activo
          const isActive = !hasSubItems && 
                         ((currentPage === item.label) || 
                          (parentId === 'management' && item.id === 'gaugeSettings' && currentPage === 'GaugeSettings'));
          
          return (
            <li 
              key={`${path}-${index}`}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.activeItem : {}),
                ...(isOpen ? styles.expandedItem : {})
              }}
            >
              <div 
                style={styles.menuItemHeader}
                onClick={() => handleMenuClick(item, path)}
              >
                {item.icon && (
                  <i className={item.icon} style={styles.menuIcon}></i>
                )}
                <span style={styles.menuLabel}>{item.label}</span>
                {hasSubItems && (
                  <span style={styles.arrow}>{isOpen ? '▼' : '►'}</span>
                )}
              </div>
              
              {/* Renderizar subítems de forma recursiva si el ítem está abierto */}
              {hasSubItems && isOpen && renderMenuItems(item.subItems, path, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <span style={styles.logoText}>H&H GRUPOS</span>
      </div>
      
      {renderMenuItems(menuItems)}
    </div>
  );
}

// Estilos como objeto JavaScript
const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '250px',
    height: '100vh',
    backgroundColor: '#ffffff',
    boxShadow: '1px 0 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflowY: 'auto',
    transition: 'all 0.3s ease'
  },
  logoContainer: {
    padding: '1.2rem 1rem',
    borderBottom: '1px solid #f0f0f0',
    textAlign: 'center'
  },
  logoText: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#ffb100',
    letterSpacing: '0.5px'
  },
  menuList: (level) => ({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    paddingLeft: level > 0 ? `${level * 15}px` : 0,
    backgroundColor: level > 0 ? '#f8f9fa' : 'transparent'
  }),
  menuItem: {
    borderLeft: '3px solid transparent',
    transition: 'all 0.2s ease'
  },
  activeItem: {
    borderLeftColor: '#ffb100',
    backgroundColor: '#f8f9fa'
  },
  expandedItem: {
    backgroundColor: '#f8f9fa'
  },
  menuItemHeader: {
    padding: '0.9rem 1.2rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    color: '#555',
    transition: 'color 0.2s'
  },
  menuIcon: {
    width: '20px',
    marginRight: '0.8rem',
    fontSize: '1rem',
    color: '#666',
    textAlign: 'center'
  },
  menuLabel: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  arrow: {
    position: 'absolute',
    right: '1.2rem',
    fontSize: '0.75rem',
    color: '#999'
  }
};

export default VerticalNavbar;
