import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function VerticalNavbarCascade() {
  // Ejemplo de menú con varios niveles
  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      link: '/dashboard',
      subItems: [],
    },
    {
      label: 'Management',
      icon: 'fas fa-cogs',
      link: '#',
      subItems: [
        { label: 'Configuración de Niveles', link: '/management/gauge-settings' },
        { label: 'Usuarios', link: '/management/users?status=en-construccion' },
        { label: 'Reportes', link: '/management/reports?status=en-construccion' },
      ],
    },
    {
      label: 'Grupo',
      icon: 'fas fa-sitemap',
      link: '#',
      subItems: [
        {
          label: 'Grupo Electrógeno 1 (001)',
          icon: 'fas fa-cubes',
          link: '#',
          subItems: [
            { label: 'Gauges', link: '/grupo/g1/gauges' },
            { label: 'Configuraciones', link: '/grupo/g1/config' },
          ],
        },
        {
          label: 'Grupo Electrógeno 2 (002)',
          icon: 'fas fa-cubes',
          link: '#',
          subItems: [
            { label: 'Gauges', link: '/grupo/g2/gauges' },
            { label: 'Configuraciones', link: '/grupo/g2/config' },
          ],
        },
      ],
    },
    {
      label: 'Crear Nuevo Grupo',
      icon: 'fas fa-plus',
      link: '/create-group',
      subItems: [],
    },
  ];

  // Estado para trackear qué ítems están abiertos (objeto con key = "path" y value = boolean)
  const [openItems, setOpenItems] = useState({});
  // Estado para trackear sobre qué elemento está el mouse (para submenús hover)
  const [hoveredItem, setHoveredItem] = useState(null);

  // Toggle de un ítem por su "path" único en la jerarquía
  const toggleItem = (path) => {
    setOpenItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Maneja el hover sobre un ítem
  const handleMouseEnter = (path) => {
    setHoveredItem(path);
  };

  // Maneja cuando el mouse sale de un ítem
  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  /**
   * Renderizado recursivo de menús y submenús en cascada.
   * - items: array de menús
   * - parentPath: string para identificar la ruta en la jerarquía (ej: "0-1-2")
   * - level: nivel de profundidad en el menú (0, 1, 2...)
   */
  const renderMenuItems = (items, parentPath = '', level = 0) => {
    return (
      <ul style={level === 0 ? styles.rootMenuList : styles.submenuList}>
        {items.map((item, index) => {
          // path único para cada item
          const path = parentPath ? `${parentPath}-${index}` : `${index}`;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = !!openItems[path] || hoveredItem === path;
          
          // Determinar posición del submenú según el nivel
          const submenuPosition = level === 0 
            ? styles.firstLevelSubmenu
            : styles.nestedSubmenu;

          return (
            <li 
              key={path} 
              style={styles.menuItem}
              onMouseEnter={() => handleMouseEnter(path)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Encabezado del ítem */}
              <div 
                style={{
                  ...styles.menuItemHeader,
                  ...(isOpen ? styles.activeItemHeader : {}),
                }} 
                onClick={() => hasSubItems && toggleItem(path)}
              >
                {item.icon && (
                  <i className={item.icon} style={styles.menuIcon} aria-hidden="true" />
                )}

                {/* Si NO hay subItems y NO está en construcción => Link real */}
                {!hasSubItems && !item.link.includes('en-construccion') && (
                  <Link to={item.link} style={styles.linkReset}>
                    <span style={styles.menuLabel}>{item.label}</span>
                  </Link>
                )}

                {/* Si NO hay subItems y SÍ está en construcción => alert */}
                {!hasSubItems && item.link.includes('en-construccion') && (
                  <span 
                    style={styles.menuLabel} 
                    onClick={() => alert('Sección en construcción')}
                  >
                    {item.label}
                  </span>
                )}

                {/* Si hay subItems => solo mostramos texto y flecha */}
                {hasSubItems && <span style={styles.menuLabel}>{item.label}</span>}

                {/* Flecha (► o ▼) */}
                {hasSubItems && (
                  <span style={styles.arrow}>
                    {isOpen ? '▼' : (level === 0 ? '▼' : '►')}
                  </span>
                )}
              </div>

              {/* Submenú recursivo si está abierto */}
              {hasSubItems && isOpen && (
                <div style={{
                  ...styles.submenuContainer,
                  ...submenuPosition
                }}>
                  {renderMenuItems(item.subItems, path, level + 1)}
                </div>
              )}
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

/** Estilos en JS para menú en cascada */
const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    overflowY: 'auto',
    zIndex: 999,
    fontFamily: 'Arial, sans-serif',
  },
  logoContainer: {
    padding: '1.2rem',
    borderBottom: '1px solid #f0f0f0',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#ffb100',
    letterSpacing: '0.5px',
  },
  rootMenuList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  submenuList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    width: '100%',
  },
  menuItem: {
    position: 'relative',
    borderBottom: '1px solid #f5f5f5',
  },
  menuItemHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.9rem 1.2rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    position: 'relative',
    zIndex: 2,
  },
  activeItemHeader: {
    backgroundColor: '#f8f9fa',
    color: '#ffb100',
  },
  menuIcon: {
    marginRight: '0.8rem',
    fontSize: '0.9rem',
    color: '#555',
    width: '18px',
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: '0.95rem',
    color: '#333',
    flex: 1,
  },
  linkReset: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flex: 1,
  },
  arrow: {
    marginLeft: '0.5rem',
    fontSize: '0.7rem',
    color: '#888',
  },
  submenuContainer: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    zIndex: 1000,
  },
  // Submenú de primer nivel (aparece debajo)
  firstLevelSubmenu: {
    position: 'relative',
    top: '0',
    left: '0',
    width: '100%',
    borderTop: '1px solid #f0f0f0',
  },
  // Submenús anidados (aparecen a la derecha)
  nestedSubmenu: {
    position: 'absolute',
    top: '0',
    left: '100%',
    minWidth: '180px',
  },
};

export default VerticalNavbarCascade;
