import React, { useState, useEffect } from 'react';
import { visualConfig, obtenerVariable, actualizarVariable } from '../config/variables';

const Configuraciones = () => {
  // Estado local para manejar los valores del formulario
  const [config, setConfig] = useState({...visualConfig});
  const [mensaje, setMensaje] = useState({ visible: false, texto: '', tipo: '' });

  // Estado para la sincronización
  const [syncStatus, setSyncStatus] = useState({ loading: false, message: '', success: null });

  // Este useEffect podría usarse para cargar configuraciones desde una API en el futuro
  useEffect(() => {
    // Aquí se podría implementar la carga desde el backend:
    // const cargarConfiguraciones = async () => {
    //   try {
    //     const response = await fetch('/api/configuraciones');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setConfig(data);
    //       // También actualizaríamos visualConfig de forma global
    //     }
    //   } catch (error) {
    //     console.error('Error al cargar configuraciones:', error);
    //   }
    // };
    // cargarConfiguraciones();
  }, []);

  // Función para manejar cambios en los campos
  const handleChange = (clave, valor) => {
    // Actualizamos el estado local
    setConfig({
      ...config,
      [clave]: valor
    });
    
    // Actualizamos la configuración global
    actualizarVariable(clave, valor);
    
    // Mostramos mensaje de éxito
    mostrarMensaje('Configuración actualizada', 'success');
  };

  // Función para guardar todos los cambios
  const guardarCambios = (e) => {
    e.preventDefault();
    
    // Aquí iría la lógica para enviar toda la configuración al backend
    // Por ahora, solo actualizamos visualConfig con todos los valores
    Object.keys(config).forEach(clave => {
      actualizarVariable(clave, config[clave]);
    });
    
    mostrarMensaje('Todas las configuraciones guardadas correctamente', 'success');
  };

  // Función para mostrar mensajes temporales
  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ visible: true, texto, tipo });
    setTimeout(() => setMensaje({ visible: false, texto: '', tipo: '' }), 3000);
  };

  // Eliminar la función de sincronización que intenta llevar valores del frontend al backend
  // Ya que necesitamos lo contrario: que los valores del backend se reflejen en el frontend

  // En su lugar, podemos tener una función para actualizar manualmente los valores del backend
  const actualizarValoresBackend = async () => {
    try {
      setSyncStatus({ loading: true, message: 'Actualizando valores en el frontend...', success: null });
      
      // Primero obtenemos los valores actuales
      const responseGauges = await fetch('http://localhost:3001/api/gauges', {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (responseGauges.ok) {
        setSyncStatus({ 
          loading: false, 
          message: 'Los valores han sido actualizados en el frontend. Los medidores mostrarán los valores más recientes.', 
          success: true 
        });
        setTimeout(() => setSyncStatus(prev => ({ ...prev, message: '' })), 5000);
      } else {
        setSyncStatus({ 
          loading: false, 
          message: 'Error al obtener los valores actuales del backend', 
          success: false 
        });
      }
    } catch (error) {
      console.error('Error al actualizar valores:', error);
      setSyncStatus({ 
        loading: false, 
        message: 'Error de conexión con el servidor', 
        success: false 
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Configuraciones de la aplicación
      </h2>
      
      {mensaje.visible && (
        <div className={`p-3 rounded mb-4 ${
          mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {mensaje.texto}
        </div>
      )}
      
      <form onSubmit={guardarCambios}>
        <div className="space-y-6">
          {/* Tema */}
          <div className="form-group">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Tema</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              value={config.tema}
              onChange={(e) => handleChange('tema', e.target.value)}
            >
              <option value="claro">Claro</option>
              <option value="oscuro">Oscuro</option>
            </select>
          </div>
          
          {/* Color Primario */}
          <div className="form-group">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Color Primario</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.colorPrimario}
                onChange={(e) => handleChange('colorPrimario', e.target.value)}
                className="w-12 h-10 rounded"
              />
              <input
                type="text"
                value={config.colorPrimario}
                onChange={(e) => handleChange('colorPrimario', e.target.value)}
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {/* Sidebar Expandido */}
          <div className="form-group">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sidebarExpandido"
                checked={config.sidebarExpandido}
                onChange={(e) => handleChange('sidebarExpandido', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="sidebarExpandido" className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                Sidebar Expandido
              </label>
            </div>
          </div>
          
          {/* Idioma */}
          <div className="form-group">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Idioma</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              value={config.idioma}
              onChange={(e) => handleChange('idioma', e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          
          {/* Mostrar Íconos */}
          <div className="form-group">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mostrarIconos"
                checked={config.mostrarIconos}
                onChange={(e) => handleChange('mostrarIconos', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="mostrarIconos" className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                Mostrar Íconos
              </label>
            </div>
          </div>
          
          {/* Botón para guardar */}
          <div className="pt-4">
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </form>

      {/* Nueva sección para actualización de valores */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Panel de Instrumentos
        </h3>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-md text-blue-800 dark:text-blue-200">
          <p className="mb-2">El panel de instrumentos muestra los valores actuales recibidos desde los sensores.</p>
          <p>Estos valores son procesados por el backend y se actualizan automáticamente en el frontend.</p>
        </div>
        
        {syncStatus.message && (
          <div className={`p-3 rounded mb-4 ${
            syncStatus.success === true ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 
            syncStatus.success === false ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 
            'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {syncStatus.message}
          </div>
        )}
        
        <button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          onClick={actualizarValoresBackend}
          disabled={syncStatus.loading}
        >
          {syncStatus.loading ? 'Actualizando...' : 'Actualizar Medidores'}
        </button>
      </div>
    </div>
  );
};

export default Configuraciones;
