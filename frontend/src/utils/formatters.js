export const formatTramiteType = (tipo) => {
  const tipos = {
    transferencia: 'Transferencia de Dominio',
    matriculacion: 'Matriculación',
    certificacion_empresa: 'Certificación de Empresa',
    importacion: 'Importación',
    renovacion_certificado: 'Renovación de Certificado',
    modificacion_datos: 'Modificación de Datos'
  };
  return tipos[tipo] || tipo;
};

export const formatClienteType = (tipo) => {
  const tipos = {
    persona_fisica: 'Persona Física',
    empresa: 'Empresa',
    aeroclub: 'Aeroclub',
    linea_aerea: 'Línea Aérea'
  };
  return tipos[tipo] || tipo;
};

export const formatAeronaveType = (tipo) => {
  const tipos = {
    avion: 'Avión',
    helicoptero: 'Helicóptero',
    planeador: 'Planeador',
    globo: 'Globo',
    ultraliviano: 'Ultraliviano'
  };
  return tipos[tipo] || tipo;
};

export const formatRole = (role) => {
  const roles = {
    admin: 'Administrador',
    colaboradorA: 'Colaborador A',
    colaboradorB: 'Colaborador B'
  };
  return roles[role] || role;
};

export const formatEstado = (estado) => {
  const estados = {
    borrador: 'Borrador',
    en_proceso: 'En Proceso',
    pendiente_anac: 'Pendiente ANAC',
    completado: 'Completado',
    cancelado: 'Cancelado',
    bloqueado: 'Bloqueado'
  };
  return estados[estado] || estado;
};

export const formatUrgencia = (urgencia) => {
  const urgencias = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    critica: 'Crítica'
  };
  return urgencias[urgencia] || urgencia;
};