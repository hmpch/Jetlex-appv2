// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';
import Logo from '../components/Common/Logo';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Obtener la ruta a la que intentaba acceder antes del login
  const from = location.state?.from?.pathname || '/dashboard';

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones básicas
    if (!formData.email || !formData.password) {
      setError('Por favor completá todos los campos');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirigir a la página que intentaba acceder o al dashboard
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="max-w-md w-full mx-4">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="large" />
          </div>
          <h1 className="text-3xl font-bold text-white">Jetlex Aviation</h1>
          <p className="text-slate-300 mt-2">Sistema de Gestión Aeronáutica</p>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Ingresá a tu cuenta
          </h2>

          {error && (
            <Alert 
              type="error" 
              message={error} 
              className="mb-4" 
              onClose={() => setError('')}
            />
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            
            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Link de contraseña olvidada */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de submit */}
            <Button 
              type="submit" 
              loading={loading} 
              className="w-full"
              size="large"
            >
              Ingresar
            </Button>
          </form>

          {/* Link de registro */}
          <p className="text-center text-sm text-slate-600 mt-6">
            ¿No tenés cuenta?{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Registrate aquí
            </Link>
          </p>
        </div>

        {/* Información adicional */}
        <p className="text-center text-xs text-slate-400 mt-4">
          © 2024 Jetlex Aviation. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;