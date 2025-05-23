// functions/sendEmail.js
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  // Vérifie que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Configuration pour Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD // Utilise un mot de passe d'application
      }
    });

    // Configuration de l'email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'florian.fchr99@gmail.com',
      subject: `Message de ${data.name} via ton portfolio`,
      text: `
        Nom: ${data.name}
        Email: ${data.email}
        
        Message:
        ${data.message}
      `,
      replyTo: data.email
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email envoyé avec succès!' })
    };
  } catch (error) {
    console.error("Erreur:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors de l'envoi de l'email" })
    };
  }
};