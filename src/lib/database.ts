import { supabase } from "@/integrations/supabase/client";

export async function criarProduto(produto: {
  nome: string;
  tipo: string;
  descricao?: string;
  preco_venda: number;
  unidade_medida: string;
}) {
  const { data, error } = await supabase
    .from("produtos")
    .insert([produto])
    .select()
    .single();

  if (error) throw error;

  await supabase.from("estoque").insert([
    {
      produto_id: data.id,
      quantidade: 0,
    },
  ]);

  return data;
}

export async function atualizarProduto(id: string, produto: Partial<any>) {
  const { data, error } = await supabase
    .from("produtos")
    .update(produto)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function excluirProduto(id: string) {
  const { error } = await supabase.from("produtos").delete().eq("id", id);

  if (error) throw error;
}

export async function atualizarEstoque(produto_id: string, quantidade: number) {
  const { data, error } = await supabase
    .from("estoque")
    .upsert(
      {
        produto_id,
        quantidade,
      },
      { onConflict: "produto_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function criarTransacao(transacao: {
  tipo: "ganho" | "gasto";
  produto_id?: string;
  categoria: string;
  valor: number;
  quantidade?: number;
  data: string;
  descricao?: string;
}) {
  const { data, error } = await supabase
    .from("transacoes_financeiras")
    .insert([transacao])
    .select()
    .single();

  if (error) throw error;

  if (transacao.tipo === "ganho" && transacao.produto_id && transacao.quantidade) {
    const { data: estoqueAtual } = await supabase
      .from("estoque")
      .select("quantidade")
      .eq("produto_id", transacao.produto_id)
      .single();

    if (estoqueAtual) {
      await atualizarEstoque(
        transacao.produto_id,
        Number(estoqueAtual.quantidade) - Number(transacao.quantidade)
      );
    }
  }

  return data;
}

export async function excluirTransacao(id: string) {
  const { error } = await supabase
    .from("transacoes_financeiras")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function criarNota(nota: {
  categoria: string;
  titulo: string;
  conteudo?: string;
}) {
  const { data, error } = await supabase
    .from("notas")
    .insert([nota])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarNota(id: string, nota: Partial<any>) {
  const { data, error } = await supabase
    .from("notas")
    .update(nota)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function excluirNota(id: string) {
  const { error } = await supabase.from("notas").delete().eq("id", id);

  if (error) throw error;
}

export async function getResumoFinanceiro(periodo: { inicio: string; fim: string }) {
  const { data, error } = await supabase
    .from("transacoes_financeiras")
    .select("tipo, valor, quantidade")
    .gte("data", periodo.inicio)
    .lte("data", periodo.fim);

  if (error) throw error;

  const ganhos = data
    .filter((t) => t.tipo === "ganho")
    .reduce((sum, t) => sum + Number(t.valor), 0);

  const gastos = data
    .filter((t) => t.tipo === "gasto")
    .reduce((sum, t) => sum + Number(t.valor), 0);

  const barrisVendidos = data
    .filter((t) => t.tipo === "ganho" && t.quantidade)
    .reduce((sum, t) => sum + Number(t.quantidade), 0);

  return {
    faturamento: ganhos,
    ganhos,
    gastos,
    lucro: ganhos - gastos,
    barrisVendidos,
    litrosVendidos: barrisVendidos * 30,
  };
}

export async function getResumoEstoque() {
  const { data, error } = await supabase
    .from("estoque")
    .select(`
      quantidade,
      produtos (
        unidade_medida
      )
    `);

  if (error) throw error;

  const barrisEmEstoque = data
    .filter((e: any) => e.produtos?.unidade_medida === "barril")
    .reduce((sum, e) => sum + Number(e.quantidade), 0);

  const litrosEmEstoque = barrisEmEstoque * 30;

  return {
    barrisEmEstoque,
    litrosEmEstoque,
  };
}
