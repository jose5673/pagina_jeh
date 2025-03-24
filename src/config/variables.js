// Objeto con la configuración visual de la aplicación
let visualConfig = {
  tema: "claro",           // "claro" o "oscuro"
  colorPrimario: "#ffb100", // Color hexadecimal
  sidebarExpandido: true,   // true o false
  idioma: "es",             // "es" o "en"
  mostrarIconos: true       // true o false
};

/**
 * Obtiene el valor de una variable de configuración
 * @param {string} clave - Nombre de la propiedad a obtener
 * @returns {any} El valor de la configuración solicitada
 */
const obtenerVariable = (clave) => {
  if (clave in visualConfig) {
    return visualConfig[clave];
  }
  console.warn(`La clave "${clave}" no existe en la configuración.`);
  return null;
};

/**
 * Actualiza el valor de una variable de configuración
 * @param {string} clave - Nombre de la propiedad a actualizar
 * @param {any} valor - Nuevo valor para la propiedad
 * @returns {boolean} Indica si la actualización fue exitosa
 */
const actualizarVariable = (clave, valor) => {
  if (clave in visualConfig) {
    visualConfig[clave] = valor;
    
    // Aquí podríamos agregar lógica para persistir en localStorage
    // o enviar al backend en una implementación futura
    
    return true;
  }
  console.warn(`La clave "${clave}" no existe en la configuración.`);
  return false;
};

export { visualConfig, obtenerVariable, actualizarVariable };
