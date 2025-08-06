// frontend/src/pages/Clientes.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Loading from '../components/Common/Loading';
import Alert from '../components/Common/Alert';

const Clientes = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  useEffect(() => {
    loadClientes();
  }, [search]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const params = search ? `?search=${search}` : '';
      const response = await api.get(`/clientes${params}`);
      setClientes(response.data.clientes || []);
    } catch (error) {
      setError('Error al cargar clientes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewClient = async (clientData) => {
    try {
      await api.post('/clientes', clientData);
      setShowNewClientForm(false);
      loadClientes();
    } catch (error) {
      setError('Error al crear cliente');
    }
  };

  if (loading && !search) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600">Gestión de clientes y contactos</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'editor') && (
          <Button onClick={() => setShowNewClientForm(true)}>
            + Nuevo Cliente
          </Button>
        )}
      </div>

      {/* Buscador */}
      <Card className="p-4">
        <input
          type="text"
          placeholder="Buscar por nombre, email o CUIT..."
          className="form-input w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Lista de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientes.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 col-span-2">
            No se encontraron clientes
          </Card>
        ) : (
          clientes.map((cliente) => (
            <Link key={cliente.id} to={`/clientes/${cliente.id}`}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {cliente.nombre}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {cliente.email}
                    </p>
                    {cliente.telefono && (
                      <p className="text-slate-600 text-sm">
                        📞 {cliente.telefono}
                      </p>
                    )}
                    {cliente.cuit && (
                      <p className="text-slate-500 text-sm mt-2">
                        CUIT: {cliente.cuit}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {cliente._count?.expedientes || 0} expedientes
                      </span>
                      {cliente.tipo && (
                        <span className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded">
                          {cliente.tipo}
                        </span>
                      )}
                    </div>
                  </div>
                  {cliente.activo === false && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      Inactivo
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Modal de nuevo cliente */}
      {showNewClientForm && (
        <NewClientModal
          onClose={() => setShowNewClientForm(false)}
          onSubmit={handleNewClient}
        />
      )}
    </div>
  );
};

// Modal para crear nuevo cliente
const NewClientModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    cuit: '',
    direccion: '',
    tipo: 'particular',
    notas: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Nuevo Cliente</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Nombre *</label>
            <input
              type="text"
              className="form-input"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-input"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            />
          </div>

          <div>
            <label className="form-label">CUIT/CUIL</label>
            <input
              type="text"
              className="form-input"
              value={formData.cuit}
              onChange={(e) => setFormData({...formData, cuit: e.target.value})}
            />
          </div>

          <div>
            <label className="form-label">Tipo de Cliente</label>
            <select
              className="form-input"
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
            >
              <option value="particular">Particular</option>
              <option value="empresa">Empresa</option>
              <option value="aeroclub">Aeroclub</option>
              <option value="escuela">Escuela de Vuelo</option>
              <option value="linea_aerea">Línea Aérea</option>
            </select>
          </div>

          <div>
            <label className="form-label">Dirección</label>
            <textarea
              className="form-input"
              rows="2"
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            />
          </div>

          <div>
            <label className="form-label">Notas</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.notas}
              onChange={(e) => setFormData({...formData, notas: e.target.value})}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Cliente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Clientes;