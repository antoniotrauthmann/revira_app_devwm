-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Tempo de geração: 14/09/2026 às 16:17
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `marketplace`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `anuncio`
--

CREATE TABLE `anuncio` (
  `id_anuncio` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_material` int(11) NOT NULL,
  `anuncio_titulo` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `quantidade` decimal(10,2) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `status` enum('ativo','vendido','removido') NOT NULL DEFAULT 'ativo',
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `assinatura`
--

CREATE TABLE `assinatura` (
  `id_assinatura` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_plano` int(11) NOT NULL,
  `inicio` date NOT NULL DEFAULT current_timestamp(),
  `fim` date DEFAULT NULL,
  `status` enum('ativa','cancelada','expirada') NOT NULL DEFAULT 'ativa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacao`
--

CREATE TABLE `avaliacao` (
  `id_avaliacao` int(11) NOT NULL,
  `id_transacao` int(11) NOT NULL,
  `id_avaliador` int(11) NOT NULL,
  `id_avaliado` int(11) NOT NULL,
  `nota` tinyint(1) NOT NULL,
  `comentario` text DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `coleta`
--

CREATE TABLE `coleta` (
  `id_coleta` int(11) NOT NULL,
  `id_transacao` int(11) NOT NULL,
  `id_endereco` int(11) DEFAULT NULL,
  `data_coleta` datetime DEFAULT NULL,
  `status` enum('agendada','em_andamento','concluida','cancelada') NOT NULL DEFAULT 'agendada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `endereco`
--

CREATE TABLE `endereco` (
  `id_endereco` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `logradouro` varchar(200) DEFAULT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` char(2) NOT NULL,
  `cep` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `imagens_anuncio`
--

CREATE TABLE `imagens_anuncio` (
  `id_imagem` int(11) NOT NULL,
  `id_anuncio` int(11) NOT NULL,
  `anuncio_caminho_imagem` varchar(255) NOT NULL,
  `ordem` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `material`
--

CREATE TABLE `material` (
  `id_material` int(11) NOT NULL,
  `material_nome` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `unidade_medida` varchar(10) NOT NULL DEFAULT 'kg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensagem`
--

CREATE TABLE `mensagem` (
  `id_mensagem` int(11) NOT NULL,
  `id_anuncio` int(11) DEFAULT NULL,
  `id_remetente` int(11) NOT NULL,
  `id_destinatario` int(11) NOT NULL,
  `conteudo` text NOT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT 0,
  `enviado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `url_imagem` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `mensagem`
--

INSERT INTO `mensagem` (`id_mensagem`, `id_anuncio`, `id_remetente`, `id_destinatario`, `conteudo`, `lida`, `enviado_em`, `url_imagem`) VALUES
(1, NULL, 1, 2, 'sdada', 0, '2026-09-13 18:27:18', NULL),
(2, NULL, 1, 2, 'dsada', 0, '2026-09-13 18:27:19', NULL),
(3, NULL, 1, 2, 'dasda', 0, '2026-09-13 18:27:27', NULL),
(4, NULL, 1, 2, 'da', 0, '2026-09-13 18:43:00', NULL),
(5, NULL, 1, 2, '', 0, '2026-09-13 18:43:35', 'blob:http://localhost:5173/7e3e0f62-d51b-4773-8992-38677065c9ce'),
(6, NULL, 1, 2, 'da', 0, '2026-09-14 10:21:37', NULL),
(7, NULL, 1, 2, 'teste eu ', 0, '2026-09-14 10:21:52', NULL),
(8, NULL, 1, 2, '', 0, '2026-09-14 10:22:01', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAGoAdoDASIAAhEB'),
(9, NULL, 1, 2, 'caixa kkk\n', 0, '2026-09-14 10:27:42', NULL),
(10, NULL, 1, 2, '', 0, '2026-09-14 10:27:54', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAGoAdoDASIAAhEB'),
(11, NULL, 1, 2, 'sadada', 0, '2026-09-14 10:29:39', NULL),
(12, NULL, 1, 2, 'dadasda', 0, '2026-09-14 10:41:31', NULL),
(13, NULL, 1, 2, 'sdaa', 0, '2026-09-14 10:41:33', NULL),
(14, NULL, 1, 2, 'sdasda', 0, '2026-09-14 10:46:01', NULL),
(15, NULL, 1, 2, 'asdddddddadddddddddddddddddddddddddddddddddddddddddddddd', 0, '2026-09-14 10:46:07', NULL),
(16, NULL, 1, 2, '', 0, '2026-09-14 10:46:12', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAGoAdoDASIAAhEB');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamento`
--

CREATE TABLE `pagamento` (
  `id_pagamento` int(11) NOT NULL,
  `id_transacao` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `metodo` varchar(30) NOT NULL,
  `status` enum('pendente','aprovado','recusado','estornado') NOT NULL DEFAULT 'pendente',
  `pago_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `plano`
--

CREATE TABLE `plano` (
  `id_plano` int(11) NOT NULL,
  `plano_nome` varchar(100) NOT NULL,
  `tipo` enum('empresa','fornecedor') NOT NULL,
  `valor_mensal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `transacao`
--

CREATE TABLE `transacao` (
  `id_transacao` int(11) NOT NULL,
  `id_anuncio` int(11) NOT NULL,
  `id_comprador` int(11) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `comissao` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pendente','confirmada','em_transporte','concluida','cancelada') NOT NULL DEFAULT 'pendente',
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `usuario_nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `tipo` enum('catador','cooperativa','industria','empresa','consumidor','admin') NOT NULL,
  `cpf_cnpj` varchar(20) DEFAULT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `usuario_nome`, `email`, `senha_hash`, `tipo`, `cpf_cnpj`, `data_cadastro`) VALUES
(1, 'Hiago', 'pudhhdhdy@gmail.com', '123', '', NULL, '2026-09-13 18:12:57'),
(2, 'Fornecedor', 'fornecedor@gmail.com', '1234', '', NULL, '2026-09-13 18:12:57');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `anuncio`
--
ALTER TABLE `anuncio`
  ADD PRIMARY KEY (`id_anuncio`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_material` (`id_material`);

--
-- Índices de tabela `assinatura`
--
ALTER TABLE `assinatura`
  ADD PRIMARY KEY (`id_assinatura`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_plano` (`id_plano`);

--
-- Índices de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD PRIMARY KEY (`id_avaliacao`),
  ADD UNIQUE KEY `uk_transacao_avaliador` (`id_transacao`,`id_avaliador`),
  ADD KEY `id_avaliado` (`id_avaliado`),
  ADD KEY `avaliacao_avaliador_fk` (`id_avaliador`);

--
-- Índices de tabela `coleta`
--
ALTER TABLE `coleta`
  ADD PRIMARY KEY (`id_coleta`),
  ADD UNIQUE KEY `id_transacao` (`id_transacao`),
  ADD KEY `id_endereco` (`id_endereco`);

--
-- Índices de tabela `endereco`
--
ALTER TABLE `endereco`
  ADD PRIMARY KEY (`id_endereco`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `imagens_anuncio`
--
ALTER TABLE `imagens_anuncio`
  ADD PRIMARY KEY (`id_imagem`),
  ADD KEY `idx_anuncio_imagem` (`id_anuncio`);

--
-- Índices de tabela `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`id_material`);

--
-- Índices de tabela `mensagem`
--
ALTER TABLE `mensagem`
  ADD PRIMARY KEY (`id_mensagem`),
  ADD KEY `id_anuncio` (`id_anuncio`),
  ADD KEY `id_remetente` (`id_remetente`),
  ADD KEY `id_destinatario` (`id_destinatario`);

--
-- Índices de tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`id_pagamento`),
  ADD UNIQUE KEY `id_transacao` (`id_transacao`);

--
-- Índices de tabela `plano`
--
ALTER TABLE `plano`
  ADD PRIMARY KEY (`id_plano`);

--
-- Índices de tabela `transacao`
--
ALTER TABLE `transacao`
  ADD PRIMARY KEY (`id_transacao`),
  ADD KEY `id_anuncio` (`id_anuncio`),
  ADD KEY `id_comprador` (`id_comprador`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf_cnpj` (`cpf_cnpj`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `anuncio`
--
ALTER TABLE `anuncio`
  MODIFY `id_anuncio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `assinatura`
--
ALTER TABLE `assinatura`
  MODIFY `id_assinatura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  MODIFY `id_avaliacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `coleta`
--
ALTER TABLE `coleta`
  MODIFY `id_coleta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `endereco`
--
ALTER TABLE `endereco`
  MODIFY `id_endereco` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `imagens_anuncio`
--
ALTER TABLE `imagens_anuncio`
  MODIFY `id_imagem` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `material`
--
ALTER TABLE `material`
  MODIFY `id_material` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `mensagem`
--
ALTER TABLE `mensagem`
  MODIFY `id_mensagem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `id_pagamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `plano`
--
ALTER TABLE `plano`
  MODIFY `id_plano` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `transacao`
--
ALTER TABLE `transacao`
  MODIFY `id_transacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `anuncio`
--
ALTER TABLE `anuncio`
  ADD CONSTRAINT `anuncio_material_fk` FOREIGN KEY (`id_material`) REFERENCES `material` (`id_material`),
  ADD CONSTRAINT `anuncio_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `assinatura`
--
ALTER TABLE `assinatura`
  ADD CONSTRAINT `assinatura_plano_fk` FOREIGN KEY (`id_plano`) REFERENCES `plano` (`id_plano`),
  ADD CONSTRAINT `assinatura_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `avaliacao_avaliado_fk` FOREIGN KEY (`id_avaliado`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `avaliacao_avaliador_fk` FOREIGN KEY (`id_avaliador`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `avaliacao_transacao_fk` FOREIGN KEY (`id_transacao`) REFERENCES `transacao` (`id_transacao`) ON DELETE CASCADE;

--
-- Restrições para tabelas `coleta`
--
ALTER TABLE `coleta`
  ADD CONSTRAINT `coleta_endereco_fk` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id_endereco`),
  ADD CONSTRAINT `coleta_transacao_fk` FOREIGN KEY (`id_transacao`) REFERENCES `transacao` (`id_transacao`) ON DELETE CASCADE;

--
-- Restrições para tabelas `endereco`
--
ALTER TABLE `endereco`
  ADD CONSTRAINT `endereco_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `imagens_anuncio`
--
ALTER TABLE `imagens_anuncio`
  ADD CONSTRAINT `imagem_anuncio_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio` (`id_anuncio`) ON DELETE CASCADE;

--
-- Restrições para tabelas `mensagem`
--
ALTER TABLE `mensagem`
  ADD CONSTRAINT `mensagem_anuncio_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio` (`id_anuncio`) ON DELETE SET NULL,
  ADD CONSTRAINT `mensagem_destinatario_fk` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `mensagem_remetente_fk` FOREIGN KEY (`id_remetente`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `pagamento_transacao_fk` FOREIGN KEY (`id_transacao`) REFERENCES `transacao` (`id_transacao`) ON DELETE CASCADE;

--
-- Restrições para tabelas `transacao`
--
ALTER TABLE `transacao`
  ADD CONSTRAINT `transacao_anuncio_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio` (`id_anuncio`),
  ADD CONSTRAINT `transacao_comprador_fk` FOREIGN KEY (`id_comprador`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
