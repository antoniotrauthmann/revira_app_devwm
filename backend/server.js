const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const crypto = require('crypto'); //já vem instalado
const bcrypt = require('bcrypt'); //criptografar senhas para gerar senha_hash
const { enviarCodigoRecuperacao } = require('./email');

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

  const query = 'SELECT id_usuario, usuario_nome, email, tipo, senha_hash FROM usuario WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    const usuario = results[0];

    try {
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
      }

      // Remove o hash antes de devolver o usuário pro front
      delete usuario.senha_hash;

      return res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        usuario
      });
    } catch (compareError) {
      console.error('Erro ao comparar senha:', compareError);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  });
});

app.get('/usuario/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id_usuario, usuario_nome, email, tipo, cpf_cnpj, data_cadastro FROM usuario WHERE id_usuario = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    res.json(results[0]);
  });
});

// --- ROTAS DE ENDEREÇO ---

// Listar endereços de um usuário
app.get('/endereco/usuario/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const query = 'SELECT id_endereco, id_usuario, logradouro, cidade, estado, cep FROM endereco WHERE id_usuario = ? ORDER BY id_endereco DESC';
  
  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar endereços:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
    res.json(results);
  });
});

// Cadastrar novo endereço
app.post('/endereco', (req, res) => {
  const { id_usuario, logradouro, cidade, estado, cep } = req.body;

  if (!id_usuario || !cidade || !estado) {
    return res.status(400).json({ mensagem: 'Usuário, cidade e estado são obrigatórios.' });
  }

  const query = 'INSERT INTO endereco (id_usuario, logradouro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [id_usuario, logradouro || null, cidade.trim(), estado.trim().toUpperCase(), cep || null], (err, results) => {
    if (err) {
      console.error('Erro ao cadastrar endereço:', err);
      return res.status(500).json({ mensagem: 'Erro interno ao salvar endereço.' });
    }
    res.status(201).json({ mensagem: 'Endereço cadastrado com sucesso!', id_endereco: results.insertId });
  });
});

// Deletar endereço
app.delete('/endereco/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM endereco WHERE id_endereco = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar endereço:', err);
      return res.status(500).json({ mensagem: 'Erro interno ao excluir endereço.' });
    }
    res.json({ mensagem: 'Endereço removido com sucesso!' });
  });
});

// --- ROTAS DE MENSAGENS (CHAT) ---

