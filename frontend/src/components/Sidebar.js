import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  UserIcon,
  ShieldCheckIcon,
  ScaleIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ open, setOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Expedientes', href: '/expedientes', icon: DocumentTextIcon },
    { name: 'Clientes', href: '/clientes', icon: UsersIcon },
    // { name: 'Calendario', href: '/calendar', icon: CalendarDaysIcon }, // Descomentar cuando la página exista
    { name: 'Perfil', href: '/profile', icon: UserIcon },
  ];

  const adminNavigation = [
    { name: 'Monitoreo', href: '/monitoreo', icon: ShieldCheckIcon },
    { name: 'OSINT', href: '/osint', icon: AcademicCapIcon },
    { name: 'Decisiones', href: '/decisiones', icon: ScaleIcon },
    // { name: 'Newsletter', href: '/newsletter', icon: NewspaperIcon }, // Descomentar cuando la página exista
  ];

  const navigation = [
    ...baseNavigation,
    ...(user && ['admin', 'colaboradorA'].includes(user.role) ? adminNavigation : [])
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 bg-slate-900 transition-all duration-300
        ${open ? 'w-64' : 'w-16'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">✈</span>
            </div>
            {open && (
              <span className="text-white font-bold text-xl">Jetlex</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-3 mb-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {open && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;