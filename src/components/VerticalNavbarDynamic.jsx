import React, { useState } from 'react';
import { useGroups } from '../context/GroupsContext';

function VerticalNavbarDynamic({ currentPage, setCurrentPage }) {
  // Obtenemos los grupos del contexto
  const { groups } = useGroups();

  // Estado para controlar qué elementos del menú están expandidos
  const [openItems, setOpenItems] = useState({});

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

  // Agregamos el ítem "Grupo" con submenús dinámicos basados en los grupos
  // CAMBIO: Eliminamos la opción "Eliminar" del submenú de cada grupo
  const menuItems = [
    ...baseMenuItems,
    {
      id: 'grupo',
      label: 'Grupo',
      icon: 'fas fa-sitemap',
      subItems: groups.map(group => ({
        id: group.id,
        label: `${group.name} (${group.refNumber})`,
        icon: 'fas fa-cubes',
        subItems: [
          { id: `${group.id}-gauges`, label: 'Gauges' },
          { id: `${group.id}-config`, label: 'Configuraciones' }
          // Se eliminó la opción "Eliminar" de aquí
        ]
      }))
    },
    // Mantenemos la opción para crear nuevos grupos
    {
      id: 'create-group',
      label: 'Crear Nuevo Grupo',
      icon: 'fas fa-plus-circle',
      link: '/create-group',
      subItems: []
    }
  ];

  // Función para alternar la apertura/cierre de un elemento del menú
  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Función para manejar el clic en un ítem del menú
  const handleMenuClick = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleItem(item.id);
    } else if (item.id === 'create-group') {
      // Navegar a la página de creación de grupo sin usar react-router
      setCurrentPage('create-group');
    } else {
      setCurrentPage(item.label);
    }
  };

  // Función para manejar el clic en un subítem
  const handleSubItemClick = (e, menuId, subItem) => {
    e.stopPropagation();
    
    if (subItem.underConstruction) {
      alert('Sección en construcción');
      return;
    }
    
    // Eliminamos la verificación específica para la eliminación de grupos
    // ya que esa opción ya no está en el menú
    
    if (subItem.subItems && subItem.subItems.length > 0) {
      toggleItem(subItem.id);
    } else if (menuId === 'management' && subItem.id === 'gaugeSettings') {
      setCurrentPage('GaugeSettings');
    } else {
      setCurrentPage(`${menuId}-${subItem.id}`);
    }
  };

  // Función recursiva para renderizar el menú y sus submenús
  const renderMenuItems = (items, parentId = null, level = 0) => {
    return (
      <ul className="sidebar-menu" style={{ paddingLeft: level > 0 ? '15px' : '0' }}>
        {items.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openItems[item.id] || false;
          const isActive = !hasSubItems && currentPage === item.label || 
                         (item.id === 'create-group' && currentPage === 'create-group');
          
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
                  {item.subItems.map(subItem => {
                    const hasNestedItems = subItem.subItems && subItem.subItems.length > 0;
                    const isNestedOpen = openItems[subItem.id] || false;
                    
                    return (
                      <li 
                        key={subItem.id}
                        className={`sidebar-submenu-item`}
                        onClick={(e) => handleSubItemClick(e, item.id, subItem)}
                      >
                        {hasNestedItems ? (
                          <>
                            <div className="sidebar-sublink">
                              <span>{subItem.label}</span>
                              <span className="sidebar-arrow">
                                {isNestedOpen ? '▼' : '►'}
                              </span>
                            </div>
                            
                            {isNestedOpen && renderMenuItems(subItem.subItems, subItem.id, level + 1)}
                          </>
                        ) : (
                          <>
                            <span>{subItem.label}</span>
                            {subItem.underConstruction && (
                              <span className="construction-badge">En construcción</span>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <h2>H&H GRUPOS</h2>
      </div>
      
      {renderMenuItems(menuItems)}
    </nav>
  );
}

export default VerticalNavbarDynamic;
