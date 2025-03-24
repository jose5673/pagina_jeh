import React, { useState, useEffect } from 'react';

const Registros = () => {
  // Estado para almacenar los registros recibidos del backend
  const [registros, setRegistros] = useState([]);
  // Estado para manejar el formulario
  const [nuevoRegistro, setNuevoRegistro] = useState({
    temperatura: 0,
    tension: 0,
    presion: 0
  });
  // Estado para manejar registros en edición
  const [registroEditando, setRegistroEditando] = useState(null);
  // Estado para manejar mensajes de éxito/error
  const [mensaje, setMensaje] = useState({ visible: false, texto: '', tipo: '' });

  // Cargar registros al iniciar el componente
  useEffect(() => {
    cargarRegistros();
  }, []);

  // Función para cargar registros del backend
  const cargarRegistros = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/registros');
      if (response.ok) {
        const data = await response.json();
        setRegistros(data);
      } else {
        mostrarMensaje('Error al cargar los registros', 'error');
      }
    } catch (error) {
      console.error('Error al obtener registros:', error);
      mostrarMensaje('Error de conexión con el servidor', 'error');
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro({
      ...nuevoRegistro,
      [name]: parseFloat(value)
    });
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setRegistroEditando({
      ...registroEditando,
      [name]: parseFloat(value)
    });
  };

  // Función para enviar un nuevo registro
  const enviarRegistro = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/registros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoRegistro),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Limpiar formulario
        setNuevoRegistro({
          temperatura: 0,
          tension: 0,
          presion: 0
        });
        
        // Mostrar mensaje de éxito con información de actualización de gauges
        mostrarMensaje(`${data.mensaje} - Los medidores han sido actualizados automáticamente`, 'success');
        
        // Recargar la lista de registros
        cargarRegistros();
      } else {
        mostrarMensaje(data.mensaje || 'Error al enviar el registro', 'error');
      }
    } catch (error) {
      console.error('Error al enviar registro:', error);
      mostrarMensaje('Error de conexión con el servidor', 'error');
    }
  };

  // Función para actualizar un registro existente
  const actualizarRegistro = async (id, nuevosValores) => {
    try {
      const response = await fetch(`http://localhost:3001/api/registros/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevosValores),
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje(data.mensaje, "success");
        cargarRegistros();
        setRegistroEditando(null); // Cerrar modo edición
      } else {
        mostrarMensaje(data.mensaje || "Error al actualizar", "error");
      }
    } catch (error) {
      console.error("Error al actualizar registro:", error);
      mostrarMensaje("Error de conexión con el servidor", "error");
    }
  };

  // Iniciar edición de un registro
  const iniciarEdicion = (registro) => {
    setRegistroEditando(registro);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setRegistroEditando(null);
  };

  // Guardar cambios de edición
  const guardarEdicion = (e) => {
    e.preventDefault();
    actualizarRegistro(registroEditando.id, {
      temperatura: registroEditando.temperatura,
      tension: registroEditando.tension,
      presion: registroEditando.presion
    });
  };

  // Función para mostrar mensajes temporales
  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ visible: true, texto, tipo });
    setTimeout(() => setMensaje({ visible: false, texto: '', tipo: '' }), 3000);
  };

  // Formatear fecha para mostrar en la tabla
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString();
  };

  return (
    <div className="main-content">
      <div className="container">
        <h1 className="text-2xl font-bold mb-6">Registros Técnicos</h1>
        
        {mensaje.visible && (
          <div className={`p-3 rounded mb-4 ${
            mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {mensaje.texto}
          </div>
        )}
        
        {/* Añadir información sobre la conexión con los gauges */}
        <div className="bg-blue-50 p-4 rounded mb-6 text-blue-800 border border-blue-200">
          <h3 className="font-bold mb-2">Conexión con el panel de instrumentos</h3>
          <p>Cada vez que se añade o actualiza un registro, los valores del panel de instrumentos se actualizan automáticamente:</p>
          <ul className="list-disc ml-5 mt-2">
            <li>La temperatura actualiza el medidor de Temperatura</li>
            <li>La tensión actualiza el medidor de Voltaje</li>
            <li>La presión actualiza el medidor de Presión de Aceite</li>
            <li>Los demás medidores se actualizan según cálculos derivados de estos valores</li>
          </ul>
        </div>
        
        {/* Formulario de edición */}
        {registroEditando && (
          <div className="card mb-6">
            <div className="card-header bg-blue-600 text-white">Editar Registro</div>
            <form onSubmit={guardarEdicion} className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="form-group flex-1 min-w-[200px]">
                  <label className="block text-gray-700 font-medium mb-2">Temperatura (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperatura"
                    value={registroEditando.temperatura}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="form-group flex-1 min-w-[200px]">
                  <label className="block text-gray-700 font-medium mb-2">Tensión (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="tension"
                    value={registroEditando.tension}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="form-group flex-1 min-w-[200px]">
                  <label className="block text-gray-700 font-medium mb-2">Presión (Bar)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="presion"
                    value={registroEditando.presion}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Guardar Cambios
                </button>
                <button 
                  type="button"
                  onClick={cancelarEdicion}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Formulario para nuevo registro */}
        <div className="card">
          <div className="card-header">Añadir Nuevo Registro</div>
          <form onSubmit={enviarRegistro} className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="form-group flex-1 min-w-[200px]">
                <label className="block text-gray-700 font-medium mb-2">Temperatura (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="temperatura"
                  value={nuevoRegistro.temperatura}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="form-group flex-1 min-w-[200px]">
                <label className="block text-gray-700 font-medium mb-2">Tensión (V)</label>
                <input
                  type="number"
                  step="0.1"
                  name="tension"
                  value={nuevoRegistro.tension}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="form-group flex-1 min-w-[200px]">
                <label className="block text-gray-700 font-medium mb-2">Presión (Bar)</label>
                <input
                  type="number"
                  step="0.1"
                  name="presion"
                  value={nuevoRegistro.presion}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                type="submit"
                className="btn btn-primary"
              >
                Guardar Registro
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Historial de Registros</h2>
          
          {registros.length === 0 ? (
            <div className="text-center p-4 bg-gray-100 rounded">
              No hay registros disponibles
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Temperatura (°C)</th>
                  <th>Tensión (V)</th>
                  <th>Presión (Bar)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro, index) => (
                  <tr key={index}>
                    <td>{formatearFecha(registro.timestamp)}</td>
                    <td>
                      <span className={registro.temperatura > 80 ? 'text-red-600 font-bold' : ''}>
                        {registro.temperatura.toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <span className={registro.tension < 200 || registro.tension > 240 ? 'text-red-600 font-bold' : ''}>
                        {registro.tension.toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <span className={registro.presion > 8 ? 'text-red-600 font-bold' : ''}>
                        {registro.presion.toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => iniciarEdicion(registro)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registros;
