CREATE TABLE IF NOT EXISTS ia_rascunhos (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL DEFAULT 'Novo produto',
    estado JSON NOT NULL,
    versao INT UNSIGNED NOT NULL DEFAULT 1,
    ultima_gravacao CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    produto_publicado_id INT DEFAULT NULL,
    criado_em DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    atualizado_em DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_rascunhos_usuario (usuario_id, atualizado_em),
    CONSTRAINT fk_rascunhos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_rascunhos_produto FOREIGN KEY (produto_publicado_id) REFERENCES produtos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
