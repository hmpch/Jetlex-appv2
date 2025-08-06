// frontend/src/pages/SistemaDecisiones.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';
import Loading from '../components/Common/Loading';

const SistemaDecisiones = () => {
  const { user } = useAuth();
  const [decisiones, setDecisiones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [filtroNivel, setFiltroNivel] = useState('todos');

  useEffect(() => {
    loadData();
  }, [filtroNivel]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [decisionesRes, statsRes] = await Promise.all([
        api.get(`/decisiones?nivel=${filtroNivel === 'todos' ? '' : filtroNivel}`),
        api.get('/decisiones/estadisticas')
      ]);
      
      setDecisiones(decisionesRes.data.decisiones || []);
      setEstadisticas(statsRes.data || {});
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNivelInfo = (nivel) => {
    switch (nivel) {
      case 1:
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          emoji: '🔴',
          texto: 'NIVEL 1 - Solo Fundador',
          descripcion: 'Decisiones estratégicas críticas'
        };
      case 2:
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          emoji: '🟡',
          texto: 'NIVEL 2 - Consulta Obligatoria',
          descripcion: 'Requiere validación del fundador'
        };
      case 3:
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          emoji: '🟢',
          texto: 'NIVEL 3 - Delegada',
          descripcion: 'Autonomía total del equipo'
        };
      default:
        return {
          color: 'bg-slate-100 text-slate-800 border-slate-300',
          emoji: '⚪',
          texto: 'Sin clasificar',
          descripcion: ''
        };
    }
  };

  if (loading) return <Loading />;

  const canManage = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sistema de Decisiones de 3 Niveles</h1>
          <p className="text-slate-600">Matriz de decisiones para autonomía operativa</p>
        </div>
        {canManage && (
          <Button onClick={() => setShowConfigModal(true)}>
            ⚙️ Configurar Matriz
          </Button>
        )}
      </div>

      {/* Matriz de Referencia */}
      <Card className="bg-slate-50">
        <h2 className="text-lg font-semibold mb-4">Matriz de Decisiones Jetlex</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded border-2 border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔴</span>
                <h3 className="font-semibold text-red-700">NIVEL 1</h3>
              </div>
              <p className="text-sm font-medium text-slate-700 mb-2">Solo Fundador</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Decisiones &gt; $5,000</li>
                <li>• Nuevos servicios estratégicos</li>
                <li>• Alianzas y partnerships</li>
                <li>• Cambios de estructura organizacional</li>
                <li>• Conflictos con clientes VIP</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded border-2 border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🟡</span>
                <h3 className="font-semibold text-yellow-700">NIVEL 2</h3>
              </div>
              <p className="text-sm font-medium text-slate-700 mb-2">Consulta Obligatoria</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Decisiones $1,000 - $5,000</li>
                <li>• Problemas con ANAC</li>
                <li>• Modificaciones de procesos críticos</li>
                <li>• Contrataciones o despidos</li>
                <li>• Excepciones a políticas</li>
              </ul>
              <p className="text-xs text-slate-500 mt-2">
                ⏱️ Si no hay respuesta en 24h, escalar automáticamente
              </p>
            </div>
            
            <div className="bg-white p-4 rounded border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🟢</span>
                <h3 className="font-semibold text-green-700">NIVEL 3</h3>
              </div>
              <p className="text-sm font-medium text-slate-700 mb-2">Equipo Autónomo</p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Decisiones &lt; $1,000</li>
                <li>• Gestiones rutinarias ANAC</li>
                <li>• Documentación estándar</li>
                <li>• Consultas básicas de clientes</li>
                <li>• Procesos operativos diarios</li>
              </ul>
              <p className="text-xs text-slate-500 mt-2">
                ✅ Decisión inmediata sin consultar
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-600">Total Decisiones</p>
          <p className="text-2xl font-bold text-slate-900">{estadisticas.total || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Últimos 30 días</p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-slate-600">Nivel 1</p>
          <p className="text-2xl font-bold text-red-600">{estadisticas.nivel1 || 0}</p>
          <p className="text-xs text-slate-500 mt-1">
            {estadisticas.total ? Math.round((estadisticas.nivel1 / estadisticas.total) * 100) : 0}% del total
          </p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-slate-600">Nivel 2</p>
          <p className="text-2xl font-bold text-yellow-600">{estadisticas.nivel2 || 0}</p>
          <p className="text-xs text-slate-500 mt-1">
            {estadisticas.total ? Math.round((estadisticas.nivel2 / estadisticas.total) * 100) : 0}% del total
          </p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-slate-600">Nivel 3</p>
          <p className="text-2xl font-bold text-green-600">{estadisticas.nivel3 || 0}</p>
          <p className="text-xs text-slate-500 mt-1">
            {estadisticas.total ? Math.round((estadisticas.nivel3 / estadisticas.total) * 100) : 0}% del total
          </p>
        </Card>
      </div>

      {/* KPIs de Efectividad */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Indicadores de Efectividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">Decisiones Delegadas</span>
              <span className="text-sm font-bold text-slate-900">
                {estadisticas.porcentajeDelegadas || 0}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${estadisticas.porcentajeDelegadas || 0}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Meta: 80%</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">Tiempo Promedio Decisión</span>
              <span className="text-sm font-bold text-slate-900">
                {estadisticas.tiempoPromedio || '0h'}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              <p>Nivel 1: {estadisticas.tiempoNivel1 || '0h'}</p>
              <p>Nivel 2: {estadisticas.tiempoNivel2 || '0h'}</p>
              <p>Nivel 3: {estadisticas.tiempoNivel3 || '0h'}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">Conflictos Escalados</span>
              <span className="text-sm font-bold text-slate-900">
                {estadisticas.conflictosEscalados || 0}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Meta: 0 conflictos no resueltos en 7 días
            </p>
          </div>
        </div>
      </Card>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroNivel('todos')}
            className={`px-4 py-2 rounded ${
              filtroNivel === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroNivel('1')}
            className={`px-4 py-2 rounded ${
              filtroNivel === '1'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nivel 1
          </button>
          <button
            onClick={() => setFiltroNivel('2')}
            className={`px-4 py-2 rounded ${
              filtroNivel === '2'
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nivel 2
          </button>
          <button
            onClick={() => setFiltroNivel('3')}
            className={`px-4 py-2 rounded ${
              filtroNivel === '3'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nivel 3
          </button>
        </div>
      </Card>

      {/* Historial de Decisiones Recientes */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Decisiones Recientes</h2>
        {decisiones.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No hay decisiones registradas aún
          </p>
        ) : (
          <div className="space-y-3">
            {decisiones.map((decision) => {
              const nivelInfo = getNivelInfo(decision.nivel);
              return (
                <div
                  key={decision.id}
                  className={`p-4 rounded border ${nivelInfo.color}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{nivelInfo.emoji}</span>
                        <h4 className="font-medium">{decision.titulo}</h4>
                      </div>
                      <p className="text-sm mb-2">{decision.descripcion}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span>Por: {decision.usuario}</span>
                        <span>•</span>
                        <span>{new Date(decision.fecha).toLocaleDateString('es-AR')}</span>
                        {decision.montoInvolucrado && (
                          <>
                            <span>•</span>
                            <span>${decision.montoInvolucrado}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      decision.estado === 'aprobada'
                        ? 'bg-green-100 text-green-800'
                        : decision.estado === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {decision.estado}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal de Configuración */}
      {showConfigModal && (
        <ConfigModal
          onClose={() => setShowConfigModal(false)}
          onSave={async (config) => {
            try {
              await api.put('/decisiones/configuracion', config);
              setShowConfigModal(false);
              // Mostrar mensaje de éxito
            } catch (error) {
              console.error('Error al guardar configuración:', error);
            }
          }}
        />
      )}
    </div>
  );
};

// Modal de configuración de matriz
const ConfigModal = ({ onClose, onSave }) => {
  const [config, setConfig] = useState({
    nivel1_monto_min: 5000,
    nivel2_monto_min: 1000,
    nivel2_tiempo_respuesta: 24,
    notificaciones_activas: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Configurar Matriz de Decisiones</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">
              Monto mínimo Nivel 1 (USD)
            </label>
            <input
              type="number"
              className="form-input"
              value={config.nivel1_monto_min}
              onChange={(e) => setConfig({...config, nivel1_monto_min: parseInt(e.target.value)})}
              min="1000"
            />
          </div>

          <div>
            <label className="form-label">
              Monto mínimo Nivel 2 (USD)
            </label>
            <input
              type="number"
              className="form-input"
              value={config.nivel2_monto_min}
              onChange={(e) => setConfig({...config, nivel2_monto_min: parseInt(e.target.value)})}
              min="100"
            />
          </div>

          <div>
            <label className="form-label">
              Tiempo respuesta Nivel 2 (horas)
            </label>
            <input
              type="number"
              className="form-input"
              value={config.nivel2_tiempo_respuesta}
              onChange={(e) => setConfig({...config, nivel2_tiempo_respuesta: parseInt(e.target.value)})}
              min="1"
              max="72"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded text-blue-600"
                checked={config.notificaciones_activas}
                onChange={(e) => setConfig({...config, notificaciones_activas: e.target.checked})}
              />
              <span className="text-sm">Activar notificaciones automáticas</span>
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Configuración
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SistemaDecisiones;