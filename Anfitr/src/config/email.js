const nodemailer = require('nodemailer');

// Configurar el transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Función para enviar correo de confirmación de reserva
const enviarCorreoConfirmacion = async (destinatario, datosReserva) => {
  const { titulo, ubicacion, meses, total, fechaInicio, fechaFin, nombreUsuario } = datosReserva;

  const mailOptions = {
    from: `"Anfitr" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: 'Confirmación de Reserva - Anfitr',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #152C5B; color: white; padding: 20px; text-align: center; }
          .header h1 { margin: 0; }
          .header .brand { color: #3252DF; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .info-box { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #1ABC9C; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #152C5B; }
          .total { font-size: 24px; color: #1ABC9C; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .check-icon { color: #1ABC9C; font-size: 48px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Anfi<span class="brand">tr</span></h1>
          </div>
          
          <div class="content">
            <div class="check-icon">✓</div>
            <h2 style="text-align: center; color: #152C5B;">¡Pago Completado!</h2>
            <p style="text-align: center;">Hola ${nombreUsuario || 'estimado cliente'},</p>
            <p style="text-align: center;">Tu reserva ha sido confirmada exitosamente.</p>
            
            <div class="info-box">
              <h3 style="color: #152C5B; margin-top: 0;">Detalles de tu Reserva</h3>
              
              <div class="info-row">
                <span class="label">Propiedad:</span> ${titulo}
              </div>
              
              <div class="info-row">
                <span class="label">Ubicación:</span> ${ubicacion}
              </div>
              
              <div class="info-row">
                <span class="label">Periodo:</span> ${meses} ${meses === 1 ? 'mes' : 'meses'}
              </div>
              
              <div class="info-row">
                <span class="label">Fecha de inicio:</span> ${fechaInicio}
              </div>
              
              <div class="info-row">
                <span class="label">Fecha de fin:</span> ${fechaFin}
              </div>
              
              <div class="info-row" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
                <span class="label">Total pagado:</span> <span class="total">$${total} MXN</span>
              </div>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px;">
              Recibirás más información sobre tu reserva próximamente.
            </p>
          </div>
          
          <div class="footer">
            <p>Este correo fue enviado desde Anfitr</p>
            <p>Por favor no responder a este correo</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  enviarCorreoConfirmacion
};
