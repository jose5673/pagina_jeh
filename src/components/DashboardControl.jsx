import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import GaugesControl from './GaugesControl';

const DashboardControl = ({ gaugeConfig }) => {
  // Estado para detectar si hay desconexión en cualquiera de los componentes hijos
  const [anyDisconnected, setAnyDisconnected] = useState(false);
  
  // Efecto para ajustar el margen superior cuando hay banner de error
  useEffect(() => {
    if (anyDisconnected) {
      document.body.style.marginTop = '60px';
    } else {
      document.body.style.marginTop = '0';
    }
    
    return () => {
      document.body.style.marginTop = '0';
    };
  }, [anyDisconnected]);
  
  return (
    <div className="dashboard-control-container" style={{ marginTop: anyDisconnected ? '60px' : '0' }}>
      <h1 className="text-2xl font-bold mb-6">Panel de Instrumentos y Control</h1>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
        <h3 className="font-bold mb-2">Control Manual de Medidores</h3>
        <p>En esta página puedes:</p>
        <ul className="list-disc ml-5 mt-2">
          <li>Observar en tiempo real los valores de los medidores</li>
          <li>Modificar manualmente cualquier valor desde el panel de control</li>
          <li>Ver cómo los cambios se reflejan inmediatamente en los medidores visuales</li>
        </ul>
        <p className="mt-2">Los cambios realizados aquí se mantienen hasta que sean modificados a través de este panel o mediante los registros técnicos.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Panel de Instrumentos</h2>
          <Dashboard 
            gaugeConfig={gaugeConfig} 
            onConnectionChange={(isConnected) => !isConnected && setAnyDisconnected(true)}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Control Manual</h2>
          <GaugesControl 
            onConnectionChange={(isConnected) => !isConnected && setAnyDisconnected(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardControl;
