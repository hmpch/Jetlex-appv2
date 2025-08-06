import React from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      containerClass: 'bg-green-50 border-green-200',
      iconClass: 'text-green-600',
      titleClass: 'text-green-800',
      messageClass: 'text-green-700',
      icon: CheckCircleIcon
    },
    error: {
      containerClass: 'bg-red-50 border-red-200',
      iconClass: 'text-red-600',
      titleClass: 'text-red-800',
      messageClass: 'text-red-700',
      icon: XCircleIcon
    },
    warning: {
      containerClass: 'bg-yellow-50 border-yellow-200',
      iconClass: 'text-yellow-600',
      titleClass: 'text-yellow-800',
      messageClass: 'text-yellow-700',
      icon: ExclamationTriangleIcon
    },
    info: {
      containerClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-600',
      titleClass: 'text-blue-800',
      messageClass: 'text-blue-700',
      icon: InformationCircleIcon
    }
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`border rounded-lg p-4 ${config.containerClass} ${className}`}>
      <div className="flex">
        <Icon className={`w-5 h-5 ${config.iconClass} flex-shrink-0`} />
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleClass}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`text-sm ${title ? 'mt-1' : ''} ${config.messageClass}`}>
              {message}
            </div>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 flex-shrink-0 rounded-md p-1.5 hover:bg-white hover:bg-opacity-75 ${config.iconClass}`}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
