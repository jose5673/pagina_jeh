const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para procesar datos de formularios

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use('/static', express.static(path.join(__dirname, 'public')));

// Almacenamiento de configuraciones
let configuraciones = {
  tema: "claro",
  colorPrimario: "#ff6b00",
  idioma: "es",
};

// Array para almacenar los registros de datos técnicos
let registros = [];

// Objeto para mantener los valores actuales de los gauges
let gaugeValues = {
  temperature: 25,    // Temperatura en °C
  voltage: 220,       // Tensión en V
  oilPressure: 4.0,   // Presión de aceite en Bar
  fuel: 75,           // Nivel de combustible en %
  current: 10,        // Corriente en A
  batteryLevel: 90,   // Nivel de batería en %
  hoursOfUse: 120,    // Horas de uso
  operatingHours: 80, // Horas de funcionamiento
  kva: 100            // kVA
};

// Configuración de los medidores - ahora almacenada en el backend
let gaugeConfig = [
  { 
    id: 'fuel', 
    name: 'Nivel Combustible', 
    unit: '%', 
    initialValue: 70, 
    min: 0, 
    max: 100, 
    startColor: '#5a5d6d', 
    endColor: '#4287f5' 
  },
  { 
    id: 'voltage', 
    name: 'Voltaje', 
    unit: 'V', 
    initialValue: 230, 
    min: 190, 
    max: 240, 
    startColor: '#5a6d68', 
    endColor: '#00fabb' 
  },
  { 
    id: 'temperature', 
    name: 'Temperatura', 
    unit: '°C', 
    initialValue: 85, 
    min: -30, 
    max: 120, 
    startColor: '#6d5a5a', 
    endColor: '#ff7b00' 
  },
  { 
    id: 'oilPressure', 
    name: 'Presión de Aceite', 
    unit: 'Bar', 
    initialValue: 4.2, 
    min: 0, 
    max: 10, 
    startColor: '#5a6d64', 
    endColor: '#00fab0' 
  },
  { 
    id: 'current', 
    name: 'Corriente', 
    unit: 'A', 
    initialValue: 15, 
    min: 0, 
    max: 100, 
    startColor: '#6d625a', 
    endColor: '#ff9f00' 
  },
  { 
    id: 'batteryLevel', 
    name: 'Nivel de Batería', 
    unit: '%', 
    initialValue: 80, 
    min: 0, 
    max: 100, 
    startColor: '#5a6a6d', 
    endColor: '#00e1ff' 
  },
  { 
    id: 'hoursOfUse', 
    name: 'Horas de Uso', 
    unit: 'h', 
    initialValue: 250, 
    min: 0, 
    max: 9999, 
    startColor: '#665a6d', 
    endColor: '#d600ff' 
  },
  { 
    id: 'operatingHours', 
    name: 'Horas de Funcionamiento', 
    unit: 'h', 
    initialValue: 130, 
    min: 0, 
    max: 9999, 
    startColor: '#6d5a69', 
    endColor: '#ff00aa' 
  },
  { 
    id: 'kva', 
    name: 'kVA', 
    unit: 'kVA', 
    initialValue: 120, 
    min: 0, 
    max: 500, 
    startColor: '#5a676d', 
    endColor: '#00c3ff' 
  }
];

// Añadir una variable para rastrear la última modificación
let lastConfigUpdate = Date.now();

