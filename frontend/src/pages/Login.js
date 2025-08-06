// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Jetlex Aviation</h1>
          <p className="text-slate-600 mt-2">Ingresá a tu cuenta</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          {error && <Alert type="error" message={error} className="mb-4" />}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Ingresar
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-4">
            ¿No tenés cuenta? <Link to="/register" className="text-blue-600 hover:underline">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;