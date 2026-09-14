# Revira App - Marketplace de Reciclagem

Projeto de aplicativo mobile e web desenvolvido com React Native, Expo Router e Node.js.

---

## Integrantes

* Antonio Andrade Trauthmann
* Gabriel Henrique Coldebella de Souza
* Hiago Freitas Jatoba
* João Igor dos Santos Nascimento
* Samuel Felipe de Sena Estevao

---

## Tecnologias Utilizadas

* **Frontend / Mobile:** React Native, Expo, Expo Router, TypeScript.
* **Backend:** Node.js, Express (API REST), CORS, MySQL2.
* **Banco de Dados:** MySQL / MariaDB (gerenciado via XAMPP).

---

## Estrutura do Projeto

```text
revira_app_ps/
├── backend/
│   ├── banco/
│   │   └── marketplace.sql     <-- Script SQL com a estrutura e dados do banco
│   ├── node_modules/
│   ├── package.json
│   └── server.js               <-- Servidor Express com as rotas REST
└── meu-primeiro-app/           <-- Aplicativo React Native (Expo)
    ├── src/
    │   ├── app/                <-- Telas e rotas do Expo Router
    │   │   ├── _layout.tsx     <-- Layout principal do app
    │   │   ├── index.tsx       <-- Tela de Login
    │   │   ├── home.tsx        <-- Tela Principal
    │   │   ├── profile.tsx     <-- Tela de Perfil do Usuario
    │   │   ├── enderecos.tsx   <-- Tela de Gerenciamento de Enderecos
    │   │   └── chat.tsx        <-- Tela de Mensagens / Chat
    │   └── config/
    │       └── api.ts          <-- Configuracao centralizada da URL da API (Web e Mobile)
    ├── package.json
    └── tsconfig.json
```

---

## Como Rodar o Projeto

### 1. Configurar o Banco de Dados (XAMPP)

1. Abra o **XAMPP Control Panel** e inicie o servico **MySQL** (e **Apache** se for utilizar o phpMyAdmin).
2. Acesse o *phpMyAdmin* no seu navegador (`http://localhost/phpmyadmin`).
3. Crie um novo banco de dados chamado `marketplace`.
4. Importe o arquivo `marketplace.sql` localizado na pasta `backend/banco/`.

### 2. Inicializar o Backend (Node.js)

Em um terminal, acesse a pasta do backend e inicie o servidor:

```bash
# Entrar na pasta do backend
cd backend

# Instalar as dependencias (caso ainda nao tenha instalado)
npm install

# Iniciar o servidor
node server.js
```

O servidor iniciara na porta **3000** e conectara ao MySQL.

### 3. Inicializar o Aplicativo (Expo)

Em um **segundo terminal**, acesse a pasta do aplicativo e inicie o Expo:

```bash
# Entrar na pasta do app
cd meu-primeiro-app

# Instalar as dependencias (caso ainda nao tenha instalado)
npm install

# Iniciar o servidor de desenvolvimento do Expo
npx expo start
```

Após o comando iniciar:
* **No Navegador (Web):** Pressione a tecla `w` no terminal ou acesse `http://localhost:8081`.
* **No Celular (Expo Go):** Abra o aplicativo Expo Go no seu smartphone e escaneie o QR Code exibido no terminal.

---

## Observacoes Importantes

1. **Configuracao da API (api.ts):** O arquivo `src/config/api.ts` detecta automaticamente se o app esta rodando na Web (`http://localhost:3000`) ou em um dispositivo fisico na rede Wi-Fi local.
2. **Versionamento:** Nao envie as pastas `node_modules` para o controle de versao Git. Sempre execute `npm install` ao clonar ou atualizar o repositorio.