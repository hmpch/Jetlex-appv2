// frontend/src/pages/MonitoreoEstrategico.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';
import Loading from '../components/Common/Loading';

const MonitoreoEstrategico = () => {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const [fuentes, setFuentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [showNewAlertForm, setShowNewAlertForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [filtro]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = filtro === 'todas' ? '' : filtro;
      const [alertasRes, fuentesRes] = await Promise.all([
        api.get(`/monitoreo/alertas?prioridad=${params}`),
        api.get('/monitoreo/fuentes')
      ]);
      
      setAlertas(alertasRes.data.alertas || []);
      setFuentes(fuentesRes.data.fuentes || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeida = async (alertaId) => {
    try {
      await api.patch(`/monitoreo/alertas/${alertaId}/leida`);
      loadData();
    } catch (error) {
      console.error('Error al marcar alerta:', error);
    }
  };

  const handleActivarProtocolo = async (alertaId, protocolo) => {
    try {
      await api.post(`/monitoreo/alertas/${alertaId}/protocolo`, { protocolo });
      loadData();
    } catch (error) {
      console.error('Error al activar protocolo:', error);
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'critica':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'importante':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getProtocoloInfo = (protocolo) => {
    switch (protocolo) {
      case 'verde':
        return { 
          emoji: '🟢', 
          text: 'VERDE: Monitoreo continuo', 
          color: 'text-green-600' 
        };
      case 'amarillo':
        return { 
          emoji: '🟡', 
          text: 'AMARILLO: Evaluación en 24h', 
          color: 'text-yellow-600' 
        };
      case 'rojo':
        return { 
          emoji: '🔴', 
          text: 'ROJO: Acción inmediata', 
          color: 'text-red-600' 
        };
      default:
        return { 
          emoji: '⚪', 
          text: 'Sin protocolo', 
          color: 'text-slate-600' 
        };
    }
  };

  const handleCreateAlert = async (data) => {
    try {
      await api.post('/monitoreo/alertas', data);
      setShowNewAlertForm(false);
      loadData();
    } catch (error) {
      console.error('Error al crear alerta:', error);
    }
  };

  if (loading) return <Loading />;

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monitoreo Estratégico</h1>
          <p className="text-slate-600">Sistema de vigilancia regulatoria y oportunidades</p>
        </div>
        {canEdit && (
          <Button onClick={() => setShowNewAlertForm(true)}>
            + Nueva Alerta Manual
          </Button>
        )}
      </div>

      {/* Protocolo de Activación */}
      <Card className="bg-slate-50">
        <h2 className="text-lg font-semibold mb-4">Protocolo de Activación</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🟢</span>
              <h3 className="font-semibold text-green-700">VERDE</h3>
            </div>
            <p className="text-sm text-slate-600">
              Información general. Monitoreo continuo sin activar protocolo especial.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🟡</span>
              <h3 className="font-semibold text-yellow-700">AMARILLO</h3>
            </div>
            <p className="text-sm text-slate-600">
              Cambios relevantes. Evaluar con equipo en 24h, revisar impacto en sistemas.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔴</span>
              <h3 className="font-semibold text-red-700">ROJO</h3>
            </div>
            <p className="text-sm text-slate-600">
              Evento crítico. Reunión inmediata, posible alteración de prioridades.
            </p>
          </div>
        </div>
      </Card>

      {/* Filtros y estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-600">Total Alertas</p>
          <p className="text-2xl font-bold text-slate-900">{alertas.length}</p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-slate-600">No Leídas</p>
          <p className="text-2xl font-bold text-blue-600">
            {alertas.filter(a => !a.leida).length}
          </p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-slate-600">Críticas</p>
          <p className="text-2xl font-bold text-red-600">
            {alertas.filter(a => a.prioridad === 'critica').length}
          </p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-slate-600">Con Protocolo</p>
          <p className="text-2xl font-bold text-green-600">
            {alertas.filter(a => a.protocolo).length}
          </p>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltro('todas')}
            className={`px-4 py-2 rounded ${
              filtro === 'todas'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('critica')}
            className={`px-4 py-2 rounded ${
              filtro === 'critica'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Críticas
          </button>
          <button
            onClick={() => setFiltro('importante')}
            className={`px-4 py-2 rounded ${
              filtro === 'importante'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Importantes
          </button>
          <button
            onClick={() => setFiltro('normal')}
            className={`px-4 py-2 rounded ${
              filtro === 'normal'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Normales
          </button>
        </div>
      </Card>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alertas.length === 0 ? (
          <Card className="p-8 text-center text-slate-500">
            No hay alertas para mostrar
          </Card>
        ) : (
          alertas.map((alerta) => {
            const protocoloInfo = getProtocoloInfo(alerta.protocolo);
            return (
              <Card
                key={alerta.id}
                className={`p-6 ${!alerta.leida ? 'border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {alerta.titulo}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPrioridadColor(alerta.prioridad)}`}>
                        {alerta.prioridad.toUpperCase()}
                      </span>
                      {alerta.protocolo && (
                        <span className={`flex items-center gap-1 text-sm font-medium ${protocoloInfo.color}`}>
                          {protocoloInfo.emoji} {protocoloInfo.text}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-700 mb-3">{alerta.descripcion}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>Fuente: {alerta.fuente}</span>
                      <span>•</span>
                      <span>{new Date(alerta.fecha).toLocaleDateString('es-AR')}</span>
                      {alerta.enlace && (
                        <>
                          <span>•</span>
                          
                            href={alerta.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver fuente
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {!alerta.leida && (
                    <Button
                      onClick={() => handleMarcarLeida(alerta.id)}
                      variant="secondary"
                      size="sm"
                    >
                      Marcar como leída
                    </Button>
                  )}
                </div>

                {/* Acciones de protocolo */}
                {canEdit && !alerta.protocolo && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Activar protocolo:
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleActivarProtocolo(alerta.id, 'verde')}
                        variant="secondary"
                        size="sm"
                        className="hover:bg-green-100"
                      >
                        🟢 Verde
                      </Button>
                      <Button
                        onClick={() => handleActivarProtocolo(alerta.id, 'amarillo')}
                        variant="secondary"
                        size="sm"
                        className="hover:bg-yellow-100"
                      >
                        🟡 Amarillo
                      </Button>
                      <Button
                        onClick={() => handleActivarProtocolo(alerta.id, 'rojo')}
                        variant="secondary"
                        size="sm"
                        className="hover:bg-red-100"
                      >
                        🔴 Rojo
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Fuentes Monitoreadas */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Fuentes Monitoreadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fuentes.map((fuente) => (
            <div key={fuente.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
              <div>
                <p className="font-medium">{fuente.nombre}</p>
                <p className="text-sm text-slate-500">{fuente.url}</p>
              </div>
              <span className={`text-sm px-2 py-1 rounded ${
                fuente.activa
                  ? 'bg-green-100 text-green-800'
                  : 'bg-slate-100 text-slate-800'
              }`}>
                {fuente.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal Nueva Alerta */}
      {showNewAlertForm && (
        <NewAlertModal
          onClose={() => setShowNewAlertForm(false)}
          onSubmit={handleCreateAlert}
        />
      )}
    </div>
  );
};

// Modal para crear nueva alerta manual
const NewAlertModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'normal',
    fuente: 'Manual',
    enlace: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Nueva Alerta Manual</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Título *</label>
            <input
              type="text"
              className="form-input"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="form-label">Descripción *</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="form-label">Prioridad</label>
            <select
              className="form-input"
              value={formData.prioridad}
              onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
            >
              <option value="normal">Normal</option>
              <option value="importante">Importante</option>
              <option value="critica">Crítica</option>
            </select>
          </div>

          <div>
            <label className="form-label">Enlace (opcional)</label>
            <input
              type="url"
              className="form-input"
              value={formData.enlace}
              onChange={(e) => setFormData({...formData, enlace: e.target.value})}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Alerta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MonitoreoEstrategico;