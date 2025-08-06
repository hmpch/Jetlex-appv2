// frontend/src/pages/Profile.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Alert from '../components/Common/Alert';
import { UserIcon, MailIcon, KeyIcon, CalendarIcon } from '@heroicons/react/outline';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
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
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data.user);
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
      setEditMode(false);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al actualizar el perfil' 
      });
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

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Contraseña actualizada exitosamente' });
      setPasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al cambiar la contraseña' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

      {message.text && (
        <Alert 
          type={message.type} 
          message={message.text} 
          onClose={() => setMessage({ type: '', text: '' })}
          className="mb-6"
        />
      )}

      {/* Información Personal */}
      <Card className="mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
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
        </div>

        <div className="p-6">
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="form-label flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
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
                <label className="form-label flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
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

              <div className="flex gap-3 pt-4">
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
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Nombre
                </p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <p className="font-medium text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.role}
                  </span>
                </p>
              </div>

              {user?.phone && (
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Seguridad */}
      <Card className="mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
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
        </div>

        <div className="p-6">
          {passwordMode ? (
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
                <p className="text-xs text-gray-500 mt-1">
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

              <div className="flex gap-3 pt-4">
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
          ) : (
            <div className="text-sm text-gray-600">
              <p>Última actualización: {new Date(user?.updatedAt || Date.now()).toLocaleDateString()}</p>
              <p className="mt-2">
                Se recomienda cambiar la contraseña periódicamente para mantener tu cuenta segura.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Información de la cuenta */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Información de la cuenta</h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Fecha de registro
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user?.createdAt || Date.now()).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Último acceso</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user?.lastLogin || Date.now()).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado de la cuenta</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activa
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ID de usuario</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {user?.id}
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  );
};

export default Profile;