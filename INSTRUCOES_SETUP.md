# Instruções de Configuração - Beer Bruttus

## 1. Configurar Banco de Dados Supabase

O sistema foi completamente renovado para usar Supabase como banco de dados persistente.

### Passos:

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)

2. Vá em **SQL Editor** no menu lateral

3. Cole todo o conteúdo do arquivo `SETUP_DATABASE.sql` e clique em **RUN**

4. Verifique se as tabelas foram criadas em **Table Editor**:
   - produtos
   - estoque
   - transacoes_financeiras
   - notas

## 2. O que foi corrigido

### Banco de Dados
- Criadas 4 tabelas principais com RLS habilitado
- Políticas de segurança configuradas
- Triggers para atualização automática de timestamps
- Índices para melhor performance

### Dashboard
- Agora carrega dados reais do Supabase
- Métricas financeiras calculadas automaticamente
- Filtros de período funcionando (hoje, semana, mês, ano)
- Botões de ação rápida navegam corretamente

### Financeiro
- CRUD completo funcionando
- Ganhos e gastos salvos no banco
- Integração com produtos cadastrados
- Histórico com filtros por período
- Exclusão de transações funcionando
- Totais calculados em tempo real

### Sistema
- Hooks React para integração com Supabase
- Funções helper para operações no banco
- Formatação de moeda brasileira
- Tratamento de erros
- Toast notifications

## 3. Próximas Etapas (Páginas Restantes)

As seguintes páginas ainda precisam ser implementadas com integração ao Supabase:

### Produtos
- Listar produtos cadastrados
- Adicionar novo produto
- Editar produto existente
- Excluir produto
- Gerenciar estoque inicial

### Estoque
- Visualizar estoque atual
- Ajustar quantidades manualmente
- Histórico de movimentações
- Alertas de estoque baixo

### Notas
- Criar notas por categoria
- Editar notas existentes
- Excluir notas
- Filtrar por categoria

### Relatórios
- Gráficos de vendas por período
- Análise de lucros e gastos
- Produtos mais vendidos
- Exportação de dados

## 4. Estrutura Criada

```
src/
├── hooks/
│   └── useDatabase.ts          # Hooks para consultar dados
├── lib/
│   └── database.ts             # Funções para manipular banco
└── pages/
    ├── Dashboard.tsx           # ✅ Funcionando
    ├── Financeiro.tsx          # ✅ Funcionando
    ├── Produtos.tsx            # ⚠️ Precisa implementar
    ├── Estoque.tsx             # ⚠️ Precisa implementar
    ├── Notas.tsx               # ⚠️ Precisa implementar
    └── Relatorios.tsx          # ⚠️ Precisa implementar
```

## 5. Funcionalidades Implementadas

- Salvamento persistente real (dados não somem ao recarregar)
- Navegação funcionando entre todas as páginas
- Dashboard com dados reais e filtros
- Sistema financeiro completo
- Integração com Supabase
- Design responsivo (mobile e desktop)
- Identidade visual mantida (preto, laranja, dourado, bege)

## 6. Como Testar

1. Execute o SQL no Supabase
2. Reinicie o servidor de desenvolvimento
3. Acesse o Dashboard - deve estar vazio (sem dados mock)
4. Vá para Financeiro e adicione um ganho ou gasto
5. Volte ao Dashboard - os dados devem aparecer
6. Recarregue a página - os dados devem permanecer

## 7. Observações Importantes

- O app agora inicia completamente vazio (sem dados fictícios)
- Todos os registros são salvos no Supabase
- Os dados persistem entre sessões
- As políticas RLS estão abertas para demonstração
- Em produção, adicione autenticação e restrinja as políticas

## 8. Build

O projeto foi testado e o build está funcionando:

```bash
npm run build
```

Resultado: ✅ Build successful
