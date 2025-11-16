const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL
} = process.env;

let transporter = null;

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    secure: false,          // obrigatoriamente FALSE para porta 587
    requireTLS: true,       // obriga STARTTLS
    tls: {
      rejectUnauthorized: false   // necessário no Railway
    }
  });
} else {
  console.warn("Mailer: SMTP não configurado — emails não serão enviados.");
}

async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.warn("Mailer não configurado — logando conteúdo do e-mail.");
    console.log("TO:", to);
    console.log("SUBJECT:", subject);
    console.log("TEXT:", text || html);
    return { simulated: true };
  }

  const info = await transporter.sendMail({
    from: FROM_EMAIL || SMTP_USER,
    to,
    subject,
    text,
    html
  });

  return info;
}

module.exports = { sendMail };
