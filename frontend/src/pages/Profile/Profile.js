// frontend/src/pages/Profile.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';
import api from '../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    notifications: user?.notifications ?? true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data.user);
      setEditMode(false);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al cambiar contraseña' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-600">Gestiona tu información personal y configuración</p>
      </div>

      {message.text && (
        <Alert 
          type={message.type} 
          message={message.text} 
          onClose={() => setMessage({ type: '', text: '' })}
        />
      )}

      {/* Información Personal */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Información Personal</h2>
          {!editMode && !passwordMode && (
            <Button onClick={() => setEditMode(true)} variant="secondary">
              Editar
            </Button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

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
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-600"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                />
                <span className="text-sm">Recibir notificaciones por email</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" loading={loading}>
                Guardar Cambios
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    notifications: user?.notifications ?? true
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600">Nombre</label>
              <p className="text-slate-900">{user?.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <p className="text-slate-900">{user?.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Rol</label>
              <p className="text-slate-900 capitalize">{user?.role}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Notificaciones</label>
              <p className="text-slate-900">
                {user?.notifications ? 'Activadas' : 'Desactivadas'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Miembro desde</label>
              <p className="text-slate-900">
                {new Date(user?.createdAt).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Cambiar Contraseña */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Seguridad</h2>
          {!passwordMode && !editMode && (
            <Button onClick={() => setPasswordMode(true)} variant="secondary">
              Cambiar Contraseña
            </Button>
          )}
        </div>

        {passwordMode ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="form-label">Contraseña Actual</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="form-label">Nueva Contraseña</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="form-label">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" loading={loading}>
                Cambiar Contraseña
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPasswordMode(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-slate-600">
            Se recomienda cambiar tu contraseña periódicamente para mantener tu cuenta segura.
          </p>
        )}
      </Card>

      {/* Información de la cuenta */}
      <Card className="bg-slate-50">
        <h2 className="text-lg font-semibold mb-4">Información de la Cuenta</h2>
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">
            <span className="font-medium">Tipo de cuenta:</span> {user?.role === 'admin' ? 'Administrador' : user?.role === 'editor' ? 'Editor' : 'Colaborador'}
          </p>
          <p className="text-slate-600">
            <span className="font-medium">Último acceso:</span> {new Date().toLocaleDateString('es-AR')} a las {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-slate-600">
            <span className="font-medium">Estado:</span> <span className="text-green-600">Activo</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;