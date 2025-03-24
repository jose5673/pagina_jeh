import React, { useState } from 'react';
import { useGroups } from './GroupsContext';

function ManageGroups() {
  const { groups, addGroup, deleteGroup } = useGroups();
  const [name, setName] = useState('');
  const [refNumber, setRefNumber] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !refNumber) {
      alert('Completa los campos');
      return;
    }
    addGroup(name, refNumber);
    setName('');
    setRefNumber('');
    alert('¡Grupo creado!');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este grupo?')) {
      deleteGroup(id);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Administrar Grupos</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: '2rem' }}>
        <h3>Crear Nuevo Grupo</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nombre del Grupo:</label>
          <input
            type="text"
            placeholder="Ej: Grupo X"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '0.4rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Número de Referencia:</label>
          <input
            type="text"
            placeholder="Ej: 123"
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            style={{ width: '100%', padding: '0.4rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Guardar
        </button>
      </form>
      <h3>Eliminar Grupos Existentes</h3>
      {groups.length === 0 ? (
        <p>No hay grupos registrados.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {groups.map((g) => (
            <li key={g.id} style={{ marginBottom: '0.5rem' }}>
              <span style={{ marginRight: '1rem' }}>
                {g.name} ({g.refNumber})
              </span>
              <button onClick={() => handleDelete(g.id)} style={{ padding: '0.3rem 0.6rem' }}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageGroups;
