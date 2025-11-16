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
    secure: false, // Porta 2525 NUNCA usa secure = true
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
} else {
  console.warn("Mailer: SMTP não configurado — emails não serão enviados.");
}

async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.warn("Mailer não configurado — logando email.");
    console.log({ to, subject, html, text });
    return { simulated: true };
  }

  const info = await transporter.sendMail({
    from: FROM_EMAIL || SMTP_USER,
    to,
    subject,
    html,
    text
  });

  return info;
}

module.exports = { sendMail };
