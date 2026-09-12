import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise'; // Importa o driver do MySQL

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configura os dados de acesso ao MariaDB/MySQL local
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'marketplace', // Nome do banco que está dentro do seu .sql
  waitForConnections: true,
  connectionLimit: 10
});

// Rota para buscar os anúncios direto do banco 
app.get('/anuncios', async (req, res) => {
  try {
    // digitar o comando SQL 
    const [linhas] = await pool.query('SELECT * FROM anuncio');
    res.json(linhas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar anúncios no MariaDB' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
