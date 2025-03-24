module.exports = {
  root: true, // Añadido para indicar que este es el archivo de configuración raíz
  extends: ['react-app'],
  plugins: ['react'],
  rules: {
    // Desactivar algunas reglas problemáticas
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [] // Vacío para evitar conflictos
}