app.get('/mensagens', (req, res) => {
  const query = 'SELECT id_mensagem, id_remetente, id_destinatario, conteudo, lida, enviado_em, url_imagem FROM mensagem ORDER BY enviado_em ASC';
  
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

app.post('/usuario/cadastro', async (req, res) => {
  const { usuario_nome, email, senha, tipo } = req.body;

  if (!usuario_nome || !email || !senha || !tipo) {
    return res.status(400).json({ mensagem: 'Nome, e-mail, senha e tipo são obrigatórios.' });
  }

  const checkQuery = 'SELECT id_usuario FROM usuario WHERE email = ?';
  db.query(checkQuery, [email], async (err, results) => {
    if (err) {
      console.error('Erro ao verificar e-mail:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }

    try {
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

      const insertQuery = 'INSERT INTO usuario (usuario_nome, email, senha_hash, tipo) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [usuario_nome, email, senhaHash, tipo], (err, results) => {
        if (err) {
          console.error('Erro ao cadastrar usuário:', err);
          return res.status(500).json({ mensagem: 'Erro interno ao cadastrar usuário.' });
        }

        res.status(201).json({
          mensagem: 'Cadastro realizado com sucesso!',
          id_usuario: results.insertId
        });
      });
    } catch (hashError) {
      console.error('Erro ao gerar hash da senha:', hashError);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  });
});


// --- ROTAS DE RECUPERAÇÃO DE SENHA ---
 
function gerarCodigo() {
  // código numérico de 6 dígitos, sempre com 6 caracteres (ex: "042817")
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}
 
// 1) Usuário informa o e-mail -> geramos e enviamos o código
app.post('/usuario/esqueci_senha', (req, res) => {
  const { email } = req.body;
 
  if (!email) {
    return res.status(400).json({ mensagem: 'E-mail é obrigatório.' });
  }
 
  const buscaUsuario = 'SELECT id_usuario FROM usuario WHERE email = ?';
  db.query(buscaUsuario, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
 
    // Por segurança, a resposta é a mesma se o e-mail existir ou não,
    // assim não dá pra descobrir quais e-mails estão cadastrados.
    if (results.length === 0) {
      return res.status(200).json({ mensagem: 'Se o e-mail existir, um código foi enviado.' });
    }
 
    const idUsuario = results[0].id_usuario;
    const codigo = gerarCodigo();
    const expiraEm = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
 
    const insertQuery = 'INSERT INTO codigo_recuperacao (id_usuario, codigo, expira_em) VALUES (?, ?, ?)';
    db.query(insertQuery, [idUsuario, codigo, expiraEm], async (err) => {
      if (err) {
        console.error('Erro ao salvar código de recuperação:', err);
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
      }
 
      try {
        await enviarCodigoRecuperacao(email, codigo);
        return res.status(200).json({ mensagem: 'Se o e-mail existir, um código foi enviado.' });
      } catch (emailError) {
        console.error('Erro ao enviar e-mail:', emailError);
        return res.status(500).json({ mensagem: 'Erro ao enviar e-mail de recuperação.' });
      }
    });
  });
});
 
// 2) Usuário digita o código -> validamos antes de deixar ele trocar a senha
app.post('/usuario/verificar_codigo', (req, res) => {
  const { email, codigo } = req.body;
 
  if (!email || !codigo) {
    return res.status(400).json({ mensagem: 'E-mail e código são obrigatórios.' });
  }
 
  const query = `
    SELECT cr.id_codigo, cr.expira_em, cr.usado
    FROM codigo_recuperacao cr
    JOIN usuario u ON u.id_usuario = cr.id_usuario
    WHERE u.email = ? AND cr.codigo = ?
    ORDER BY cr.id_codigo DESC
    LIMIT 1
  `;
 
  db.query(query, [email, codigo], (err, results) => {
    if (err) {
      console.error('Erro ao verificar código:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
 
    if (results.length === 0) {
      return res.status(400).json({ mensagem: 'Código inválido.' });
    }
 
    const registro = results[0];
 
    if (registro.usado) {
      return res.status(400).json({ mensagem: 'Este código já foi utilizado.' });
    }
 
    if (new Date(registro.expira_em) < new Date()) {
      return res.status(400).json({ mensagem: 'Este código expirou. Solicite um novo.' });
    }
 
    return res.status(200).json({ mensagem: 'Código válido.' });
  });
});
 
// 3) Usuário define a nova senha
app.post('/usuario/redefinir_senha', async (req, res) => {
  const { email, codigo, novaSenha } = req.body;
 
  if (!email || !codigo || !novaSenha) {
    return res.status(400).json({ mensagem: 'E-mail, código e nova senha são obrigatórios.' });
  }
 
  if (novaSenha.length < 6) {
    return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 6 caracteres.' });
  }
 
  const query = `
    SELECT cr.id_codigo, cr.expira_em, cr.usado, u.id_usuario
    FROM codigo_recuperacao cr
    JOIN usuario u ON u.id_usuario = cr.id_usuario
    WHERE u.email = ? AND cr.codigo = ?
    ORDER BY cr.id_codigo DESC
    LIMIT 1
  `;
 
  db.query(query, [email, codigo], async (err, results) => {
    if (err) {
      console.error('Erro ao verificar código:', err);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
 
    if (results.length === 0) {
      return res.status(400).json({ mensagem: 'Código inválido.' });
    }
 
    const registro = results[0];
 
    if (registro.usado) {
      return res.status(400).json({ mensagem: 'Este código já foi utilizado.' });
    }
 
    if (new Date(registro.expira_em) < new Date()) {
      return res.status(400).json({ mensagem: 'Este código expirou. Solicite um novo.' });
    }
 
    try {
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(novaSenha, saltRounds);
 
      const updateQuery = 'UPDATE usuario SET senha_hash = ? WHERE id_usuario = ?';
      db.query(updateQuery, [senhaHash, registro.id_usuario], (err) => {
        if (err) {
          console.error('Erro ao atualizar senha:', err);
          return res.status(500).json({ mensagem: 'Erro interno ao atualizar senha.' });
        }
 
        // marca o código como usado, pra não poder ser reaproveitado
        const marcaUsado = 'UPDATE codigo_recuperacao SET usado = 1 WHERE id_codigo = ?';
        db.query(marcaUsado, [registro.id_codigo], (err) => {
          if (err) console.error('Erro ao marcar código como usado:', err);
        });
 
        return res.status(200).json({ mensagem: 'Senha redefinida com sucesso!' });
      });
    } catch (hashError) {
      console.error('Erro ao gerar hash da senha:', hashError);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  });
});


app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3000');
});

app.post('/avaliacoes', (req, res) => {
  // Recebendo o id_transacao do front
  const { id_transacao, id_avaliador, id_avaliado, nota, comentario } = req.body;

  // Inserindo na tabela avaliacao com todos os campos obrigatórios
  const query = 'INSERT INTO avaliacao (id_transacao, id_avaliador, id_avaliado, nota, comentario) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [id_transacao, id_avaliador, id_avaliado, nota, comentario], (err, results) => {
    if (err) {
      console.error('Erro ao salvar avaliação:', err);
      return res.status(500).json({ mensagem: 'Erro ao processar avaliação.' });
    }
    res.status(201).json({ mensagem: 'Avaliação salva com sucesso!' });
  });
});