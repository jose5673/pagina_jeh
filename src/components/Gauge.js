import React, { useEffect, useRef, useState, useCallback } from 'react';

function Gauge({ id, title, unit, initialValue, minValue, maxValue, startColor, endColor }) {
  const canvasRef = useRef(null);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const targetValueRef = useRef(initialValue);

  // Función para dibujar el gauge usando el canvas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const drawGauge = (ctx, value) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 * 0.85;
    const arcRadius = outerRadius - 10;
    const startAngle = Math.PI * 0.75;
    const angleRange = Math.PI * 1.5;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Dibujar pista del gauge (arco de fondo)
    ctx.beginPath();
    ctx.arc(centerX, centerY, arcRadius, startAngle, startAngle + angleRange, false);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Calcular ángulo basado en el valor (clamp entre min y max)
    const clampedValue = Math.min(Math.max(value, minValue), maxValue);
    const valuePercentage = (clampedValue - minValue) / (maxValue - minValue);
    const endAngle = startAngle + (valuePercentage * angleRange);

    // Crear gradiente para el arco del valor
    const gradient = ctx.createLinearGradient(
      centerX + arcRadius * Math.cos(startAngle),
      centerY + arcRadius * Math.sin(startAngle),
      centerX + arcRadius * Math.cos(endAngle),
      centerY + arcRadius * Math.sin(endAngle)
    );
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);

    // Dibujar arco que representa el valor
    ctx.beginPath();
    ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle, false);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Dibujar el valor numérico en el centro
    ctx.font = '24px "Space Mono", monospace, Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(clampedValue.toFixed(1), centerX, centerY);
    
    // Dibujar unidad debajo del valor
    ctx.font = '14px "Space Mono", monospace, Arial';
    ctx.fillText(unit, centerX, centerY + 30);

    // Dibujar marcas de escala
    drawScale(ctx, centerX, centerY, arcRadius, startAngle, angleRange);
  };

  // Función para dibujar marcas de escala
  const drawScale = (ctx, centerX, centerY, radius, startAngle, angleRange) => {
    const totalTicks = 10;
    const majorTickLength = 10;
    const minorTickLength = 5;
    
    for (let i = 0; i <= totalTicks; i++) {
      const angle = startAngle + (i / totalTicks) * angleRange;
      const isMajor = i % 2 === 0;
      const tickLength = isMajor ? majorTickLength : minorTickLength;
      
      const outerX = centerX + (radius + 5) * Math.cos(angle);
      const outerY = centerY + (radius + 5) * Math.sin(angle);
      const innerX = centerX + (radius + 5 - tickLength) * Math.cos(angle);
      const innerY = centerY + (radius + 5 - tickLength) * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(outerX, outerY);
      ctx.lineTo(innerX, innerY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = isMajor ? 2 : 1;
      ctx.stroke();
      
      // Dibujar los valores en las marcas principales
      if (isMajor) {
        const value = minValue + (i / totalTicks) * (maxValue - minValue);
        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textX = centerX + (radius + 25) * Math.cos(angle);
        const textY = centerY + (radius + 25) * Math.sin(angle);
        ctx.fillText(value.toFixed(0), textX, textY);
      }
    }
  };

  // Animación para transiciones suaves de valores
  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      
      // Animación suave hacia el valor objetivo
      const targetValue = targetValueRef.current;
      const diff = targetValue - currentValue;
      
      if (Math.abs(diff) > 0.1) {
        // Velocidad de la animación
        const step = diff * 0.1;
        setCurrentValue(prevValue => prevValue + step);
      } else if (currentValue !== targetValue) {
        setCurrentValue(targetValue);
      }
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [currentValue]); // Añadir currentValue como dependencia

  // Efecto para iniciar la animación
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]); // Solo se ejecuta al montar y desmontar

  // Efecto para actualizar el valor objetivo cuando cambia initialValue
  useEffect(() => {
    targetValueRef.current = initialValue;
  }, [initialValue]);

  // Efecto para dibujar el gauge cuando cambia el valor actual
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Asegurar que el canvas tenga la resolución correcta para pantallas de alta densidad
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = 220 * pixelRatio;
    canvas.height = 220 * pixelRatio;
    canvas.style.width = "220px";
    canvas.style.height = "220px";
    ctx.scale(pixelRatio, pixelRatio);
    
    drawGauge(ctx, currentValue);
  }, [currentValue, minValue, maxValue, startColor, endColor, drawGauge]);

  // Determinar el estado basado en el valor actual
  const getStatus = () => {
    const percentage = (currentValue - minValue) / (maxValue - minValue);
    if (percentage < 0.3) return "Bajo";
    if (percentage > 0.7) return "Alto";
    return "Normal";
  };

  return (
    <div className="gauge-card">
      <div className="gauge-header">
        <h3 className="gauge-title">{title}</h3>
        <div className={`gauge-status status-${getStatus().toLowerCase()}`}>{getStatus()}</div>
      </div>
      <div className="gauge-body">
        <div className="gauge">
          <canvas ref={canvasRef} id={`gaugeCanvas-${id}`} width="220" height="220" />
        </div>
      </div>
    </div>
  );
}

export default Gauge;
