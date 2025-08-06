import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import {
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  BellAlertIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import KPICard from '../components/KPICard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, monitoreoRes] = await Promise.all([
          api.get('/expedientes/stats/dashboard'),
          api.get('/monitoreo/dashboard'),
        ]);

        setStats({ ...statsRes.data, ...monitoreoRes.data });
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Dashboard Estratégico Jetlex</h1>
        <p className="text-slate-300">Bienvenido de nuevo, {user?.name}</p>
      </div>
      
      {/* KPIs Estratégicos */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard
           title="Sistemas en Verde"
           value={`${95}%`} // Valor de ejemplo
           icon={CheckCircleIcon}
           color="green"
         />
         <KPICard
           title="Impacto Ingresos"
           value={`+$${12500}`} // Valor de ejemplo
           icon={CurrencyDollarIcon}
           color="blue"
         />
         <KPICard
           title="KPIs Cumplidos"
           value={`${88}%`} // Valor de ejemplo
           icon={ChartBarIcon}
           color="indigo"
         />
         <KPICard
           title="Alertas Detectadas"
           value={stats.totalAlertas || 0}
           icon={BellAlertIcon}
           color="orange"
         />
      </div>

      {/* Stats Operacionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-slate-600">Total Expedientes</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalExpedientes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm text-slate-600">En Proceso</p>
              <p className="text-2xl font-bold text-slate-900">{stats.enProceso}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-slate-600">Urgentes</p>
              <p className="text-2xl font-bold text-slate-900">{stats.urgentes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center">
            <CalendarDaysIcon className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-slate-600">Por Vencer (7 días)</p>
              <p className="text-2xl font-bold text-slate-900">{stats.proximos_vencer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;