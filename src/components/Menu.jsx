import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faUsers, faCogs, faServer, 
  faLayerGroup, faBoxes, faTruck, faCube, 
  faClipboardList, faExclamationTriangle, faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';
import { useGroups } from './GroupsContext';

function Menu() {
  const { groups = [] } = useGroups() || {};
  const [stats, setStats] = useState({
    totalAssets: 0,
    onlineAssets: 0,
    totalGauges: 0,
    activeGauges: 0,
    groups: 0,
    alerts: 0,
    systemStatus: 'online'
  });
  const [loading, setLoading] = useState(true);
  const [statusMessages, setStatusMessages] = useState([]);

  // Simulamos cargar datos de estadística
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Aquí se podría implementar una llamada real a la API
        // Por ahora usamos valores simulados
        setTimeout(() => {
          setStats({
            totalAssets: 42,
            onlineAssets: 36,
            totalGauges: 9,
            activeGauges: 9,
            groups: groups.length,
            alerts: Math.floor(Math.random() * 3),
            systemStatus: 'online'
          });
          
          setStatusMessages([
            { id: 1, type: 'info', message: 'Sistema funcionando correctamente', time: '2 min ago' },
            { id: 2, type: 'warning', message: 'Actualización programada para esta noche', time: '15 min ago' },
            { id: 3, type: 'success', message: 'Sincronización de datos completada', time: '1 hora ago' }
          ]);
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setLoading(false);
      }
    };
    
    loadStats();
  }, [groups.length]);

  if (loading) {
    return <div className="loading-indicator">Cargando panel de control...</div>;
  }

  return (
    <div className="main-content">
      <div className="container">
        <h1 className="text-2xl font-bold mb-2">Panel de Control</h1>
        <p className="text-gray-600 mb-6">Bienvenido al sistema de monitoreo de H&H Grupos</p>
        
        {/* Resumen de estadísticas */}
        <div className="card-grid mb-8">
          <div className="card bg-white overflow-hidden">
            <div className="p-4 bg-blue-600 text-white">
              <FontAwesomeIcon icon={faBoxes} className="text-2xl mb-2" />
              <h3 className="text-lg font-semibold">Activos</h3>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">{stats.totalAssets}</div>
              <p className="text-gray-600">Total registrados</p>
              <div className="mt-2 text-sm">
                <span className="text-green-600 font-medium">{stats.onlineAssets} Online</span> / 
                <span className="text-gray-500 font-medium">{stats.totalAssets - stats.onlineAssets} Offline</span>
              </div>
            </div>
          </div>
          
          <div className="card bg-white overflow-hidden">
            <div className="p-4 bg-green-600 text-white">
              <FontAwesomeIcon icon={faChartLine} className="text-2xl mb-2" />
              <h3 className="text-lg font-semibold">Medidores</h3>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">{stats.totalGauges}</div>
              <p className="text-gray-600">Medidores configurados</p>
              <div className="mt-2 text-sm">
                <span className="text-green-600 font-medium">{Math.round(stats.activeGauges / stats.totalGauges * 100)}% Activos</span>
              </div>
            </div>
          </div>
          
          <div className="card bg-white overflow-hidden">
            <div className="p-4 bg-yellow-600 text-white">
              <FontAwesomeIcon icon={faLayerGroup} className="text-2xl mb-2" />
              <h3 className="text-lg font-semibold">Grupos</h3>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">{stats.groups}</div>
              <p className="text-gray-600">Grupos configurados</p>
              <div className="mt-2">
                <Link to="/manage-groups" className="text-blue-600 hover:underline text-sm">
                  Administrar grupos
                </Link>
              </div>
            </div>
          </div>
          
          <div className="card bg-white overflow-hidden">
            <div className="p-4 bg-red-600 text-white">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl mb-2" />
              <h3 className="text-lg font-semibold">Alertas</h3>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold">{stats.alerts}</div>
              <p className="text-gray-600">Alertas activas</p>
              <div className="mt-2 text-sm">
                {stats.alerts > 0 ? (
                  <span className="text-red-600 font-medium">Requiere atención</span>
                ) : (
                  <span className="text-green-600 font-medium">Sin alertas</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Accesos rápidos */}
        <h2 className="text-xl font-bold mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FontAwesomeIcon icon={faTruck} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Fleet</h3>
            </div>
            <p className="text-gray-600 mb-4">Gestiona tu flota de vehículos y activos en tiempo real.</p>
            <Link to="/fleet" className="mt-auto px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700 transition-colors">
              Ir a Fleet
            </Link>
          </div>
          
          <div className="flex flex-col p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <FontAwesomeIcon icon={faLayerGroup} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Grupos</h3>
            </div>
            <p className="text-gray-600 mb-4">Visualiza y administra los grupos de activos configurados.</p>
            <Link to="/group" className="mt-auto px-4 py-2 bg-green-600 text-white rounded text-center hover:bg-green-700 transition-colors">
              Ver Grupos
            </Link>
          </div>
          
          <div className="flex flex-col p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <FontAwesomeIcon icon={faCube} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Cockpit</h3>
            </div>
            <p className="text-gray-600 mb-4">Accede al panel de instrumentos y control de medidores.</p>
            <Link to="/dashboard" className="mt-auto px-4 py-2 bg-purple-600 text-white rounded text-center hover:bg-purple-700 transition-colors">
              Ver Medidores
            </Link>
          </div>
        </div>
        
        {/* Grupos recientes */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Grupos Recientes</h2>
          <Link to="/manage-groups" className="text-blue-600 hover:underline">
            Ver todos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {groups.length > 0 ? (
            groups.slice(0, 3).map((group) => (
              <div key={group.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  {group.name}
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    Ref: {group.refNumber}
                  </span>
                </h3>
                <div className="flex justify-between mb-2">
                  <Link 
                    to={`/grupo/${group.id}/gauges`} 
                    className="text-blue-600 hover:underline text-sm flex items-center"
                  >
                    <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                    Ver Medidores
                  </Link>
                  <Link 
                    to={`/grupo/${group.id}/config`} 
                    className="text-gray-600 hover:underline text-sm flex items-center"
                  >
                    <FontAwesomeIcon icon={faCogs} className="mr-1" />
                    Configurar
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 mb-2">No hay grupos configurados</p>
              <Link to="/manage-groups" className="text-blue-600 hover:underline">
                Crear un nuevo grupo
              </Link>
            </div>
          )}
        </div>
        
        {/* Estado del sistema */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Estado del Sistema</h2>
          <span className={`px-2 py-1 rounded-full text-sm ${
            stats.systemStatus === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {stats.systemStatus === 'online' ? 'En línea' : 'Fuera de línea'}
          </span>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Backend API</span>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Operativo
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Comunicación PLC</span>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Normal
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Almacenamiento</span>
              <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                70% Usado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-2">Mensajes del Sistema</h4>
            
            <div className="max-h-40 overflow-y-auto">
              {statusMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`mb-2 p-2 rounded text-sm ${
                    message.type === 'info' ? 'bg-blue-50 text-blue-700' :
                    message.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    message.type === 'success' ? 'bg-green-50 text-green-700' :
                    'bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-start">
                    <FontAwesomeIcon 
                      icon={
                        message.type === 'info' ? faInfoCircle :
                        message.type === 'warning' ? faExclamationTriangle :
                        faInfoCircle
                      } 
                      className="mt-0.5 mr-2" 
                    />
                    <div>
                      <p>{message.message}</p>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enlaces a documentación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#" className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faClipboardList} className="text-blue-600 text-2xl mr-3" />
            <div>
              <h4 className="font-semibold">Documentación</h4>
              <p className="text-sm text-gray-600">Manuales y guías de uso</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faUsers} className="text-purple-600 text-2xl mr-3" />
            <div>
              <h4 className="font-semibold">Soporte</h4>
              <p className="text-sm text-gray-600">Contactar a soporte técnico</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faServer} className="text-green-600 text-2xl mr-3" />
            <div>
              <h4 className="font-semibold">Estado Servidor</h4>
              <p className="text-sm text-gray-600">Monitoreo de infraestructura</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Menu;
