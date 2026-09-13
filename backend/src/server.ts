import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3307,
  password: '',
  database: 'marketplace', 
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/anuncios', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM anuncio');
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar anúncios no MariaDB' });
  }
});

app.get('/mensagens', async (req, res) => {
  try {
    const [linhas] = await pool.query('SELECT * FROM mensagem ORDER BY enviado_em ASC');
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar mensagens' });
  }
});

app.post('/mensagens', async (req, res) => {
  try {
    // 1. Extraindo a url_imagem que vem do React
    const { conteudo, id_remetente, id_destinatario, url_imagem } = req.body;
    
    // 2. Inserindo na nova coluna que você criou no XAMPP
    await pool.query(
      'INSERT INTO mensagem (conteudo, id_remetente, id_destinatario, url_imagem) VALUES (?, ?, ?, ?)',
      [conteudo, id_remetente, id_destinatario, url_imagem]
    );
    res.status(201).json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao salvar mensagem' });
  }
});

app.get('/', (req, res) => {
  res.json({ mensagem: 'Conexão com o backend estabelecida com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});