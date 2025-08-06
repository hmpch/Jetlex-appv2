// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.inviteCode) {
      setError('Se requiere código de invitación');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      inviteCode: formData.inviteCode
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Error al registrar usuario');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Jetlex Aviation</h1>
          <p className="text-slate-600 mt-2">Creá tu cuenta para acceder al sistema</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          {error && <Alert type="error" message={error} className="mb-4" />}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Email corporativo</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Código de invitación</label>
              <input
                type="text"
                name="inviteCode"
                className="form-input"
                value={formData.inviteCode}
                onChange={handleChange}
                placeholder="Ingresá el código proporcionado"
                required
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Registrarse
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-4">
            ¿Ya tenés cuenta? <Link to="/login" className="text-blue-600 hover:underline">Ingresá aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;