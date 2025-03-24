import React, { useState } from 'react';
// Actualizar FontAwesome si se necesita
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGasPump, faBolt, faThermometerHalf, faOilCan, 
  faBatteryHalf, faClock, faHourglassHalf, faChargingStation, 
  faPlug, faTachometerAlt, faExclamationTriangle, faSave
} from '@fortawesome/free-solid-svg-icons';

function GaugeSettings({ gaugeConfig, setGaugeConfig }) {
  // Si no hay gaugeConfig o setGaugeConfig, usar valores predeterminados
  const [localGauges, setLocalGauges] = useState(gaugeConfig || []);

  const handleInputChange = (index, field, value) => {
    const updated = [...localGauges];
    updated[index][field] = Number(value);
    setLocalGauges(updated);
  };

  const handleSave = () => {
    const isValid = localGauges.every(gauge => gauge.min < gauge.max);
    if (!isValid) {
      alert('Error: El valor mínimo debe ser menor que el máximo para todos los gauges.');
      return;
    }
    if (setGaugeConfig) {
      setGaugeConfig(localGauges);
      alert('¡Configuración guardada con éxito!');
    }
  };

  // Mapeo de iconos usando FontAwesome directamente
  const getIcon = (id) => {
    switch(id) {
      case 'fuel': return faGasPump;
      case 'voltage': return faBolt;
      case 'temperature': return faThermometerHalf;
      case 'oilPressure': return faOilCan;
      case 'current': return faBolt;
      case 'batteryLevel': return faBatteryHalf;
      case 'hoursOfUse': return faClock;
      case 'operatingHours': return faHourglassHalf;
      case 'kva': return faChargingStation;
      case 'power': return faPlug;
      default: return faTachometerAlt;
    }
  };

  return (
    <div className="main-content">
      <div className="gauge-settings-compact-container">
        <div className="gauge-settings-compact-header">
          <h1>Configuración de Niveles</h1>
          <p className="gauge-settings-compact-subtitle">Ajusta los valores mínimos y máximos de cada medidor.</p>
        </div>
        <div className="gauge-settings-compact-grid">
          {localGauges.map((gauge, idx) => {
            const range = gauge.max - gauge.min;
            const normalizedRange = Math.min(100, (range / 1000) * 100);
            return (
              <div key={gauge.id} className="gauge-compact-card">
                <div className="gauge-compact-header">
                  <FontAwesomeIcon icon={getIcon(gauge.id)} size="lg" />
                  <h3>{gauge.name}</h3>
                  <span className="gauge-compact-unit">{gauge.unit}</span>
                </div>
                <div className="gauge-compact-inputs">
                  <div className="gauge-compact-input-group">
                    <label htmlFor={`min-${gauge.id}`}>Mínimo</label>
                    <input
                      id={`min-${gauge.id}`}
                      type="number"
                      value={gauge.min}
                      onChange={(e) => handleInputChange(idx, 'min', e.target.value)}
                      className="gauge-compact-input"
                    />
                  </div>
                  <div className="gauge-compact-input-group">
                    <label htmlFor={`max-${gauge.id}`}>Máximo</label>
                    <input
                      id={`max-${gauge.id}`}
                      type="number"
                      value={gauge.max}
                      onChange={(e) => handleInputChange(idx, 'max', e.target.value)}
                      className="gauge-compact-input"
                    />
                  </div>
                </div>
                {gauge.min >= gauge.max && (
                  <div className="gauge-compact-error">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Min debe ser menor que Max</span>
                  </div>
                )}
                <div className="gauge-compact-range">
                  <span className="gauge-compact-range-label">Rango:</span>
                  <div className="gauge-compact-range-bar">
                    <div 
                      className="gauge-compact-range-fill" 
                      style={{ width: `${normalizedRange}%` }}
                    ></div>
                  </div>
                  <span className="gauge-compact-range-value">{range}</span>
                </div>
              </div>
            );
          })}
        </div>
        <button className="gauge-compact-save-button" onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} /> Guardar
        </button>
      </div>
    </div>
  );
}

export default GaugeSettings;
