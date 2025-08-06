// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Loading from '../components/Common/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get('/expedientes/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-slate-600">Panel de control Jetlex Aviation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {stats?.totalExpedientes || 0}
            </p>
            <p className="text-slate-600">Total Expedientes</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {stats?.enProceso || 0}
            </p>
            <p className="text-slate-600">En Proceso</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {stats?.urgentes || 0}
            </p>
            <p className="text-slate-600">Urgentes</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {stats?.proximos_vencer || 0}
            </p>
            <p className="text-slate-600">Por Vencer</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;