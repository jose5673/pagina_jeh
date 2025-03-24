import React, { createContext, useContext, useState, useEffect } from 'react';

// Clave para localStorage
const STORAGE_KEY = 'h&h_grupos_data';

// Creamos el contexto para manejar los grupos electrógenos
const GroupsContext = createContext();

// Hook personalizado para facilitar el uso del contexto
export function useGroups() {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups debe usarse dentro de un GroupsProvider');
  }
  return context;
}

// Proveedor del contexto que mantiene el estado de los grupos
export function GroupsProvider({ children }) {
  // Inicializamos con datos de localStorage o valores predeterminados
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem(STORAGE_KEY);
    return savedGroups ? JSON.parse(savedGroups) : [
      { id: 'g1', name: 'Grupo Electrógeno 1', refNumber: '001' },
      { id: 'g2', name: 'Grupo Electrógeno 2', refNumber: '002' }
    ];
  });

  // Persistir en localStorage cuando cambia el estado
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  // Función para añadir un nuevo grupo
  const addGroup = (name, refNumber) => {
    // Generamos un ID único basado en timestamp
    const newId = `g${Date.now()}`;
    const newGroup = { id: newId, name, refNumber };
    
    // Actualizamos el estado
    setGroups(prevGroups => {
      const updatedGroups = [...prevGroups, newGroup];
      // Esta actualización provocará que el useEffect guarde en localStorage
      return updatedGroups;
    });
    
    return newGroup;
  };

  // Función para eliminar un grupo por su ID
  const deleteGroup = (groupId) => {
    // Confirmar antes de eliminar
    if (!window.confirm('¿Está seguro que desea eliminar este grupo?')) {
      return false;
    }
    
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
    return true;
  };

  // Función para exportar los datos como archivo JSON
  const exportData = () => {
    const data = JSON.stringify(groups, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grupos_electrogenos.json';
    document.body.appendChild(a);
    a.click();
    
    // Limpieza
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  // Función para importar datos desde un archivo JSON
  const importData = (jsonFile) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedGroups = JSON.parse(e.target.result);
        if (Array.isArray(importedGroups)) {
          setGroups(importedGroups);
        } else {
          throw new Error('El formato del archivo no es válido');
        }
      } catch (error) {
        alert(`Error al importar: ${error.message}`);
      }
    };
    
    reader.readAsText(jsonFile);
  };

  const value = {
    groups,
    addGroup,
    deleteGroup, // Añadida la función de eliminación
    exportData,
    importData
  };

  return (
    <GroupsContext.Provider value={value}>
      {children}
    </GroupsContext.Provider>
  );
}
