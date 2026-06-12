require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Rota que recebe o formulário
app.post('/contato', async (req, res) => {
  const { nome, sobrenome, email, telefone, regiao, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
  }

  try {
    await transporter.sendMail({
      from: `"SeConecte" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_DESTINO,
      subject: `Novo contato de ${nome} ${sobrenome}`,
      html: `
        <h2>Novo contato pelo SeConecte</h2>
        <p><strong>Nome:</strong> ${nome} ${sobrenome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Região:</strong> ${regiao}</p>
        <hr>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao enviar email.' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});