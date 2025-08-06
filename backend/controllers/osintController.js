const osintService = require('../services/osintService');

const generateReport = async (req, res) => {
  try {
    const { query, sources = ['openai'] } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query es requerido' });
    }

    const report = await osintService.generateOSINTReport(query, sources);
    
    res.json({
      query,
      timestamp: new Date().toISOString(),
      sources: sources,
      results: report,
      generatedBy: req.user.name
    });

  } catch (error) {
    console.error('Error generando reporte OSINT:', error);
    res.status(500).json({ message: 'Error generando reporte OSINT' });
  }
};

const quickSearch = async (req, res) => {
  try {
    const { query } = req.body;
    
    const report = await osintService.generateOSINTReport(query, ['openai'], { maxTokens: 500 });
    
    res.json(report[0]);

  } catch (error) {
    console.error('Error en búsqueda rápida:', error);
    res.status(500).json({ message: 'Error en búsqueda rápida' });
  }
};

const getHistory = async (req, res) => {
  try {
    // Implementar lógica para obtener historial de búsquedas
    // Por ahora retornamos array vacío
    res.json([]);

  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  generateReport,
  quickSearch,
  getHistory
};