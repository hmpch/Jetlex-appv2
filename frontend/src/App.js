import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expedientes from './pages/Expedientes';
import ExpedienteDetail from './pages/ExpedienteDetail';
import ExpedienteFases from './pages/ExpedienteFases';
import Clientes from './pages/Clientes';
import ClienteDetail from './pages/ClienteDetail';
import OSINTPanel from './pages/OSINTPanel';
import Profile from './pages/Profile';
import MonitoreoEstrategico from './pages/MonitoreoEstrategico';
import SistemaDecisiones from './pages/SistemaDecisiones';

// Styles
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="expedientes" element={<Expedientes />} />
              <Route path="expedientes/:id" element={<ExpedienteDetail />} />
              <Route path="expedientes/:id/fases" element={<ExpedienteFases />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="clientes/:id" element={<ClienteDetail />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Rutas protegidas por rol */}
              <Route path="osint" element={
                <ProtectedRoute requiredRoles={['admin', 'colaboradorA']}>
                  <OSINTPanel />
                </ProtectedRoute>
              } />
              <Route path="monitoreo" element={
                <ProtectedRoute requiredRoles={['admin', 'colaboradorA']}>
                  <MonitoreoEstrategico />
                </ProtectedRoute>
              } />
              <Route path="decisiones" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <SistemaDecisiones />
                </ProtectedRoute>
              } />
              {/* Placeholder para futuras rutas */}
              {/* <Route path="calendar" element={<CalendarPage />} /> */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;