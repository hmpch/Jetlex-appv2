// frontend/src/pages/Profile.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';
import { UserIcon, MailIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/outline';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data.user);
      setSuccess('Perfil actualizado exitosamente');
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Contraseña actualizada exitosamente');
      setPasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Información del Usuario */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Información Personal</h2>
          {!editMode && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => setEditMode(true)}
            >
              Editar
            </Button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="form-label">
                <UserIcon className="inline h-4 w-4 mr-1" />
                Nombre completo
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="form-label">
                <MailIcon className="inline h-4 w-4 mr-1" />
                Email
              </label>
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
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+54 11 1234-5678"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" loading={loading}>
                Guardar cambios
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || ''
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-600">Nombre</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-600">Rol</p>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
            </div>

            {user?.phone && (
              <div>
                <p className="text-sm text-slate-600">Teléfono</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Cambiar Contraseña */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Seguridad</h2>
          {!passwordMode && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => setPasswordMode(true)}
              icon={KeyIcon}
            >
              Cambiar contraseña
            </Button>
          )}
        </div>

        {passwordMode && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="form-label">Contraseña actual</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="form-label">Nueva contraseña</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                minLength={8}
              />
              <p className="text-xs text-slate-500 mt-1">
                Mínimo 8 caracteres
              </p>
            </div>

            <div>
              <label className="form-label">Confirmar nueva contraseña</label>
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
                Actualizar contraseña
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPasswordMode(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Información de la cuenta */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Información de la cuenta</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Fecha de registro</span>
            <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Último acceso</span>
            <span>{new Date(user?.lastLogin || Date.now()).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Estado de la cuenta</span>
            <span className="text-green-600 font-medium">Activa</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;