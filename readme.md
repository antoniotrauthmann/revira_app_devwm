## Tech Stack (Tecnologias Utilizadas)

* **Frontend:** React, TypeScript, Vite, HTML5, CSS3.
* **Backend:** Node.js, TypeScript, Express (Servidor REST), CORS.
* Node.js na versão 24.20.0, certificar antes de rodar npm install.
* **Banco de Dados:** MariaDB / MySQL (Gerenciado localmente via XAMPP).
* **Driver de Conexão:** `mysql2/promise` (Conexão direta usando SQL).

---

## Estrutura

```text
revira_app_ps/
├── banco/                   <-- O .sql
├── frontend/                <-- Código visual do React + Vite
│   └── src/
│       ├── components/      <-- Botões, inputs e blocos visuais
│       └── pages/           <-- Telas (Cadastro, Login, Home)
└── backend/                 <-- Código do servidor Node.js
    └── src/
        └── server.ts        <-- Arquivo principal e rotas da API
```

---

## Como Rodar o Projeto

Na primeira vez que clona o repositório

### 1. Configurar o Banco de Dados (XAMPP)
1. Abra o **XAMPP Control Panel** e clique em **Start** ao lado de **MySQL**.
2. Clique em **Admin** para abrir o *phpMyAdmin* no seu navegador.
3. Crie um novo banco de dados chamado `marketplace` (ou o nome definido no arquivo).
4. Vá na aba **Importar**, selecione o arquivo `.sql` que está na pasta `/banco` deste projeto e clique em **Executar/Ir**.

### 2. Inicializar o Backend (Node.js)
Abra um terminal exclusivo na pasta `backend` e execute:
```bash
# 1. Entrar na pasta do servidor
cd backend

# 2. Instalar todas as dependências necessárias
npm install

# 3. Ligar o servidor em modo de desenvolvimento (localhost:3000)
npm run dev
```

### 3. Inicializar o Frontend (React)
Abra um **segundo terminal** (mantenha o backend rodando) na pasta `frontend` e execute:
```bash
# 1. Entrar na pasta da interface
cd frontend

# 2. Instalar as dependências visuais
npm install

# 3. Ligar o site no navegador (localhost:5173)
npm run dev
```

---

## Avisos Importantes para o Grupo

1. **Nunca envie a pasta `node_modules`:** O arquivo `.gitignore` já está configurado para barrá-la. Sempre que baixar um código novo do repositório, lembre-se de rodar `npm install` se alguma biblioteca nova tiver sido adicionada.
2. **Conexão com o Banco:** O arquivo `backend/src/server.ts` está configurado para o padrão do XAMPP (usuário `root` e sem senha). Se você alterou a senha do seu XAMPP local, ajuste a linha correspondente no código, mas evite enviar sua senha pessoal para o GitHub.
3. **Desenvolvimento de Telas e Rotas:** O espaço para criar os cadastros (`app.post`) já está marcado no arquivo `server.ts`. No frontend, utilize o comando `fetch('http://localhost:3000/sua-rota')` para enviar e receber dados do servidor.