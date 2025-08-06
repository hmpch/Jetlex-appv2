// frontend/src/pages/ExpedienteFases.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import Alert from '../components/Common/Alert';

const ExpedienteFases = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expediente, setExpediente] = useState(null);
  const [fases, setFases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadExpedienteAndFases();
  }, [id]);

  const loadExpedienteAndFases = async () => {
    try {
      const response = await api.get(`/expedientes/${id}`);
      setExpediente(response.data);
      setFases(response.data.fases || []);
    } catch (error) {
      setError('Error al cargar las fases del expediente');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteFase = async (faseId) => {
    try {
      setUpdating(true);
      await api.post(`/expedientes/${id}/fases/${faseId}/completar`);
      loadExpedienteAndFases();
    } catch (error) {
      setError('Error al actualizar la fase');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (faseId, nota) => {
    try {
      await api.post(`/expedientes/${id}/fases/${faseId}/notas`, { nota });
      loadExpedienteAndFases();
    } catch (error) {
      setError('Error al agregar nota');
    }
  };

  if (loading) return <Loading />;
  if (!expediente) return <Alert type="error" message="Expediente no encontrado" />;

  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Fases del Expediente {expediente.numero}
          </h1>
          <p className="text-slate-600">
            {expediente.tipoTramite.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </p>
        </div>
        
        <Button onClick={() => navigate(`/expedientes/${id}`)} variant="secondary">
          Volver al Expediente
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Progreso general */}
      <Card className="p-6">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium text-slate-600">Progreso Total</span>
          <span className="text-sm font-medium text-slate-900">
            {Math.round((fases.filter(f => f.completada).length / fases.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(fases.filter(f => f.completada).length / fases.length) * 100}%`
            }}
          />
        </div>
      </Card>

      {/* Lista de fases */}
      <div className="space-y-4">
        {fases.map((fase, index) => (
          <Card key={fase.id} className={`p-6 ${fase.completada ? 'bg-green-50' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                ${fase.completada ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {fase.completada ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{fase.nombre}</h3>
                    <p className="text-slate-600 mt-1">{fase.descripcion}</p>
                    
                    {fase.documentosRequeridos && fase.documentosRequeridos.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-700">Documentos requeridos:</p>
                        <ul className="list-disc list-inside text-sm text-slate-600 mt-1">
                          {fase.documentosRequeridos.map((doc, i) => (
                            <li key={i}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {fase.completada ? (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Completada el {new Date(fase.fechaCompletada).toLocaleDateString('es-AR')}
                      </p>
                    ) : (
                      <div className="mt-3">
                        {fase.diasEstimados && (
                          <p className="text-sm text-slate-500">
                            Tiempo estimado: {fase.diasEstimados} días
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {!fase.completada && canEdit && (
                    <Button
                      onClick={() => handleCompleteFase(fase.id)}
                      loading={updating}
                      size="sm"
                    >
                      Marcar como completada
                    </Button>
                  )}
                </div>

                {/* Notas de la fase */}
                {fase.notas && fase.notas.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-slate-700">Notas:</p>
                    {fase.notas.map((nota, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-slate-200">
                        <p className="text-sm text-slate-600">{nota.texto}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {nota.usuario} - {new Date(nota.fecha).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Agregar nota */}
                {canEdit && (
                  <div className="mt-4">
                    <AddNoteForm
                      onSubmit={(nota) => handleAddNote(fase.id, nota)}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Componente para agregar notas
const AddNoteForm = ({ onSubmit }) => {
  const [nota, setNota] = useState('');
  const [showing, setShowing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nota.trim()) {
      onSubmit(nota);
      setNota('');
      setShowing(false);
    }
  };

  if (!showing) {
    return (
      <button
        onClick={() => setShowing(true)}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        + Agregar nota
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="form-input text-sm"
        rows="2"
        placeholder="Escribir nota..."
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        autoFocus
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm">Guardar</Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setShowing(false);
            setNota('');
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ExpedienteFases;