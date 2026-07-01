-- ==========================================================
-- Schema do banco de dados - Concessionaria (Projeto II)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS concessionaria
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE concessionaria;

-- Clientes -------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(150) NOT NULL,
  cpf        VARCHAR(20)  NOT NULL UNIQUE,
  telefone   VARCHAR(30)  NOT NULL,
  email      VARCHAR(150) NULL,
  cidade     VARCHAR(100) NULL
) ENGINE=InnoDB;

-- Vendedores -------------------------------------------------
CREATE TABLE IF NOT EXISTS vendedores (
  id_vendedor          INT AUTO_INCREMENT PRIMARY KEY,
  nome                 VARCHAR(150) NOT NULL,
  matricula            VARCHAR(30)  NOT NULL UNIQUE,
  comissao_percentual  DECIMAL(5,2) NOT NULL
) ENGINE=InnoDB;

-- Carros -------------------------------------------------
CREATE TABLE IF NOT EXISTS carros (
  id_carro INT AUTO_INCREMENT PRIMARY KEY,
  marca    VARCHAR(60)  NOT NULL,
  modelo   VARCHAR(60)  NOT NULL,
  ano      INT          NOT NULL,
  placa    VARCHAR(15)  NOT NULL UNIQUE,
  preco    DECIMAL(12,2) NOT NULL,
  cor      VARCHAR(40)  NOT NULL
) ENGINE=InnoDB;

-- Estoque -------------------------------------------------
-- Um registro de estoque por carro (RN04)
CREATE TABLE IF NOT EXISTS estoque (
  id_estoque         INT AUTO_INCREMENT PRIMARY KEY,
  id_carro           INT NOT NULL UNIQUE,
  quantidade         INT NOT NULL,
  localizacao_patio  VARCHAR(100) NOT NULL,
  data_entrada       DATE NOT NULL,
  CONSTRAINT fk_estoque_carro
    FOREIGN KEY (id_carro) REFERENCES carros(id_carro)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Notas Fiscais -------------------------------------------------
CREATE TABLE IF NOT EXISTS notas_fiscais (
  id_nota      INT AUTO_INCREMENT PRIMARY KEY,
  numero_nota  VARCHAR(40)  NOT NULL UNIQUE,
  data_emissao DATE         NOT NULL,
  valor_total  DECIMAL(12,2) NOT NULL,
  id_cliente   INT NOT NULL,
  id_vendedor  INT NOT NULL,
  id_carro     INT NOT NULL,
  CONSTRAINT fk_nota_cliente
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
    ON DELETE RESTRICT,
  CONSTRAINT fk_nota_vendedor
    FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor)
    ON DELETE RESTRICT,
  CONSTRAINT fk_nota_carro
    FOREIGN KEY (id_carro) REFERENCES carros(id_carro)
    ON DELETE RESTRICT
) ENGINE=InnoDB;
