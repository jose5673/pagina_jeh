import React, { useEffect, useRef, useState } from 'react';

function Gauge({ id, title, initialValue, minValue, maxValue, unit, startColor, endColor, offline, forceUpdate }) {
  const [value, setValue] = useState(initialValue || 0);
  const canvasRef = useRef(null);
  const previousValueRef = useRef(initialValue || 0);
  
  // Guardar referencias a las propiedades para detectar cambios
  const propsRef = useRef({
    title, 
    initialValue, 
    minValue, 
    maxValue, 
    unit, 
    startColor, 
    endColor
  });
  
  // Actualizar el valor cuando cambia initialValue y detectar si es un cambio significativo
  useEffect(() => {
    // Si el valor cambió significativamente (más de 0.1%), animar
    const isSignificantChange = Math.abs(previousValueRef.current - initialValue) > (maxValue - minValue) * 0.001;
    
    if (isSignificantChange) {
      // Guardar para la animación
      previousValueRef.current = initialValue || 0;
      
      // Animar el cambio
      const gaugeElement = canvasRef.current?.parentElement?.parentElement?.parentElement;
      if (gaugeElement) {
        gaugeElement.style.transition = 'all 0.3s ease';
        gaugeElement.style.transform = 'scale(1.03)';
        gaugeElement.style.boxShadow = '0 0 10px rgba(0, 119, 204, 0.4)';
        
        setTimeout(() => {
          gaugeElement.style.transform = 'scale(1)';
          gaugeElement.style.boxShadow = '';
        }, 300);
      }
    }
    
    // Actualizar el valor
    setValue(initialValue || 0);
    
  }, [initialValue, minValue, maxValue]);
  
  // Efecto para detectar y mostrar cambios de propiedades
  useEffect(() => {
    const prevProps = propsRef.current;
    
    // Verificar si alguna propiedad ha cambiado
    const changedProps = Object.entries({
      title, initialValue, minValue, maxValue, unit, startColor, endColor
    }).filter(([key, value]) => {
      return prevProps[key] !== value;
    });
    
    // Si hay cambios, mostrar animación
    if (changedProps.length > 0) {
      console.log(`Gauge ${id} propiedades actualizadas:`, 
        changedProps.map(([key, value]) => `${key}: ${prevProps[key]} -> ${value}`).join(', ')
      );
      
      // Referencia al elemento para animación
      const gaugeElement = canvasRef.current?.parentElement?.parentElement?.parentElement;
      if (gaugeElement) {
        // Aplicar animación de actualización
        gaugeElement.style.transition = 'all 0.3s ease';
        gaugeElement.style.transform = 'scale(1.05)';
        gaugeElement.style.boxShadow = '0 0 15px rgba(255, 177, 0, 0.5)';
        
        // Restaurar después de la animación
        setTimeout(() => {
          gaugeElement.style.transform = 'scale(1)';
          gaugeElement.style.boxShadow = '';
        }, 500);
      }
    }
    
    // Actualizar las referencias
    propsRef.current = { title, initialValue, minValue, maxValue, unit, startColor, endColor };
  }, [id, title, initialValue, minValue, maxValue, unit, startColor, endColor]);
  
  // Efecto para forzar la actualización cuando se solicita
  useEffect(() => {
    if (forceUpdate) {
      // Redraw con animación especial
      const gaugeElement = canvasRef.current?.parentElement?.parentElement?.parentElement;
      if (gaugeElement) {
        gaugeElement.style.transition = 'all 0.3s ease';
        gaugeElement.style.transform = 'scale(1.05)';
        gaugeElement.style.boxShadow = '0 0 15px rgba(255, 177, 0, 0.5)';
        
        setTimeout(() => {
          gaugeElement.style.transform = 'scale(1)';
          gaugeElement.style.boxShadow = '';
        }, 500);
      }
    }
  }, [forceUpdate]);
  
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
    
    // Dibujar valor - asegurarse que esté actualizado
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#333';
    
    // Usar el formato correcto según el tipo de medidor
    const formattedValue = id === 'hoursOfUse' || id === 'operatingHours' 
      ? value.toFixed(0) 
      : value.toFixed(1);
      
    ctx.fillText(`${formattedValue} ${unit}`, centerX, centerY);
    
    // Debug para verificar colores
    console.log(`Gauge ${id} dibujado con colores: start=${start}, end=${end}`);
    
  }, [value, minValue, maxValue, startColor, endColor, unit, id]);
  
  // Eliminar la simulación y usar directamente el valor proporcionado
  // No necesitamos generar cambios aleatorios ya que los valores
  // reales vienen del backend a través de initialValue
  
  const statusClass = {
    normal: 'status-normal',
    alto: 'status-alto',
    bajo: 'status-bajo'
  }[status];
  
  // Precisión para mostrar los valores
  const valueDecimals = id === 'hoursOfUse' || id === 'operatingHours' ? 0 : 1;
  
  return (
    <div className={`gauge-card ${offline ? 'offline-gauge' : ''}`} style={{ position: 'relative' }}>
      {/* Mostrar los colores actuales para depuración */}
      <div 
        className="color-debug" 
        style={{ 
          position: 'absolute', 
          top: 5, 
          right: 5, 
          display: 'flex', 
          gap: '3px',
          opacity: 0.4
        }}
      >
        <div 
          style={{ 
            width: '8px', 
            height: '8px', 
            backgroundColor: startColor || '#5a5d6d',
            border: '1px solid #fff',
            borderRadius: '50%'
          }} 
          title={`Color inicial: ${startColor}`}
        />
        <div 
          style={{ 
            width: '8px', 
            height: '8px', 
            backgroundColor: endColor || '#0066ff',
            border: '1px solid #fff',
            borderRadius: '50%'
          }} 
          title={`Color final: ${endColor}`}
        />
      </div>
      
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
