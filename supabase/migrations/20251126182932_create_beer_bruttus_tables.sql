/*
  # Criar Sistema Beer Bruttus

  1. Novas Tabelas
    - `produtos`: Catálogo de produtos (cervejas, barris)
      - `id` (uuid, chave primária)
      - `nome` (texto, obrigatório)
      - `tipo` (texto, padrão 'cerveja')
      - `descricao` (texto, opcional)
      - `preco_venda` (numérico, padrão 0)
      - `unidade_medida` (texto, padrão 'barril')
      - `ativo` (booleano, padrão true)
      - `created_at` e `updated_at` (timestamps)
    
    - `estoque`: Controle de quantidades em estoque
      - `id` (uuid, chave primária)
      - `produto_id` (uuid, referência a produtos)
      - `quantidade` (numérico, padrão 0)
      - `created_at` e `updated_at` (timestamps)
      - Unique constraint em produto_id
    
    - `transacoes_financeiras`: Registro de ganhos e gastos
      - `id` (uuid, chave primária)
      - `tipo` (texto, 'ganho' ou 'gasto')
      - `produto_id` (uuid, referência opcional a produtos)
      - `categoria` (texto, obrigatório)
      - `valor` (numérico, obrigatório)
      - `quantidade` (numérico, opcional)
      - `data` (data, padrão hoje)
      - `descricao` (texto, opcional)
      - `created_at` (timestamp)
    
    - `notas`: Anotações organizadas por categoria
      - `id` (uuid, chave primária)
      - `categoria` (texto, valores: Produção, Entregas, Compras, Eventos, Outros)
      - `titulo` (texto, obrigatório)
      - `conteudo` (texto, opcional)
      - `created_at` e `updated_at` (timestamps)

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas públicas para demonstração (permitir acesso anon/authenticated)
    
  3. Performance
    - Índices em chaves estrangeiras e campos de busca
    
  4. Automação
    - Triggers para atualizar updated_at automaticamente
*/

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  tipo text NOT NULL DEFAULT 'cerveja',
  descricao text,
  preco_venda numeric(10, 2) NOT NULL DEFAULT 0,
  unidade_medida text NOT NULL DEFAULT 'barril',
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de estoque
CREATE TABLE IF NOT EXISTS estoque (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  quantidade numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(produto_id)
);

-- Criar tabela de transações financeiras
CREATE TABLE IF NOT EXISTS transacoes_financeiras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('ganho', 'gasto')),
  produto_id uuid REFERENCES produtos(id) ON DELETE SET NULL,
  categoria text NOT NULL,
  valor numeric(10, 2) NOT NULL,
  quantidade numeric(10, 2),
  data date NOT NULL DEFAULT CURRENT_DATE,
  descricao text,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de notas
CREATE TABLE IF NOT EXISTS notas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL CHECK (categoria IN ('Produção', 'Entregas', 'Compras', 'Eventos', 'Outros')),
  titulo text NOT NULL,
  conteudo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Permitir acesso público a produtos" ON produtos;
DROP POLICY IF EXISTS "Permitir acesso público a estoque" ON estoque;
DROP POLICY IF EXISTS "Permitir acesso público a transações" ON transacoes_financeiras;
DROP POLICY IF EXISTS "Permitir acesso público a notas" ON notas;

-- Políticas públicas (para demonstração)
CREATE POLICY "Permitir acesso público a produtos"
  ON produtos FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir acesso público a estoque"
  ON estoque FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir acesso público a transações"
  ON transacoes_financeiras FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Permitir acesso público a notas"
  ON notas FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_estoque_produto_id ON estoque(produto_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoes_financeiras(tipo);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes_financeiras(data);
CREATE INDEX IF NOT EXISTS idx_transacoes_produto_id ON transacoes_financeiras(produto_id);
CREATE INDEX IF NOT EXISTS idx_notas_categoria ON notas(categoria);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_produtos_updated_at ON produtos;
CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON produtos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_estoque_updated_at ON estoque;
CREATE TRIGGER update_estoque_updated_at
  BEFORE UPDATE ON estoque
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notas_updated_at ON notas;
CREATE TRIGGER update_notas_updated_at
  BEFORE UPDATE ON notas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();