import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProdutos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return { produtos, loading, refetch: fetchProdutos };
}

export function useEstoque() {
  const [estoque, setEstoque] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEstoque = async () => {
    try {
      const { data, error } = await supabase
        .from("estoque")
        .select(`
          *,
          produtos (
            id,
            nome,
            tipo,
            unidade_medida,
            preco_venda
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEstoque(data || []);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

  return { estoque, loading, refetch: fetchEstoque };
}

export function useTransacoes(periodo?: { inicio: string; fim: string }) {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransacoes = async () => {
    try {
      let query = supabase
        .from("transacoes_financeiras")
        .select(`
          *,
          produtos (
            id,
            nome,
            unidade_medida
          )
        `);

      if (periodo) {
        query = query
          .gte("data", periodo.inicio)
          .lte("data", periodo.fim);
      }

      const { data, error } = await query.order("data", { ascending: false });

      if (error) throw error;
      setTransacoes(data || []);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, [periodo?.inicio, periodo?.fim]);

  return { transacoes, loading, refetch: fetchTransacoes };
}

export function useNotas(categoria?: string) {
  const [notas, setNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotas = async () => {
    try {
      let query = supabase.from("notas").select("*");

      if (categoria) {
        query = query.eq("categoria", categoria);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setNotas(data || []);
    } catch (error) {
      console.error("Erro ao carregar notas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, [categoria]);

  return { notas, loading, refetch: fetchNotas };
}
