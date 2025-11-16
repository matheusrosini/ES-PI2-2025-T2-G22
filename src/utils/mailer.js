const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail({ to, subject, html, text }) {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL, 
      to,
      subject,
      html,
      text
    });

    console.log("Email enviado:", data);
    return data;
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    throw err;
  }
}

module.exports = { sendMail };
