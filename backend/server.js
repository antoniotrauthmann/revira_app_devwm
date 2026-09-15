const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());

// Limite expandido para permitir o envio de imagens em Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Conexão com o MySQL do XAMPP
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  port: 3307,
  password: '',      
  database: 'marketplace'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL do XAMPP!');
});

// --- ROTAS DE USUÁRIO ---

app.get('/usuario', (req, res) => {
  db.query('SELECT id_usuario, usuario_nome, email, tipo FROM usuario', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/usuario', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  const query = 'SELECT id_usuario, usuario_nome, email, tipo FROM usuario WHERE email = ? AND senha_hash = ?';
  db.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }

    if (results.length > 0) {
      return res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        usuario: results[0]
      });
    } else {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }
  });
});

// --- ROTAS DE MENSAGENS (CHAT) ---

app.get('/mensagens', (req, res) => {
  const query = 'SELECT id_mensagem, id_remetente, id_destinatario, conteudo, lida, enviada_em, url_imagem FROM mensagem ORDER BY enviada_em ASC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar mensagens:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/mensagens', (req, res) => {
  const { conteudo, id_remetente, id_destinatario, url_imagem } = req.body;

  const query = 'INSERT INTO mensagem (conteudo, id_remetente, id_destinatario, url_imagem) VALUES (?, ?, ?, ?)';
  
  // Se não houver imagem, grava como null no banco
  db.query(query, [conteudo, id_remetente, id_destinatario, url_imagem || null], (err, results) => {
    if (err) {
      console.error('Erro ao salvar mensagem:', err);
      return res.status(500).json({ mensagem: 'Erro interno ao salvar mensagem.' });
    }
    res.status(201).json({ mensagem: 'Mensagem salva com sucesso', id: results.insertId });
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3000');
});