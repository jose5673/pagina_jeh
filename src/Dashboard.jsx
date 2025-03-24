import React, { useState, useEffect, useRef } from 'react';
import Gauge from './Gauge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faServer, faNetworkWired, faInfoCircle, faSync } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [gaugeValues, setGaugeValues] = useState({});
  const [gaugeConfig, setGaugeConfig] = useState([]); // Ahora se carga del backend
  const [loading, setLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [disconnectedTime, setDisconnectedTime] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [configChanged, setConfigChanged] = useState(false);
  
  // Referencias
  const lastValidValuesRef = useRef({});
  const intervalRef = useRef(null);
  const disconnectTimerRef = useRef(null);
  const configIntervalRef = useRef(null);
  const configCheckIntervalRef = useRef(null);
  const lastConfigUpdateRef = useRef(Date.now());
  const lastConfigTimestampRef = useRef(0);

  // Función para verificar si hay cambios en la configuración
  const checkConfigChanges = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/gauge-config/check', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const { lastUpdate } = await response.json();
        
        // Si el timestamp del servidor es más reciente que nuestro último dato
        if (lastUpdate > lastConfigTimestampRef.current) {
          console.log('Cambios detectados en la configuración de medidores', new Date().toLocaleTimeString());
          setConfigChanged(true);
          
          // Cargar automáticamente la nueva configuración
          await cargarConfiguracion();
          
          // Actualizar nuestro timestamp de referencia
          lastConfigTimestampRef.current = lastUpdate;
          
          // Forzar actualización de los valores de los medidores también
          await obtenerValoresGauges();
        }
      }
    } catch (error) {
      console.error('Error al verificar actualizaciones de configuración:', error);
    }
  };

  // Cargar la configuración de los medidores desde el backend
  const cargarConfiguracion = async () => {
    try {
      setConfigLoading(true);
      const response = await fetch('http://localhost:3001/api/gauge-config', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Asegurarnos de obtener los datos correctamente
        const configArray = data.config || data;
        
        // Limpiar la configuración anterior
        setGaugeConfig([]);
        
        // Usar setTimeout para asegurar que el DOM se actualice
        setTimeout(() => {
          // Actualizar con la nueva configuración
          setGaugeConfig(configArray);
          lastConfigUpdateRef.current = Date.now();
          lastConfigTimestampRef.current = data.lastUpdate || Date.now();
          console.log('Configuración de medidores actualizada:', new Date().toLocaleTimeString());
          
          // Restablecer el indicador de cambios
          setConfigChanged(false);
        }, 50);
      } else {
        console.error('Error al cargar la configuración de los medidores');
      }
    } catch (error) {
      console.error('Error de conexión al cargar la configuración:', error);
    } finally {
      setConfigLoading(false);
    }
  };
  
  // Configurar intervalo para recargar la configuración periódicamente
  useEffect(() => {
    // Carga inicial
    cargarConfiguracion();
    
    // Configurar intervalo para verificar cambios cada 3 segundos (más frecuente)
    configCheckIntervalRef.current = setInterval(checkConfigChanges, 3000);
    
    // Configurar un intervalo de respaldo para recargar cada 30 segundos
    configIntervalRef.current = setInterval(cargarConfiguracion, 30000);
    
    return () => {
      if (configIntervalRef.current) {
        clearInterval(configIntervalRef.current);
      }
      if (configCheckIntervalRef.current) {
        clearInterval(configCheckIntervalRef.current);
      }
    };
  }, []);

  // Función para obtener valores actuales de los gauges
  const obtenerValoresGauges = async () => {
    try {
      // Añadir un timestamp para evitar caché agresivo
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:3001/api/gauges?t=${timestamp}`, { 
        // Timeout más corto para respuesta rápida
        signal: AbortSignal.timeout(1500),
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Extraer los valores del objeto devuelto
        const values = data.values || data;
        
        // Registrar valores para depuración
        console.log(`Datos recibidos del backend a las ${new Date().toLocaleTimeString()}`, values);
        
        // Actualizar el estado con los valores actuales
        setGaugeValues(values);
        lastValidValuesRef.current = values;
        
        // Restablecer estados de error
        setError(null);
        setIsConnected(true);
        setRetryCount(0);
      } else {
        handleConnectionError('Error al obtener datos del servidor');
      }
    } catch (error) {
      // Ignorar errores de abort (causados por cleanup)
      if (error.name === 'AbortError') return;
      
      console.error('Error al conectar con el servidor:', error);
      handleConnectionError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar errores de conexión
  const handleConnectionError = (errorMessage) => {
    setError(errorMessage);
    setIsConnected(false);
    setRetryCount(prev => prev + 1);
    
    // Iniciar contador de tiempo desconectado
    if (!disconnectTimerRef.current) {
      disconnectTimerRef.current = setInterval(() => {
        setDisconnectedTime(prev => prev + 1);
      }, 1000);
    }
  };

  // Limpiar temporizador cuando se recupera la conexión
  useEffect(() => {
    if (isConnected && disconnectTimerRef.current) {
      clearInterval(disconnectTimerRef.current);
      disconnectTimerRef.current = null;
      setDisconnectedTime(0);
    }
    
    return () => {
      if (disconnectTimerRef.current) {
        clearInterval(disconnectTimerRef.current);
      }
    };
  }, [isConnected]);

  // Formatear el tiempo de desconexión
  const formatDisconnectedTime = () => {
    const minutes = Math.floor(disconnectedTime / 60);
    const seconds = disconnectedTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Configurar intervalo de actualización con backoff exponencial
  useEffect(() => {
    // Iniciar con obtención de valores - solo una vez al cargar
    obtenerValoresGauges();
    
    // Ya no configuramos intervalo automático para actualización continua
    // Solo mantenemos el intervalo para reintentos cuando hay desconexión
    if (!isConnected) {
      // Función para calcular tiempo de espera con backoff exponencial
      const getRetryDelay = () => {
        // Incrementar con backoff exponencial, máximo 10 segundos
        const baseDelay = Math.min(Math.pow(2, retryCount) * 250, 10000);
        // Añadir un jitter aleatorio para evitar peticiones sincronizadas
        return baseDelay + (Math.random() * 300);
      };
      
      // Configurar intervalo solo para reintentos de reconexión
      const setupRetryInterval = () => {
        // Limpiar cualquier intervalo existente
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        // Crear nuevo intervalo solo para reintentos
        const delay = getRetryDelay();
        intervalRef.current = setInterval(obtenerValoresGauges, delay);
        
        console.log(`Reintentando conexión en ${delay}ms (intento ${retryCount})`);
      };
      
      // Configurar el intervalo de reintentos
      setupRetryInterval();
    }
    
    // Limpiar intervalo al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isConnected, retryCount]);

  // Valores a mostrar (los últimos válidos o valores actuales)
  const displayValues = isConnected ? gaugeValues : lastValidValuesRef.current;

  // Añadir información de depuración
  useEffect(() => {
    console.log('Valores actualizados para mostrar en los gauges:', displayValues);
  }, [displayValues]);

  // Si no hay configuración aún, mostrar carga
  if (!gaugeConfig || gaugeConfig.length === 0) {
    return <div className="loading-indicator">Cargando configuración de medidores...</div>;
  }

  return (
    <>
      {/* Banner de error de hardware que aparece cuando hay desconexión */}
      {!isConnected && (
        <div className="hardware-error-banner">
          <div className="icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="message">
            ALERTA: Problemas de conexión con el hardware PLC
            <span className="hardware-error-details" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'} <FontAwesomeIcon icon={faInfoCircle} />
            </span>
          </div>
        </div>
      )}
      
      {/* Panel de detalles del error (visible solo si showDetails es true) */}
      {!isConnected && showDetails && (
        <div style={{ 
          marginTop: '50px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: '4px', 
          padding: '15px',
          marginBottom: '15px'
        }}>
          <h3 className="font-bold">Detalles del problema de conexión:</h3>
          <ul className="list-disc ml-5 mt-2">
            <li>Tiempo sin conexión: {formatDisconnectedTime()}</li>
            <li>Intentos de reconexión: {retryCount}</li>
            <li>Próximo intento en: {Math.min(Math.pow(2, retryCount) * 0.25, 10).toFixed(1)}s</li>
            <li>Estado de PLC: <span className="text-red-700">Sin respuesta</span></li>
            <li>Último código de error: CONN_TIMEOUT</li>
          </ul>
          <div className="mt-3">
            <p>Se están mostrando los últimos valores recibidos antes de la pérdida de conexión.</p>
            <p className="mt-2">Posibles causas:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>El servidor backend no está accesible</li>
              <li>El PLC está desconectado o ha perdido alimentación</li>
              <li>Problemas en la red de comunicación</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="main-content dashboard-clean" style={{ marginTop: !isConnected ? '60px' : '0' }}>
        {/* Botón para actualizar manualmente la configuración con indicador de cambios */}
        <div className="flex justify-between mb-4">
          <div>
            <button 
              onClick={obtenerValoresGauges}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSync} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Actualizando...' : 'Actualizar Valores'}
            </button>
            <span className="text-xs ml-2 text-gray-500">
              Última actualización: {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <div>
            {configChanged && (
              <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded border border-yellow-200 animate-pulse">
                Se detectaron cambios en la configuración. Actualizando...
              </div>
            )}
            <button 
              onClick={cargarConfiguracion} 
              className={`btn btn-sm btn-primary flex items-center ml-auto ${configChanged ? 'bg-yellow-500' : ''}`}
              disabled={configLoading}
            >
              <FontAwesomeIcon icon={faSync} className={`mr-2 ${configLoading ? 'animate-spin' : ''}`} />
              {configChanged ? 'Cambios detectados' : 'Actualizar configuración'}
            </button>
          </div>
        </div>
        
        {/* Contenido existente */}
        {!isConnected && !showDetails && (
          <div className="connection-error mb-4">
            <div className="flex items-center bg-yellow-100 p-4 rounded-md border border-yellow-300">
              <FontAwesomeIcon icon={faServer} className="text-yellow-700 mr-2 w-6 h-6" />
              <div>
                <p className="font-medium text-yellow-700">Sin conexión con el hardware PLC</p>
                <p className="text-sm text-yellow-600">
                  Mostrando últimos datos recibidos. Tiempo sin conexión: {formatDisconnectedTime()}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {error && !loading && isConnected && (
          <div className="alert-error mb-4">
            {error}
          </div>
        )}
        
        {loading && Object.keys(displayValues).length === 0 ? (
          <div className="loading-indicator">Cargando datos...</div>
        ) : (
          <div className={`gauge-dashboard-container ${!isConnected ? 'opacity-75' : ''}`}>
            {Array.isArray(gaugeConfig) && gaugeConfig.map(gauge => {
              // Obtener el valor actual del medidor desde los valores recibidos del backend
              const currentValue = displayValues[gauge.id] !== undefined 
                ? displayValues[gauge.id] 
                : gauge.initialValue;
              
              // Log para depuración
              console.log(`Renderizando gauge ${gauge.id} con valor: ${currentValue}`);
              
              return (
                <Gauge
                  key={`${gauge.id}-${lastConfigUpdateRef.current}`} // Forzar re-renderizado cuando la config cambia
                  id={gauge.id}
                  title={gauge.name}
                  unit={gauge.unit}
                  initialValue={currentValue}
                  minValue={gauge.min}
                  maxValue={gauge.max}
                  startColor={gauge.startColor}
                  endColor={gauge.endColor}
                  offline={!isConnected}
                  forceUpdate={configChanged} // Nueva prop para forzar actualización
                />
              );
            })}
          </div>
        )}
        
        {/* Botón flotante para actualización rápida */}
        <div className="fixed bottom-4 right-4 z-10">
          <button 
            onClick={obtenerValoresGauges} 
            className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Actualizar valores"
          >
            <FontAwesomeIcon icon={faSync} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
