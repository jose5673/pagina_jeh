import React, { useState, useRef } from 'react';
import { useGroups } from '../context/GroupsContext';

function CreateGroup() {
  // Obtenemos las funciones del contexto
  const { groups, addGroup, deleteGroup, exportData, importData } = useGroups();
  
  // Estados locales para el formulario
  const [name, setName] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Referencia para el input file oculto
  const fileInputRef = useRef(null);
  
  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!name.trim() || !refNumber.trim()) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    try {
      // Agregar el nuevo grupo
      const newGroup = addGroup(name.trim(), refNumber.trim());
      
      // Mostrar mensaje de éxito
      setSuccess(`Grupo "${newGroup.name}" creado con éxito!`);
      
      // Limpiar el formulario
      setName('');
      setRefNumber('');
      setError('');
      
      // Regresar al dashboard después de 2 segundos
      setTimeout(() => {
        // Si se usa react-router: history.push('/dashboard');
        // Si no, un fallback sencillo:
        window.location.href = '#';
      }, 2000);
      
    } catch (err) {
      setError('Error al crear el grupo: ' + (err.message || 'Desconocido'));
    }
  };
  
  // Manejar la selección de archivo para importar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importData(file);
      setSuccess('Datos importados correctamente');
      // Limpiar input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = '';
    }
  };

  // Manejar la eliminación de un grupo
  const handleDeleteGroup = (groupId) => {
    const deleted = deleteGroup(groupId);
    if (deleted) {
      setSuccess('Grupo eliminado correctamente');
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1>Crear Nuevo Grupo Electrógeno</h1>
          
          {error && (
            <div className="alert-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert-success">
              <i className="fas fa-check-circle"></i>
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre del Grupo:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Grupo Electrógeno Principal"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="refNumber">Número de Referencia:</label>
              <input
                type="text"
                id="refNumber"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="Ej: 001"
                className="form-input"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save"></i> Guardar
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => window.location.href = '/'}
              >
                Cancelar
              </button>
            </div>
          </form>
          
          <div className="data-management" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <h2>Gestión de Datos</h2>
            <p>Exporta e importa tus grupos electrógenos como archivos JSON.</p>
            
            <div className="data-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={exportData}
              >
                <i className="fas fa-download"></i> Exportar Datos
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fas fa-upload"></i> Importar Datos
              </button>
              
              {/* Input oculto para seleccionar archivo */}
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
          </div>
          
          {/* Sección nueva: Lista de grupos existentes */}
          <div className="existing-groups" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <h2>Grupos Existentes</h2>
            {groups.length === 0 ? (
              <p>No hay grupos creados aún.</p>
            ) : (
              <ul className="group-list">
                {groups.map(group => (
                  <li key={group.id} className="group-item">
                    <div className="group-info">
                      <span className="group-name">{group.name}</span>
                      <span className="group-ref">Ref: {group.refNumber}</span>
                    </div>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteGroup(group.id)}
                      title="Eliminar grupo"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
