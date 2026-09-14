const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MySQL do XAMPP
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Usuário padrão do XAMPP
  password: '',      // Senha padrão (vazia)
  database: 'marketplace'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL do XAMPP!');
});

// 1. Rota GET: Permite visualizar os usuários no navegador (http://localhost:3000/usuario)
app.get('/usuario', (req, res) => {
  db.query('SELECT id_usuario, usuario_nome, email, tipo FROM usuario', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Rota POST: Utilizada pela tela de Login do aplicativo React Native
app.post('/usuario', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  // Verifica se existe o usuário com o email e a senha digitados
  const query = 'SELECT id_usuario, usuario_nome, email, tipo FROM usuario WHERE email = ? AND senha_hash = ?';

  db.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }

    if (results.length > 0) {
      // Usuário e senha corretos
      const usuario = results[0];
      return res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        usuario: usuario
      });
    } else {
      // Usuário ou senha incorretos
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3000');
});