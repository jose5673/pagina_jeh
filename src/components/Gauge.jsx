import React, { useEffect, useRef, useState } from 'react';

function Gauge({ id, title, initialValue, minValue, maxValue, unit, startColor, endColor, offline, forceUpdate }) {
  const [value, setValue] = useState(initialValue || 0);
  const canvasRef = useRef(null);
  
  // Actualizar el valor cuando cambia initialValue
  useEffect(() => {
    setValue(initialValue || 0);
  }, [initialValue]);
  
  // Determinar estado basado en el valor
  const getStatus = () => {
    const range = maxValue - minValue;
    const percentage = ((value - minValue) / range) * 100;
    
    if (percentage < 20) return "bajo";
    if (percentage > 80) return "alto";
    return "normal";
  };
  
  const status = getStatus();
  
  // Dibujar el gauge
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dibujar arco de fondo
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.stroke();
    
    // Calcular ángulo basado en el valor
    const range = maxValue - minValue;
    const percentage = Math.min(Math.max((value - minValue) / range, 0), 1);
    const angle = percentage * Math.PI + Math.PI;
    
    // Usar los colores pasados como props, asegurándose de que existan
    const start = startColor || '#5a5d6d';
    const end = endColor || '#0066ff';
    
    // Crear gradiente para el arco de valor
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, start);
    gradient.addColorStop(1, end);
    
    // Dibujar arco de valor
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, angle, false);
    ctx.lineWidth = 20;
    ctx.strokeStyle = gradient;
    ctx.stroke();
    
    // Dibujar círculo central
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 30, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
  }, [value, minValue, maxValue, startColor, endColor]);
  
  const statusClass = {
    normal: 'status-normal',
    alto: 'status-alto',
    bajo: 'status-bajo'
  }[status];
  
  // Precisión para mostrar los valores
  const valueDecimals = id === 'hoursOfUse' || id === 'operatingHours' ? 0 : 1;
  
  return (
    <div className={`gauge-card ${offline ? 'offline-gauge' : ''}`} style={{ position: 'relative' }}>
      <div className="gauge-header">
        <h3 className="gauge-title">{title}</h3>
        {offline ? (
          <span className="gauge-status" style={{ backgroundColor: '#6c757d' }}>DESCONECTADO</span>
        ) : (
          <span className={`gauge-status ${statusClass}`}>
            {status.toUpperCase()}
          </span>
        )}
      </div>
      <div className="gauge-body">
        <div className="gauge">
          <canvas 
            ref={canvasRef}
            width={200}
            height={200}
          />
        </div>
      </div>
      <div className="gauge-value-display">
        {offline && (
          <div style={{ 
            position: 'absolute', 
            padding: '2px 8px', 
            background: 'rgba(220, 53, 69, 0.9)',
            color: 'white',
            fontSize: '10px',
            borderRadius: '4px',
            fontWeight: 'bold',
            transform: 'rotate(-15deg)',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            SIN SEÑAL
          </div>
        )}
        <div className={`value ${offline ? 'text-gray-500' : ''}`}>
          {value.toFixed(valueDecimals)} {unit}
        </div>
      </div>
    </div>
  );
}

export default Gauge;
