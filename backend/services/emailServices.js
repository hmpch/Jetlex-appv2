const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Bienvenido a Jetlex Aviation',
    html: `
      <h1>¡Bienvenido a Jetlex Aviation Intelligence!</h1>
      <p>Hola ${user.name},</p>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      <p>Rol asignado: <strong>${user.role}</strong></p>
      <br>
      <p>Saludos,<br>Equipo Jetlex</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de bienvenida enviado a:', user.email);
  } catch (error) {
    console.error('Error enviando email:', error);
  }
};

const sendNotificationEmail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notificación enviada a:', to);
  } catch (error) {
    console.error('Error enviando notificación:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNotificationEmail
};