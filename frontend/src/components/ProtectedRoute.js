// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Common/Loading';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return <Loading message="Verificando autenticación..." />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles si se especificaron
  if (requiredRoles.length > 0) {
    const userRole = user?.role || 'viewer';
    
    if (!requiredRoles.includes(userRole)) {
      // Si no tiene el rol necesario, redirigir al dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Si todo está bien, renderizar los children o el Outlet
  return children || <Outlet />;
};

export default ProtectedRoute;