// Función para actualizar los valores de los gauges basados en un nuevo registro
const actualizarGaugesDesdeRegistro = (registro) => {
  // Mapeo entre los campos del registro y los IDs de los gauges
  gaugeValues.temperature = registro.temperatura;
  gaugeValues.voltage = registro.tension;
  gaugeValues.oilPressure = registro.presion;
  
  // Aquí podrías agregar lógica adicional para calcular otros valores de gauge
  // basados en los datos recibidos, por ejemplo:
  
  // Si la temperatura es alta, simular una reducción en el nivel de combustible
  if (registro.temperatura > 90) {
    gaugeValues.fuel = Math.max(gaugeValues.fuel - 2, 0);
  }
  
  // Incrementar horas de uso por cada registro (simulación)
  gaugeValues.hoursOfUse += 0.1;
  gaugeValues.operatingHours += 0.1;
  
  // Simular fluctuaciones en la corriente basadas en la tensión
  gaugeValues.current = registro.tension / 20 + (Math.random() * 2 - 1);
  
  // Actualizar kVA basado en tensión y corriente
  gaugeValues.kva = (gaugeValues.current * registro.tension) / 1000;
  
  // Simular descarga de batería si la tensión es baja
  if (registro.tension < 200) {
    gaugeValues.batteryLevel = Math.max(gaugeValues.batteryLevel - 1, 10);
  } else {
    // Cargar batería si la tensión es adecuada
    gaugeValues.batteryLevel = Math.min(gaugeValues.batteryLevel + 0.5, 100);
  }
};

// Rutas de configuración general
app.get("/api/config", (req, res) => {
  res.json(configuraciones);
});

app.post("/api/config", (req, res) => {
  configuraciones = { ...configuraciones, ...req.body };
  res.json({ mensaje: "Configuración actualizada", configuraciones });
});

// Rutas de registros
app.get("/api/registros", (req, res) => {
  res.json(registros);
});

app.post("/api/registros", (req, res) => {
  try {
    const { temperatura, tension, presion } = req.body;
    
    // Validación de datos
    if (temperatura === undefined || tension === undefined || presion === undefined) {
      return res.status(400).json({ 
        error: "Datos incompletos", 
        mensaje: "Se requieren temperatura, tension y presion" 
      });
    }
    
    // Verificar tipos de datos
    if (typeof temperatura !== 'number' || typeof tension !== 'number' || typeof presion !== 'number') {
      return res.status(400).json({ 
        error: "Tipo de datos incorrecto", 
        mensaje: "Temperatura, tension y presion deben ser números" 
      });
    }
    
    // Crear el nuevo registro con timestamp e ID único
    const nuevoRegistro = {
      id: Date.now().toString(), // Generamos un ID único basado en timestamp
      temperatura,
      tension,
      presion,
      timestamp: new Date().toISOString()
    };
    
    // Agregar al array de registros
    registros.push(nuevoRegistro);
    
    // Actualizar los valores de los gauges basados en este nuevo registro
    actualizarGaugesDesdeRegistro(nuevoRegistro);
    
    // Responder con éxito
    res.status(201).json({ 
      mensaje: "Registro añadido correctamente", 
      registro: nuevoRegistro,
      gaugeValues // Devolvemos también los valores actualizados de los gauges
    });
  } catch (error) {
    console.error("Error al procesar el registro:", error);
    res.status(500).json({ 
      error: "Error interno", 
      mensaje: "No se pudo procesar el registro" 
    });
  }
});

// Rutas para valores de medidores
app.get("/api/gauges", (req, res) => {
  // Añadir encabezados para evitar caché
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Incluir timestamp para depuración
  const timestamp = new Date().toISOString();
  res.json({
    values: gaugeValues,
    timestamp: timestamp,
    serverTime: Date.now()
  });
});

