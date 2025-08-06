// frontend/src/pages/MonitoreoEstrategico.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import monitoringService from '../services/monitoringService';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Badge from '../components/Common/Badge';
import Alert from '../components/Common/Alert';
import Loading from '../components/Common/Loading';
import Modal from '../components/Common/Modal';
import { 
  BellIcon, 
  RefreshIcon, 
  FilterIcon,
  ExclamationIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  LinkIcon,
  CalendarIcon
} from '@heroicons/react/outline';

const MonitoreoEstrategico = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    active: 0,
    archived: 0
  });

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [alertsData, sourcesData] = await Promise.all([
        monitoringService.getAlerts({ status: filter }),
        monitoringService.getSources()
      ]);

      setAlerts(alertsData.alerts || []);
      setSources(sourcesData.sources || []);
      
      // Calcular estadísticas
      const alertStats = alertsData.alerts.reduce((acc, alert) => {
        acc.total++;
        acc[alert.priority]++;
        acc[alert.status]++;
        return acc;
      }, {
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        active: 0,
        archived: 0
      });
      
      setStats(alertStats);
    } catch (err) {
      setError('Error al cargar las alertas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError('');
      await monitoringService.checkSources();
      await loadData();
      setSuccess('Fuentes actualizadas correctamente');
    } catch (err) {
      setError('Error al actualizar las fuentes');
    } finally {
      setRefreshing(false);
    }
  };

  const handleArchiveAlert = async (alertId) => {
    try {
      await monitoringService.archiveAlert(alertId);
      setAlerts(alerts.filter(a => a.id !== alertId));
      setSuccess('Alerta archivada correctamente');
    } catch (err) {
      setError('Error al archivar la alerta');
    }
  };

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <ExclamationIcon className="h-5 w-5" />;
      case 'medium':
        return <ClockIcon className="h-5 w-5" />;
      case 'low':
        return <CheckCircleIcon className="h-5 w-5" />;
      default:
        return <BellIcon className="h-5 w-5" />;
    }
  };

  const getSourceIcon = (type) => {
    switch (type) {
      case 'ANAC_AR':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'BOLETIN_OFICIAL':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'WEB_SCRAPING':
        return <LinkIcon className="h-5 w-5" />;
      default:
        return <BellIcon className="h-5 w-5" />;
    }
  };

  if (loading) return <Loading message="Cargando sistema de monitoreo..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Monitoreo Estratégico ANAC
            </h1>
            <p className="text-gray-600 mt-1">
              Sistema de alertas regulatorias y cambios normativos
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            loading={refreshing}
            icon={RefreshIcon}
            variant="secondary"
          >
            Actualizar fuentes
          </Button>
        </div>
      </div>

      {/* Mensajes */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Alta prioridad</p>
          <p className="text-2xl font-bold text-red-600">{stats.high}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Media prioridad</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Baja prioridad</p>
          <p className="text-2xl font-bold text-blue-600">{stats.low}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Activas</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600">Archivadas</p>
          <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FilterIcon className="h-5 w-5 mr-2" />
            Filtros
          </h2>
          <div className="flex space-x-2">
            <Button
              size="small"
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              size="small"
              variant={filter === 'active' ? 'primary' : 'secondary'}
              onClick={() => setFilter('active')}
            >
              Activas
            </Button>
            <Button
              size="small"
              variant={filter === 'archived' ? 'primary' : 'secondary'}
              onClick={() => setFilter('archived')}
            >
              Archivadas
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de Alertas */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Alertas Regulatorias
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`text-${getPriorityColor(alert.priority)}-500`}>
                      {getPriorityIcon(alert.priority)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant={getPriorityColor(alert.priority)}>
                          {alert.priority === 'high' ? 'Alta' : 
                           alert.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          {getSourceIcon(alert.source)}
                          <span className="ml-1">{alert.source}</span>
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleViewAlert(alert)}
                    >
                      Ver detalles
                    </Button>
                    {alert.status === 'active' && (
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleArchiveAlert(alert.id)}
                        icon={XCircleIcon}
                      >
                        Archivar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No hay alertas {filter !== 'all' ? filter === 'active' ? 'activas' : 'archivadas' : ''} en este momento
            </div>
          )}
        </div>
      </Card>

      {/* Fuentes de Monitoreo */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Fuentes de Monitoreo
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sources.map((source) => (
            <div key={source.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400">
                    {getSourceIcon(source.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {source.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {source.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={source.active ? 'green' : 'gray'}>
                    {source.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Última verificación: {new Date(source.lastCheck).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal de Detalles */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles de la Alerta"
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {selectedAlert.title}
              </h3>
              <Badge variant={getPriorityColor(selectedAlert.priority)} className="mt-2">
                Prioridad {selectedAlert.priority === 'high' ? 'Alta' : 
                          selectedAlert.priority === 'medium' ? 'Media' : 'Baja'}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Descripción</h4>
              <p className="mt-1 text-sm text-gray-600">
                {selectedAlert.description}
              </p>
            </div>

            {selectedAlert.details && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Detalles adicionales</h4>
                <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedAlert.details}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Fuente:</span>
                <span className="ml-2 text-gray-600">{selectedAlert.source}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Estado:</span>
                <span className="ml-2 text-gray-600">
                  {selectedAlert.status === 'active' ? 'Activa' : 'Archivada'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Creada:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(selectedAlert.createdAt).toLocaleString()}
                </span>
              </div>
              {selectedAlert.url && (
                <div>
                  <span className="font-medium text-gray-700">URL:</span>
                  <a 
                    href={selectedAlert.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    Ver fuente
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </Button>
              {selectedAlert.status === 'active' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleArchiveAlert(selectedAlert.id);
                    setShowModal(false);
                  }}
                >
                  Archivar alerta
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MonitoreoEstrategico;