import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faTruck, faBoxes, faLayerGroup, faCube, 
  faCogs, faSitemap, faPlus, faCubes, faAngleDown, faAngleRight,
  faChartLine, faTachometerAlt 
} from '@fortawesome/free-solid-svg-icons';
import { useGroups } from './GroupsContext';

// Mapping de iconos
const iconMap = {
  'fa-home': faHome,
  'fa-truck': faTruck,
  'fa-boxes': faBoxes,
  'fa-layer-group': faLayerGroup,
  'fa-cube': faCube,
  'fa-cogs': faCogs,
  'fa-sitemap': faSitemap,
  'fa-plus': faPlus,
  'fa-cubes': faCubes,
  'fa-chart-line': faChartLine,
  'fa-tachometer-alt': faTachometerAlt
};

function VerticalNavbarAccordion() {
  // Obtener grupos del contexto
  const { groups = [] } = useGroups() || {};
  
  // Estado para ítems abiertos/cerrados
  const [openItems, setOpenItems] = useState({});
  // Estado para hover
  const [hoveredItem, setHoveredItem] = useState(null);
  // Estado específico para el menú de Grupo
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);

  // Construimos el array de menús actualizado
  const menuItems = [
    { label: 'Menú', icon: 'fa-home', link: '/', subItems: [] },
    { label: 'Dashboard', icon: 'fa-tachometer-alt', link: '/dashboard', subItems: [] },
    { label: 'Fleet', icon: 'fa-truck', link: '/fleet', subItems: [] },
    { label: 'Asset', icon: 'fa-boxes', link: '/asset', subItems: [] },
    // Esta entrada se manejará de forma especial
    { label: 'Group', icon: 'fa-layer-group', link: '#', isGroupMenu: true },
    { label: 'Cocoon', icon: 'fa-cube', link: '/cocoon', subItems: [] },
    {
      label: 'Management',
      icon: 'fa-cogs',
      link: '#',
      subItems: [
        { label: 'Usuarios', link: '/management/users?status=en-construccion' },
        { label: 'Reportes', link: '/management/reports?status=en-construccion' },
      ],
    },
    {
      label: 'Crear Nuevo Grupo',
      icon: 'fa-plus',
      link: '/manage-groups',
      subItems: [],
    },
  ];

  const toggleItem = (path) => {
    setOpenItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Función para alternar el menú de grupos
  const toggleGroupMenu = (e) => {
    e.preventDefault();
    setGroupMenuOpen(!groupMenuOpen);
  };

  /**
   * Render recursivo para ítems y subítems. 
   * Estilo "acordeón": subItems se muestran debajo en la misma columna.
   */
  const renderMenuItems = (items, parentPath = '', level = 0) => {
    return items.map((item, index) => {
      // Si es el menú de grupo, renderizarlo de forma especial
      if (item.isGroupMenu) {
        return renderGroupMenu(level);
      }

      const path = parentPath ? `${parentPath}-${index}` : `${index}`;
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isOpen = !!openItems[path];
      const isHovered = hoveredItem === path;

      // Manejo de clic
      const handleClick = (e) => {
        if (hasSubItems) {
          e.preventDefault();
          toggleItem(path);
        } else if (item.link.includes('en-construccion')) {
          e.preventDefault();
          alert('Sección en construcción');
        }
      };

      return (
        <div key={path} className="menu-item" style={{
          marginBottom: '2px',
          borderRadius: '6px',
          overflow: 'hidden',
          paddingLeft: level > 0 ? '15px' : '0',
        }}>
          {/* Cabecera */}
          <div
            className="menu-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              backgroundColor: isHovered ? '#f5f5f5' : isOpen ? '#f0f0f0' : 'transparent',
              color: isOpen ? '#ff9900' : '#333',
            }}
            onClick={handleClick}
            onMouseEnter={() => setHoveredItem(path)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Ícono */}
            <span style={{
              width: '20px',
              marginRight: '12px',
              fontSize: '16px',
              color: '#666',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FontAwesomeIcon icon={iconMap[item.icon] || faHome} />
            </span>
            
            {/* Texto o Link */}
            {!hasSubItems ? (
              <Link 
                to={item.link} 
                style={{
                  flex: 1,
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
                onClick={item.link.includes('en-construccion') ? (e) => {
                  e.preventDefault();
                  alert('Sección en construcción');
                } : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{
                flex: 1,
                fontSize: '0.95rem',
                fontWeight: '500',
              }}>
                {item.label}
              </span>
            )}

            {/* Flecha */}
            {hasSubItems && (
              <span style={{
                width: '20px',
                textAlign: 'center',
                color: '#888',
                transition: 'transform 0.3s'
              }}>
                <FontAwesomeIcon 
                  icon={isOpen ? faAngleDown : faAngleRight} 
                />
              </span>
            )}
          </div>

          {/* SubItems estilo acordeón */}
          {hasSubItems && isOpen && (
            <div 
              className="submenu-container"
              style={{
                backgroundColor: '#fbfbfb',
                borderLeft: '3px solid #ff9900', // Corregido: comilla simple extra eliminada
                marginLeft: '10px',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                maxHeight: isOpen ? '500px' : '0',
                opacity: isOpen ? 1 : 0,
                visibility: isOpen ? 'visible' : 'hidden',
              }}
            >
              {/* Llamada recursiva */}
              {renderMenuItems(item.subItems, path, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Función para renderizar el menú de grupo con su comportamiento especial
  const renderGroupMenu = (level) => {
    return (
      <div key="group-menu" className="menu-item" style={{
        marginBottom: '2px',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        {/* Cabecera del menú Grupo */}
        <div
          className="menu-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            backgroundColor: groupMenuOpen ? '#f0f0f0' : 'transparent',
            color: groupMenuOpen ? '#ff9900' : '#333',
          }}
          onClick={toggleGroupMenu}
        >
          {/* Ícono */}
          <span style={{
            width: '20px',
            marginRight: '12px',
            fontSize: '16px',
            color: '#666',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FontAwesomeIcon icon={faLayerGroup} />
          </span>
          
          {/* Texto */}
          <span style={{
            flex: 1,
            fontSize: '0.95rem',
            fontWeight: '500',
          }}>Grupo</span>

          {/* Flecha */}
          <span style={{
            width: '20px',
            textAlign: 'center',
            color: '#888',
            transition: 'transform 0.3s'
          }}>
            <FontAwesomeIcon 
              icon={groupMenuOpen ? faAngleDown : faAngleRight} 
            />
          </span>
        </div>

        {/* Submenú de grupos */}
        {groupMenuOpen && (
          <div className="submenu-container" style={{
            backgroundColor: '#fbfbfb',
            borderLeft: '3px solid #ff9900',
            marginLeft: '10px',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
          }}>
            {groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.id} style={{ paddingLeft: '15px' }}>
                  <div className="menu-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}>
                    <span style={{
                      width: '20px',
                      marginRight: '12px',
                      fontSize: '16px',
                      color: '#666',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <FontAwesomeIcon icon={faCubes} />
                    </span>
                    <Link to={`/grupo/${group.id}/gauges`} style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#333',
                      textDecoration: 'none',
                    }}>
                      {group.name} ({group.refNumber})
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                paddingLeft: '15px', 
                padding: '10px 16px', 
                fontSize: '0.9rem',
                color: '#777' 
              }}>
                No hay grupos disponibles
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      backgroundColor: '#ffffff',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto',
      zIndex: 999,
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        padding: '1.2rem',
        borderBottom: '1px solid #eaeaea',
        textAlign: 'center',
        backgroundColor: '#f8f8f8',
      }}>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 'bold',
          color: '#ff9900',
          letterSpacing: '0.5px',
        }}>H&H GRUPOS</span>
      </div>
      <div style={{ padding: '0.8rem 0.5rem' }}>
        {renderMenuItems(menuItems)}
      </div>
    </div>
  );
}

export default VerticalNavbarAccordion;