app.put("/api/gauges", (req, res) => {
  try {
    const { 
      temperature, 
      voltage, 
      oilPressure, 
      fuel, 
      current, 
      batteryLevel, 
      hoursOfUse, 
      operatingHours, 
      kva 
    } = req.body;
    
    // Verificar que todos los campos sean números
    const campos = { 
      temperature, 
      voltage, 
      oilPressure, 
      fuel, 
      current, 
      batteryLevel, 
      hoursOfUse, 
      operatingHours, 
      kva 
    };
    
    // Validar que los campos sean números
    for (const [key, value] of Object.entries(campos)) {
      if (value !== undefined && typeof value !== 'number') {
        return res.status(400).json({
          error: "Tipo de datos incorrecto",
          mensaje: `El campo ${key} debe ser un número`
        });
      }
    }
    
    // Actualizar solo los campos proporcionados
    for (const [key, value] of Object.entries(campos)) {
      if (value !== undefined) {
        gaugeValues[key] = value;
        
        // Registrar cambios para depuración
        console.log(`Valor actualizado: ${key} = ${value}`);
      }
    }
    
    // Actualizar timestamp de modificación
    lastConfigUpdate = Date.now();
    
    // Responder con éxito
    res.json({
      mensaje: "Valores de los medidores actualizados correctamente",
      gaugeValues,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error al actualizar los medidores:", error);
    res.status(500).json({
      error: "Error interno",
      mensaje: "No se pudieron actualizar los medidores"
    });
  }
});

// Endpoint para forzar la actualización de valores desde el frontend
app.post("/api/gauges/refresh", (req, res) => {
  // Forzar actualización del timestamp para obligar al cliente a recargar
  lastConfigUpdate = Date.now();
  
  res.json({
    success: true,
    message: "Forzando actualización de valores",
    timestamp: new Date().toISOString(),
    values: gaugeValues
  });
});

// NUEVO: Endpoint para obtener la configuración de los medidores
app.get("/api/gauge-config", (req, res) => {
  // Añadir encabezados para evitar caché
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Devolver directamente el array de configuración para mantener compatibilidad
  res.json(gaugeConfig);
});

// NUEVO: Endpoint para sincronizar valores actuales como iniciales en la configuración
app.post("/api/sync-gauge-values", (req, res) => {
  try {
    // Para cada medidor en la configuración
    gaugeConfig = gaugeConfig.map(gauge => {
      // Si existe un valor actual para este medidor, usarlo como valor inicial
      if (gaugeValues[gauge.id] !== undefined) {
        return {
          ...gauge,
          initialValue: gaugeValues[gauge.id]
        };
      }
      return gauge;
    });
    
    // Actualizar el timestamp de modificación
    lastConfigUpdate = Date.now();
    
    // Responder con éxito
    res.json({
      success: true,
      message: "Valores actuales sincronizados como valores iniciales",
      config: gaugeConfig
    });
  } catch (error) {
    console.error("Error al sincronizar valores:", error);
    res.status(500).json({
      success: false,
      message: "Error al sincronizar valores"
    });
  }
});

// NUEVO: Endpoint separado para verificar cambios (este sí devuelve timestamp)
app.get("/api/gauge-config/check", (req, res) => {
  res.json({ 
    lastUpdate: lastConfigUpdate 
  });
});

// NUEVO: Ruta para la página de configuración de niveles
app.get("/gauge-settings", (req, res) => {
  // Crear una copia de la configuración con los valores actuales
  const configWithCurrentValues = gaugeConfig.map(gauge => {
    // Usar los valores actuales como valores iniciales si están disponibles
    if (gaugeValues[gauge.id] !== undefined) {
      return {
        ...gauge,
        currentValue: gaugeValues[gauge.id]
      };
    }
    return {...gauge, currentValue: gauge.initialValue};
  });
  
  res.render('gauge-settings', { 
    gaugeConfig: configWithCurrentValues, 
    message: null,
    pageTitle: 'Configuración de Niveles',
    currentPage: 'gauge-settings'
  });
});

// NUEVO: Ruta para procesar los cambios en la configuración de niveles
app.post("/gauge-settings", (req, res) => {
  try {
    // Extraer los valores del formulario
    const updatedConfig = [];
    const useCurrentAsInitial = req.body.useCurrentAsInitial === 'on';
    
    // Procesar cada medidor
    for (let i = 0; i < gaugeConfig.length; i++) {
      const gauge = gaugeConfig[i];
      
      // Determinar el valor inicial:
      // Si se marcó la casilla para usar valores actuales, usar el valor actual
      let initialValue = parseFloat(req.body[`initialValue_${gauge.id}`]);
      if (useCurrentAsInitial && gaugeValues[gauge.id] !== undefined) {
        initialValue = gaugeValues[gauge.id];
      }
      
      updatedConfig.push({
        id: gauge.id,
        name: req.body[`name_${gauge.id}`],
        unit: req.body[`unit_${gauge.id}`],
        initialValue: initialValue,
        min: parseFloat(req.body[`min_${gauge.id}`]),
        max: parseFloat(req.body[`max_${gauge.id}`]),
        startColor: req.body[`startColor_${gauge.id}`],
        endColor: req.body[`endColor_${gauge.id}`]
      });
    }
    
    // Actualizar la configuración
    gaugeConfig = updatedConfig;
    
    // Actualizar el timestamp de modificación
    lastConfigUpdate = Date.now();
    
    // Crear versión actualizada con valores actuales para mostrar
    const configWithCurrentValues = gaugeConfig.map(gauge => {
      return {
        ...gauge,
        currentValue: gaugeValues[gauge.id] !== undefined ? gaugeValues[gauge.id] : gauge.initialValue
      };
    });
    
    // Renderizar la página con mensaje de éxito
    res.render('gauge-settings', {
      gaugeConfig: configWithCurrentValues,
      message: {
        type: 'success',
        text: 'Configuración de niveles actualizada correctamente'
      }
    });
  } catch (error) {
    console.error("Error al actualizar la configuración de niveles:", error);
    
    // En caso de error, mostrar mensaje
    res.render('gauge-settings', {
      gaugeConfig,
      message: {
        type: 'error',
        text: 'Error al actualizar la configuración: ' + error.message
      }
    });
  }
});

// Nueva ruta para la página de pruebas de API (próximamente)
app.get("/api-explorer", (req, res) => {
  res.render('coming-soon', { 
    pageTitle: 'API Explorer',
    currentPage: 'api-explorer',
    message: {
      type: 'info',
      text: 'Esta funcionalidad estará disponible próximamente.'
    }
  });
});

// Nueva ruta para la página de logs (próximamente)
app.get("/logs", (req, res) => {
  res.render('coming-soon', { 
    pageTitle: 'Logs del Sistema',
    currentPage: 'logs',
    message: {
      type: 'info',
      text: 'Esta funcionalidad estará disponible próximamente.'
    }
  });
});

// Rutas para la interfaz de administración del PLC
app.get("/admin", (req, res) => {
  // Enviamos los valores actuales para que aparezcan precargados en el formulario
  res.render('admin', { 
    gaugeValues, 
    message: null,
    pageTitle: 'Simulador PLC',
    currentPage: 'admin'
  });
});

app.post("/admin", (req, res) => {
  try {
    // Extraemos los valores del formulario
    const {
      temperature,
      voltage,
      oilPressure,
      fuel,
      current,
      batteryLevel,
      hoursOfUse,
      operatingHours,
      kva
    } = req.body;
    
    // Actualizamos el objeto gaugeValues con los nuevos valores
    gaugeValues.temperature = parseFloat(temperature);
    gaugeValues.voltage = parseFloat(voltage);
    gaugeValues.oilPressure = parseFloat(oilPressure);
    gaugeValues.fuel = parseFloat(fuel);
    gaugeValues.current = parseFloat(current);
    gaugeValues.batteryLevel = parseFloat(batteryLevel);
    gaugeValues.hoursOfUse = parseFloat(hoursOfUse);
    gaugeValues.operatingHours = parseFloat(operatingHours);
    gaugeValues.kva = parseFloat(kva);
    
    // Renderizamos nuevamente la página con un mensaje de éxito
    res.render('admin', { 
      gaugeValues, 
      message: {
        type: 'success',
        text: 'Valores actualizados correctamente'
      }
    });
  } catch (error) {
    console.error("Error al actualizar valores:", error);
    
    // En caso de error, mostramos un mensaje de error
    res.render('admin', { 
      gaugeValues, 
      message: {
        type: 'error',
        text: 'Error al actualizar los valores: ' + error.message
      }
    });
  }
});

// Agregar enlace en el log de inicio a la nueva página
app.listen(3001, () => {
  console.log("Backend escuchando en http://localhost:3001");
  console.log("Interfaz de administración disponible en http://localhost:3001/admin");
  console.log("Configuración de niveles disponible en http://localhost:3001/gauge-settings");
});
