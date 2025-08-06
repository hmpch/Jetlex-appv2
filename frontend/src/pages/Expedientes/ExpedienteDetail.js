// frontend/src/pages/ExpedienteDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import Alert from '../components/Common/Alert';
import StatusBadge from '../components/Common/StatusBadge';

const ExpedienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    loadExpediente();
    loadDocumentos();
  }, [id]);

  const loadExpediente = async () => {
    try {
      const response = await api.get(`/expedientes/${id}`);
      setExpediente(response.data);
      setFormData(response.data);
    } catch (error) {
      setError('Error al cargar el expediente');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentos = async () => {
    try {
      const response = await api.get(`/expedientes/${id}/documentos`);
      setDocumentos(response.data.documentos || []);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await api.put(`/expedientes/${id}`, formData);
      setExpediente(response.data);
      setEditMode(false);
      // Mostrar mensaje de éxito
    } catch (error) {
      setError('Error al actualizar el expediente');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('documento', file);
    formData.append('expedienteId', id);

    try {
      await api.post('/documentos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      loadDocumentos();
    } catch (error) {
      setError('Error al subir documento');
    }
  };

  if (loading) return <Loading />;
  if (!expediente) return <Alert type="error" message="Expediente no encontrado" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{expediente.numero}</h1>
          <div className="flex items-center gap-4 mt-2">
            <StatusBadge estado={expediente.estado} />
            <span className={`px-2 py-1 rounded text-xs font-medium
              ${expediente.urgencia === 'alta' ? 'bg-red-100 text-red-800' : 
                expediente.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'}`}>
              Urgencia {expediente.urgencia}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!editMode && (user?.role === 'admin' || user?.role === 'editor') && (
            <Button onClick={() => setEditMode(true)} variant="secondary">
              Editar
            </Button>
          )}
          <Button onClick={() => navigate('/expedientes')} variant="secondary">
            Volver
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Información Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Información del Expediente</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600">Tipo de Trámite</label>
              <p className="text-slate-900">
                {expediente.tipoTramite.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Estado</label>
              {editMode ? (
                <select
                  className="form-input"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                >
                  <option value="borrador">Borrador</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="esperando_documentos">Esperando Documentos</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              ) : (
                <p className="text-slate-900">{expediente.estado}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Urgencia</label>
              {editMode ? (
                <select
                  className="form-input"
                  value={formData.urgencia}
                  onChange={(e) => setFormData({...formData, urgencia: e.target.value})}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              ) : (
                <p className="text-slate-900 capitalize">{expediente.urgencia}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Fecha de Creación</label>
              <p className="text-slate-900">
                {new Date(expediente.createdAt).toLocaleDateString('es-AR')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Última Actualización</label>
              <p className="text-slate-900">
                {new Date(expediente.updatedAt).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>

          {editMode && (
            <div className="mt-4 flex gap-2">
              <Button onClick={handleUpdate}>Guardar</Button>
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Cancelar
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600">Nombre</label>
              <p className="text-slate-900">{expediente.cliente?.nombre || 'Sin asignar'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <p className="text-slate-900">{expediente.cliente?.email || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Teléfono</label>
              <p className="text-slate-900">{expediente.cliente?.telefono || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">CUIT/CUIL</label>
              <p className="text-slate-900">{expediente.cliente?.cuit || '-'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Documentos */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Documentos</h2>
          {(user?.role === 'admin' || user?.role === 'editor') && (
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button as="span">+ Subir Documento</Button>
            </label>
          )}
        </div>

        {documentos.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No hay documentos cargados
          </p>
        ) : (
          <div className="space-y-2">
            {documentos.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                <div>
                  <p className="font-medium">{doc.nombre}</p>
                  <p className="text-sm text-slate-500">
                    Subido el {new Date(doc.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(doc.url, '_blank')}
                >
                  Ver
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Fases del expediente */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Progreso del Expediente</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          {expediente.fases?.map((fase, index) => (
            <div key={fase.id} className="relative flex items-start mb-6 last:mb-0">
              <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center
                ${fase.completada ? 'bg-green-500' : 'bg-slate-300'}`}>
                <span className="text-white text-sm">{index + 1}</span>
              </div>
              <div className="ml-12 flex-1">
                <h3 className="font-medium text-slate-900">{fase.nombre}</h3>
                <p className="text-sm text-slate-600 mt-1">{fase.descripcion}</p>
                {fase.completada && (
                  <p className="text-xs text-slate-500 mt-1">
                    Completada el {new Date(fase.fechaCompletada).toLocaleDateString('es-AR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ExpedienteDetail;