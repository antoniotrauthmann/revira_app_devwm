-- phpMyAdmin SQL Dump
-- version 5.2.3-2.fc44
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 14, 2026 at 12:24 AM
-- Server version: 11.8.8-MariaDB
-- PHP Version: 8.5.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `marketplace`
--

-- --------------------------------------------------------

--
-- Table structure for table `anuncio`
--

CREATE TABLE `anuncio` (
  `id_anuncio` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_material` int(11) NOT NULL,
  `id_endereco` int(11) DEFAULT NULL,
  `anuncio_titulo` varchar(150) NOT NULL,
  `descricao` text DEFAULT NULL,
  `quantidade` decimal(10,2) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `condicao` varchar(50) DEFAULT NULL,
  `disponibilidade` enum('imediata','a_combinar') NOT NULL DEFAULT 'imediata',
  `status` enum('ativo','vendido','removido') NOT NULL DEFAULT 'ativo',
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assinatura`
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
-- Table structure for table `avaliacao`
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
-- Table structure for table `coleta`
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
-- Table structure for table `denuncia`
--

CREATE TABLE `denuncia` (
  `id_denuncia` int(11) NOT NULL,
  `id_denunciante` int(11) NOT NULL,
  `id_usuario_denunciado` int(11) DEFAULT NULL,
  `id_anuncio` int(11) DEFAULT NULL,
  `motivo` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `status` enum('aberta','em_analise','resolvida','arquivada') NOT NULL DEFAULT 'aberta',
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `destaque`
--

CREATE TABLE `destaque` (
  `id_destaque` int(11) NOT NULL,
  `id_anuncio` int(11) NOT NULL,
  `data_inicio` datetime NOT NULL,
  `data_fim` datetime NOT NULL,
  `valor_pago` decimal(10,2) NOT NULL,
  `impressoes` int(11) NOT NULL DEFAULT 0,
  `cliques` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `endereco`
--

CREATE TABLE `endereco` (
  `id_endereco` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `logradouro` varchar(200) DEFAULT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` char(2) NOT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `imagens_anuncio`
--

CREATE TABLE `imagens_anuncio` (
  `id_imagem` int(11) NOT NULL,
  `id_anuncio` int(11) NOT NULL,
  `anuncio_caminho_imagem` varchar(255) NOT NULL,
  `ordem` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `material`
--

CREATE TABLE `material` (
  `id_material` int(11) NOT NULL,
  `material_nome` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `unidade_medida` varchar(10) NOT NULL DEFAULT 'kg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mensagem`
--

CREATE TABLE `mensagem` (
  `id_mensagem` int(11) NOT NULL,
  `id_anuncio` int(11) DEFAULT NULL,
  `id_remetente` int(11) NOT NULL,
  `id_destinatario` int(11) NOT NULL,
  `conteudo` text NOT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT 0,
  `enviado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notificacao`
--

CREATE TABLE `notificacao` (
  `id_notificacao` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `conteudo` varchar(255) NOT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT 0,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pagamento`
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
-- Table structure for table `plano`
--

CREATE TABLE `plano` (
  `id_plano` int(11) NOT NULL,
  `plano_nome` varchar(100) NOT NULL,
  `tipo` enum('empresa','fornecedor') NOT NULL,
  `valor_mensal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transacao`
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
-- Table structure for table `usuario`
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
-- Indexes for dumped tables
--

--
-- Indexes for table `anuncio`
--
ALTER TABLE `anuncio`
  ADD PRIMARY KEY (`id_anuncio`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_material` (`id_material`),
  ADD KEY `id_endereco` (`id_endereco`);

--
-- Indexes for table `assinatura`
--
ALTER TABLE `assinatura`
  ADD PRIMARY KEY (`id_assinatura`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_plano` (`id_plano`);

--
-- Indexes for table `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD PRIMARY KEY (`id_avaliacao`),
  ADD UNIQUE KEY `uk_transacao_avaliador` (`id_transacao`,`id_avaliador`),
  ADD KEY `id_avaliado` (`id_avaliado`),
  ADD KEY `avaliacao_avaliador_fk` (`id_avaliador`);

--
-- Indexes for table `coleta`
--
ALTER TABLE `coleta`
  ADD PRIMARY KEY (`id_coleta`),
  ADD UNIQUE KEY `id_transacao` (`id_transacao`),
  ADD KEY `id_endereco` (`id_endereco`);

--
-- Indexes for table `denuncia`
--
ALTER TABLE `denuncia`
  ADD PRIMARY KEY (`id_denuncia`),
  ADD KEY `id_denunciante` (`id_denunciante`),
  ADD KEY `id_usuario_denunciado` (`id_usuario_denunciado`),
  ADD KEY `id_anuncio` (`id_anuncio`);

--
-- Indexes for table `destaque`
--
ALTER TABLE `destaque`
  ADD PRIMARY KEY (`id_destaque`),
  ADD KEY `id_anuncio` (`id_anuncio`);

--
-- Indexes for table `endereco`
--
ALTER TABLE `endereco`
  ADD PRIMARY KEY (`id_endereco`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `imagens_anuncio`
--
ALTER TABLE `imagens_anuncio`
  ADD PRIMARY KEY (`id_imagem`),
  ADD KEY `idx_anuncio_imagem` (`id_anuncio`);

--
-- Indexes for table `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`id_material`);

--
-- Indexes for table `mensagem`
--
ALTER TABLE `mensagem`
  ADD PRIMARY KEY (`id_mensagem`),
  ADD KEY `id_anuncio` (`id_anuncio`),
  ADD KEY `id_remetente` (`id_remetente`),
  ADD KEY `id_destinatario` (`id_destinatario`);

--
-- Indexes for table `notificacao`
--
ALTER TABLE `notificacao`
  ADD PRIMARY KEY (`id_notificacao`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`id_pagamento`),
  ADD UNIQUE KEY `id_transacao` (`id_transacao`);

--
-- Indexes for table `plano`
--
ALTER TABLE `plano`
  ADD PRIMARY KEY (`id_plano`);

--
-- Indexes for table `transacao`
--
ALTER TABLE `transacao`
  ADD PRIMARY KEY (`id_transacao`),
  ADD KEY `id_anuncio` (`id_anuncio`),
  ADD KEY `id_comprador` (`id_comprador`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf_cnpj` (`cpf_cnpj`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anuncio`
--
ALTER TABLE `anuncio`
  MODIFY `id_anuncio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assinatura`
--
ALTER TABLE `assinatura`
  MODIFY `id_assinatura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `avaliacao`
--
ALTER TABLE `avaliacao`
  MODIFY `id_avaliacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coleta`
--
ALTER TABLE `coleta`
  MODIFY `id_coleta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `denuncia`
--
ALTER TABLE `denuncia`
  MODIFY `id_denuncia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `destaque`
--
ALTER TABLE `destaque`
  MODIFY `id_destaque` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `endereco`
--
ALTER TABLE `endereco`
  MODIFY `id_endereco` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `imagens_anuncio`
--
ALTER TABLE `imagens_anuncio`
  MODIFY `id_imagem` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `material`
--
ALTER TABLE `material`
  MODIFY `id_material` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mensagem`
--
ALTER TABLE `mensagem`
  MODIFY `id_mensagem` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notificacao`
--
ALTER TABLE `notificacao`
  MODIFY `id_notificacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `id_pagamento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plano`
--
ALTER TABLE `plano`
  MODIFY `id_plano` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transacao`
--
ALTER TABLE `transacao`
  MODIFY `id_transacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anuncio`
--
ALTER TABLE `anuncio`
  ADD CONSTRAINT `anuncio_endereco_fk` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id_endereco`),
  ADD CONSTRAINT `anuncio_material_fk` FOREIGN KEY (`id_material`) REFERENCES `material` (`id_material`),
  ADD CONSTRAINT `anuncio_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `assinatura`
--
ALTER TABLE `assinatura`
  ADD CONSTRAINT `assinatura_plano_fk` FOREIGN KEY (`id_plano`) REFERENCES `plano` (`id_plano`),
  ADD CONSTRAINT `assinatura_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `avaliacao_avaliado_fk` FOREIGN KEY (`id_avaliado`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `avaliacao_avaliador_fk` FOREIGN KEY (`id_avaliador`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `avaliacao_transacao_fk` FOREIGN KEY (`id_transacao`) REFERENCES `transacao` (`id_transacao`) ON DELETE CASCADE;

--
-- Constraints for table `coleta`
--
ALTER TABLE `coleta`
  ADD CONSTRAINT `coleta_endereco_fk` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id_endereco`),
  ADD CONSTRAINT `coleta_transacao_fk` FOREIGN KEY (`id_transacao`) REFERENCES `transacao` (`id_transacao`) ON DELETE CASCADE;

--
-- Constraints for table `denuncia`
--
ALTER TABLE `denuncia`
  ADD CONSTRAINT `denuncia_anuncio_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio` (`id_anuncio`),
  ADD CONSTRAINT `denuncia_denunciante_fk` FOREIGN KEY (`id_denunciante`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `denuncia_usuario_denunciado_fk` FOREIGN KEY (`id_usuario_denunciado`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `destaque`
--
ALTER TABLE `destaque`
  ADD CONSTRAINT `destaque_anuncio_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio` (`id_anuncio`) ON DELETE CASCADE;

--
-- Constraints for table `endereco`
--
ALTER TABLE `endereco`
  ADD CONSTRAINT `endereco_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `imagens_anuncio`
--
ALTER TABLE `imagens_anuncio`
  ADD CONSTRAINT `imagem_anuncio_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio` (`id_anuncio`) ON DELETE CASCADE;

--
-- Constraints for table `mensagem`
--
ALTER TABLE `mensagem`
  ADD CONSTRAINT `mensagem_anuncio_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio` (`id_anuncio`) ON DELETE SET NULL,
  ADD CONSTRAINT `mensagem_destinatario_fk` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `mensagem_remetente_fk` FOREIGN KEY (`id_remetente`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `notificacao`
--
ALTER TABLE `notificacao`
  ADD CONSTRAINT `notificacao_usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `pagamento_transacao_fk` FOREIGN KEY (`id_transacao`) REFERENCES `transacao` (`id_transacao`) ON DELETE CASCADE;

--
-- Constraints for table `transacao`
--
ALTER TABLE `transacao`
  ADD CONSTRAINT `transacao_anuncio_fk` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio` (`id_anuncio`),
  ADD CONSTRAINT `transacao_comprador_fk` FOREIGN KEY (`id_comprador`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;