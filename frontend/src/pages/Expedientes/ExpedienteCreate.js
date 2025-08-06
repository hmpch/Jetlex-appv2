// frontend/src/pages/Expedientes.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import Alert from '../components/Common/Alert';
import StatusBadge from '../components/Common/StatusBadge';

const Expedientes = () => {
  const { user } = useAuth();
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    urgencia: '',
    estado: '',
    tipoTramite: ''
  });

  useEffect(() => {
    loadExpedientes();
  }, [filters]);

  const loadExpedientes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await api.get(`/expedientes?${params}`);
      setExpedientes(response.data.expedientes || []);
    } catch (error) {
      setError('Error al cargar expedientes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expedientes</h1>
          <p className="text-slate-600">Gestión de trámites aeronáuticos</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'editor') && (
          <Link to="/expedientes/nuevo">
            <Button>+ Nuevo Expediente</Button>
          </Link>
        )}
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Buscar por número o cliente..."
            className="form-input"
            value={filters.search}
            onChange={handleFilterChange}
          />
          
          <select
            name="urgencia"
            className="form-input"
            value={filters.urgencia}
            onChange={handleFilterChange}
          >
            <option value="">Todas las urgencias</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <select
            name="estado"
            className="form-input"
            value={filters.estado}
            onChange={handleFilterChange}
          >
            <option value="">Todos los estados</option>
            <option value="borrador">Borrador</option>
            <option value="en_proceso">En Proceso</option>
            <option value="esperando_documentos">Esperando Documentos</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            name="tipoTramite"
            className="form-input"
            value={filters.tipoTramite}
            onChange={handleFilterChange}
          >
            <option value="">Todos los tipos</option>
            <option value="transferencia">Transferencia de Dominio</option>
            <option value="matriculacion">Matriculación</option>
            <option value="certificacion_empresa">Certificación de Empresa</option>
            <option value="importacion">Importación de Aeronave</option>
            <option value="exportacion">Exportación de Aeronave</option>
          </select>
        </div>
      </Card>

      {error && <Alert type="error" message={error} />}

      {/* Lista de expedientes */}
      <div className="grid grid-cols-1 gap-4">
        {expedientes.length === 0 ? (
          <Card className="p-8 text-center text-slate-500">
            No se encontraron expedientes
          </Card>
        ) : (
          expedientes.map((expediente) => (
            <Link key={expediente.id} to={`/expedientes/${expediente.id}`}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {expediente.numero}
                      </h3>
                      <StatusBadge estado={expediente.estado} />
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${expediente.urgencia === 'alta' ? 'bg-red-100 text-red-800' : 
                          expediente.urgencia === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        Urgencia {expediente.urgencia}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 mb-1">
                      <span className="font-medium">Cliente:</span> {expediente.cliente?.nombre || 'Sin asignar'}
                    </p>
                    
                    <p className="text-slate-600 mb-1">
                      <span className="font-medium">Tipo:</span> {
                        expediente.tipoTramite.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')
                      }
                    </p>
                    
                    <p className="text-sm text-slate-500">
                      Actualizado: {new Date(expediente.updatedAt).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Progreso</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {expediente.progreso || 0}%
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Expedientes;