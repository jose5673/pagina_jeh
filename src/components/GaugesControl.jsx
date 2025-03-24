import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSync, faSave, faThermometerHalf, faBolt, faOilCan, 
  faGasPump, faBatteryFull, faClock, faChartLine, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const GaugesControl = () => {
  // Estado para los valores de los gauges
  const [gaugeValues, setGaugeValues] = useState({
    temperature: 0,
    voltage: 0,
    oilPressure: 0,
    fuel: 0,
    current: 0,
    batteryLevel: 0,
    hoursOfUse: 0,
    operatingHours: 0,
    kva: 0
  });
  
  // Estado para el mensaje de respuesta
  const [mensaje, setMensaje] = useState({ visible: false, texto: '', tipo: '' });
  
  // Estado para controlar la carga y conexión
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  
  // Guardar la última copia válida de los datos
  const lastValidValuesRef = useRef({...gaugeValues});
  
  // Estado para rastrear cuánto tiempo ha estado desconectado
  const [disconnectedTime, setDisconnectedTime] = useState(0);
  const disconnectTimerRef = useRef(null);
  
  // Obtener valores actuales al cargar el componente
  useEffect(() => {
    obtenerValoresGauges();
  }, []);
  
  // Efecto para manejar el tiempo de desconexión
  useEffect(() => {
    if (!isConnected && !disconnectTimerRef.current) {
      disconnectTimerRef.current = setInterval(() => {
        setDisconnectedTime(prev => prev + 1);
      }, 1000);
    } else if (isConnected && disconnectTimerRef.current) {
      clearInterval(disconnectTimerRef.current);
      disconnectTimerRef.current = null;
      setDisconnectedTime(0);
    }
    
    return () => {
      if (disconnectTimerRef.current) {
        clearInterval(disconnectTimerRef.current);
        disconnectTimerRef.current = null;
      }
    };
  }, [isConnected]);
  
  // Formatear el tiempo de desconexión
  const formatDisconnectedTime = () => {
    const minutes = Math.floor(disconnectedTime / 60);
    const seconds = disconnectedTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Función para obtener los valores actuales de los gauges
  const obtenerValoresGauges = async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const response = await fetch('http://localhost:3001/api/gauges', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setGaugeValues(data);
        lastValidValuesRef.current = data; // Guardar copia válida
        setIsConnected(true);
      } else {
        mostrarMensaje('Error al obtener valores de los medidores', 'error');
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      mostrarMensaje('Error de conexión con el servidor', 'error');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGaugeValues({
      ...gaugeValues,
      [name]: parseFloat(value)
    });
  };
  
  // Función para enviar valores actualizados al servidor
  const actualizarGauges = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      mostrarMensaje('No es posible actualizar valores sin conexión al servidor', 'error');
      return;
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const response = await fetch('http://localhost:3001/api/gauges', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gaugeValues),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        mostrarMensaje(data.mensaje, 'success');
        // Actualizar la copia de seguridad con los nuevos valores
        lastValidValuesRef.current = {...gaugeValues};
        setIsConnected(true);
      } else {
        const data = await response.json();
        mostrarMensaje(data.mensaje || 'Error al actualizar los medidores', 'error');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      mostrarMensaje('Error de conexión con el servidor', 'error');
      setIsConnected(false);
    }
  };
  
  // Función para mostrar mensajes temporales
  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ visible: true, texto, tipo });
    setTimeout(() => setMensaje({ visible: false, texto: '', tipo: '' }), 3000);
  };

  // Configuración de íconos para cada campo
  const fieldIcons = {
    temperature: faThermometerHalf,
    voltage: faBolt,
    oilPressure: faOilCan,
    fuel: faGasPump,
    current: faBolt,
    batteryLevel: faBatteryFull,
    hoursOfUse: faClock,
    operatingHours: faClock,
    kva: faChartLine
  };

  // Etiquetas descriptivas para cada campo
  const fieldLabels = {
    temperature: 'Temperatura (°C)',
    voltage: 'Voltaje (V)',
    oilPressure: 'Presión de Aceite (Bar)',
    fuel: 'Nivel de Combustible (%)',
    current: 'Corriente (A)',
    batteryLevel: 'Nivel de Batería (%)',
    hoursOfUse: 'Horas de Uso (h)',
    operatingHours: 'Horas de Funcionamiento (h)',
    kva: 'kVA'
  };
  
  return (
    <>
      {!isConnected && (
        <div className="hardware-error-banner">
          <div className="icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="message">
            ALERTA: Problemas de conexión con el hardware PLC
            <span className="hardware-error-details">
              Tiempo sin conexión: {formatDisconnectedTime()}
            </span>
          </div>
        </div>
      )}
    
      <div className="card" style={{ marginTop: !isConnected ? '60px' : '0' }}>
        <div className="card-header">Control Manual de Medidores</div>
        
        {!isConnected && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mr-2" />
              <p className="text-yellow-700">
                <span className="font-bold">Sin conexión al servidor.</span> Los cambios no podrán guardarse hasta que se restablezca la conexión.
              </p>
            </div>
          </div>
        )}
        
        {mensaje.visible && (
          <div className={`p-3 rounded mb-4 ${
            mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {mensaje.texto}
          </div>
        )}
        
        {loading && !Object.values(gaugeValues).some(val => val > 0) ? (
          <div className="p-4 text-center">Cargando valores actuales...</div>
        ) : (
          <form onSubmit={actualizarGauges} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(gaugeValues).map(fieldName => (
                <div className="form-group" key={fieldName}>
                  <label className="block text-gray-700 font-medium mb-2">
                    <FontAwesomeIcon icon={fieldIcons[fieldName] || faThermometerHalf} className="mr-2" />
                    {fieldLabels[fieldName]}
                  </label>
                  <input
                    type="number"
                    step={fieldName === 'hoursOfUse' || fieldName === 'operatingHours' ? '1' : '0.1'}
                    name={fieldName}
                    value={gaugeValues[fieldName]}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${!isConnected ? 'bg-gray-100' : 'bg-white'} border-gray-300`}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={obtenerValoresGauges}
                className="btn btn-secondary flex items-center"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSync} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> 
                {loading ? 'Cargando...' : 'Refrescar Valores'}
              </button>
              
              <button
                type="submit"
                className={`btn flex items-center ${isConnected ? 'btn-primary' : 'btn-secondary opacity-50'}`}
                disabled={!isConnected}
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" /> 
                {isConnected ? 'Actualizar Medidores' : 'Sin conexión'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default GaugesControl;
