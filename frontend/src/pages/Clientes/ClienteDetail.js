// frontend/src/pages/ClienteDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import Alert from '../components/Common/Alert';
import StatusBadge from '../components/Common/StatusBadge';

const ClienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cliente, setCliente] = useState(null);
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadCliente();
    loadExpedientes();
  }, [id]);

  const loadCliente = async () => {
    try {
      const response = await api.get(`/clientes/${id}`);
      setCliente(response.data);
      setFormData(response.data);
    } catch (error) {
      setError('Error al cargar el cliente');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExpedientes = async () => {
    try {
      const response = await api.get(`/expedientes?clienteId=${id}`);
      setExpedientes(response.data.expedientes || []);
    } catch (error) {
      console.error('Error al cargar expedientes:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.put(`/clientes/${id}`, formData);
      setCliente(response.data);
      setEditMode(false);
    } catch (error) {
      setError('Error al actualizar cliente');
    }
  };

  const handleToggleActive = async () => {
    try {
      const response = await api.patch(`/clientes/${id}/toggle-active`);
      setCliente(response.data);
    } catch (error) {
      setError('Error al cambiar estado del cliente');
    }
  };

  if (loading) return <Loading />;
  if (!cliente) return <Alert type="error" message="Cliente no encontrado" />;

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{cliente.nombre}</h1>
          <div className="flex items-center gap-4 mt-2">
            {cliente.tipo && (
              <span className="text-sm bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {cliente.tipo.charAt(0).toUpperCase() + cliente.tipo.slice(1).replace('_', ' ')}
              </span>
            )}
            {!cliente.activo && (
              <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                Cliente Inactivo
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {!editMode && canEdit && (
            <>
              <Button onClick={() => setEditMode(true)} variant="secondary">
                Editar
              </Button>
              <Button
                onClick={handleToggleActive}
                variant={cliente.activo ? "danger" : "primary"}
              >
                {cliente.activo ? 'Desactivar' : 'Activar'}
              </Button>
            </>
          )}
          <Button onClick={() => navigate('/clientes')} variant="secondary">
            Volver
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Información del Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Información de Contacto</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              {editMode ? (
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              ) : (
                <p className="text-slate-900">{cliente.email}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Teléfono</label>
              {editMode ? (
                <input
                  type="tel"
                  className="form-input"
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              ) : (
                <p className="text-slate-900">{cliente.telefono || '-'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">CUIT/CUIL</label>
              {editMode ? (
                <input
                  type="text"
                  className="form-input"
                  value={formData.cuit || ''}
                  onChange={(e) => setFormData({...formData, cuit: e.target.value})}
                />
              ) : (
                <p className="text-slate-900">{cliente.cuit || '-'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Dirección</label>
              {editMode ? (
                <textarea
                  className="form-input"
                  rows="2"
                  value={formData.direccion || ''}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                />
              ) : (
                <p className="text-slate-900">{cliente.direccion || '-'}</p>
              )}
            </div>
          </div>

          {editMode && (
            <div className="mt-4 flex gap-2">
              <Button onClick={handleUpdate}>Guardar</Button>
              <Button variant="secondary" onClick={() => {
                setEditMode(false);
                setFormData(cliente);
              }}>
                Cancelar
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded">
              <p className="text-2xl font-bold text-blue-600">{expedientes.length}</p>
              <p className="text-sm text-slate-600">Expedientes Totales</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded">
              <p className="text-2xl font-bold text-green-600">
                {expedientes.filter(e => e.estado === 'completado').length}
              </p>
              <p className="text-sm text-slate-600">Completados</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded">
              <p className="text-2xl font-bold text-orange-600">
                {expedientes.filter(e => e.estado === 'en_proceso').length}
              </p>
              <p className="text-sm text-slate-600">En Proceso</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded">
              <p className="text-2xl font-bold text-slate-600">
                {new Date(cliente.createdAt).toLocaleDateString('es-AR')}
              </p>
              <p className="text-sm text-slate-600">Cliente Desde</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Notas */}
      {cliente.notas && (
        <Card>
          <h2 className="text-lg font-semibold mb-4">Notas</h2>
          <p className="text-slate-700 whitespace-pre-wrap">{cliente.notas}</p>
        </Card>
      )}

      {/* Expedientes del Cliente */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Expedientes</h2>
          {canEdit && (
            <Button
              onClick={() => navigate(`/expedientes/nuevo?clienteId=${id}`)}
              size="sm"
            >
              + Nuevo Expediente
            </Button>
          )}
        </div>

        {expedientes.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No hay expedientes registrados para este cliente
          </p>
        ) : (
          <div className="space-y-3">
            {expedientes.map((expediente) => (
              <div
                key={expediente.id}
                onClick={() => navigate(`/expedientes/${expediente.id}`)}
                className="flex justify-between items-center p-4 bg-slate-50 rounded hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900">{expediente.numero}</p>
                  <p className="text-sm text-slate-600">
                    {expediente.tipoTramite.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge estado={expediente.estado} />
                  <span className={`text-xs px-2 py-1 rounded
                    ${expediente.urgencia === 'alta' ? 'bg-red-100 text-red-800' : 
                      expediente.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {expediente.urgencia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClienteDetail;