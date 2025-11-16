const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL
} = process.env;

let transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false, // Mailtrap NÃO usa SSL na sandbox
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

// Teste automático ao iniciar
transporter.verify((err, success) => {
  if (err) {
    console.error("Erro na conexão SMTP:", err);
  } else {
    console.log("SMTP conectado com sucesso!");
  }
});

async function sendMail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to,
      subject,
      text,
      html
    });

    return info;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}

module.exports = { sendMail };
