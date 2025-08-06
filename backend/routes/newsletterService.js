const nodemailer = require('nodemailer');
const cron = require('node-cron');
const MonitoreoEstrategico = require('../models/MonitoreoEstrategico');
const Research = require('../models/Research');
const Newsletter = require('../models/Newsletter');
const Subscriber = require('../models/Subscriber');

class NewsletterService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async generateNewsletter() {
    try {
      // Obtener contenido de la última semana
      const fechaInicio = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const [alertas, research] = await Promise.all([
        MonitoreoEstrategico.findAll({
          where: {
            fechaDeteccion: { [Op.gte]: fechaInicio },
            prioridad: { [Op.in]: ['amarillo', 'rojo'] }
          },
          order: [['prioridad', 'DESC'], ['fechaDeteccion', 'DESC']],
          limit: 5
        }),
        Research.findAll({
          where: {
            estado: 'publicado',
            createdAt: { [Op.gte]: fechaInicio }
          },
          order: [['createdAt', 'DESC']],
          limit: 3
        })
      ]);

      const contenido = this.generarHTML(alertas, research);
      
      const newsletter = await Newsletter.create({
        titulo: `ANAC Intelligence - Semana ${new Date().toLocaleDateString()}`,
        contenido,
        estado: 'borrador'
      });

      return newsletter;

    } catch (error) {
      console.error('Error generando newsletter:', error);
      throw error;
    }
  }

  generarHTML(alertas, research) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #0f172a; color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
    .alert.red { background: #fee2e2; border-color: #dc2626; }
    .research { background: #e0e7ff; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .footer { background: #1e293b; color: white; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ ANAC Intelligence</h1>
      <p>Newsletter Semanal de Inteligencia Aeronáutica</p>
    </div>
    
    <div class="content">
      <h2>🚨 Alertas Regulatorias</h2>
      ${alertas.map(alerta => `
        <div class="alert ${alerta.prioridad === 'rojo' ? 'red' : ''}">
          <h3>${alerta.titulo}</h3>
          <p>${alerta.contenido}</p>
          <small>Fuente: ${alerta.fuente} | ${new Date(alerta.fechaDeteccion).toLocaleDateString()}</small>
        </div>
      `).join('')}
      
      <h2>🔬 Research & Análisis</h2>
      ${research.map(item => `
        <div class="research">
          <h3>${item.titulo}</h3>
          <p>${item.contenido.substring(0, 200)}...</p>
          <a href="${process.env.FRONTEND_URL}/research/${item.id}">Leer más →</a>
        </div>
      `).join('')}
      
      <h2>💡 Tip de la Semana</h2>
      <p>Las certificaciones CESA ahora requieren demostración de capacidad financiera actualizada trimestralmente.</p>
    </div>
    
    <div class="footer">
      <p>© 2025 Jetlex Aviation Intelligence</p>
      <p>Por Martín - Ex Director Nacional ANAC</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  async enviarNewsletter(newsletterId) {
    try {
      const newsletter = await Newsletter.findByPk(newsletterId);
      const subscribers = await Subscriber.findAll({
        where: { activo: true }
      });

      for (const subscriber of subscribers) {
        await this.transporter.sendMail({
          from: '"Jetlex Intelligence" <intelligence@jetlex.com>',
          to: subscriber.email,
          subject: newsletter.titulo,
          html: newsletter.contenido
        });
      }

      await newsletter.update({
        estado: 'enviado',
        fechaEnvio: new Date(),
        cantidadEnviados: subscribers.length
      });

    } catch (error) {
      console.error('Error enviando newsletter:', error);
      throw error;
    }
  }
}

// Programar envío semanal
cron.schedule('0 9 * * 1', async () => {
  const service = new NewsletterService();
  
  try {
    const newsletter = await service.generateNewsletter();
    await service.enviarNewsletter(newsletter.id);
    console.log('Newsletter semanal enviado exitosamente');
  } catch (error) {
    console.error('Error en envío de newsletter:', error);
  }
});

module.exports = NewsletterService;