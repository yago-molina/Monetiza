-- Execute no banco selecionado do Monetiza, antes de iniciar o backend atualizado.
-- Não remove nem modifica compras ou transações antigas.
CREATE TABLE IF NOT EXISTS operacoes_idempotentes (
    usuario_id INT NOT NULL,
    operacao VARCHAR(40) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    chave CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    corpo_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    resposta_status SMALLINT UNSIGNED DEFAULT NULL,
    resposta_json JSON DEFAULT NULL,
    criado_em DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (usuario_id, operacao, chave),
    CONSTRAINT fk_operacoes_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
