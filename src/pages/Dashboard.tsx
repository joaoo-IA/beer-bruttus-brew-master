import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/MetricCard";
import { PeriodFilter, Period } from "@/components/PeriodFilter";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Package, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getResumoFinanceiro, getResumoEstoque } from "@/lib/database";
import { format, subDays, subMonths, subYears, startOfDay } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    faturamento: 0,
    ganhos: 0,
    gastos: 0,
    lucro: 0,
    estoqueBarris: 0,
    estoqueLitros: 0,
    vendidoBarris: 0,
    vendidoLitros: 0,
  });

  const getPeriodoDatas = (period: Period) => {
    const hoje = new Date();
    let inicio = new Date();

    switch (period) {
      case "today":
        inicio = startOfDay(hoje);
        break;
      case "week":
        inicio = subDays(hoje, 7);
        break;
      case "month":
        inicio = subMonths(hoje, 1);
        break;
      case "year":
        inicio = subYears(hoje, 1);
        break;
      default:
        inicio = subMonths(hoje, 1);
    }

    return {
      inicio: format(inicio, "yyyy-MM-dd"),
      fim: format(hoje, "yyyy-MM-dd"),
    };
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const periodo = getPeriodoDatas(selectedPeriod);
        const [resumoFinanceiro, resumoEstoque] = await Promise.all([
          getResumoFinanceiro(periodo),
          getResumoEstoque(),
        ]);

        setMetrics({
          faturamento: resumoFinanceiro.faturamento,
          ganhos: resumoFinanceiro.ganhos,
          gastos: resumoFinanceiro.gastos,
          lucro: resumoFinanceiro.lucro,
          estoqueBarris: resumoEstoque.barrisEmEstoque,
          estoqueLitros: resumoEstoque.litrosEmEstoque,
          vendidoBarris: resumoFinanceiro.barrisVendidos,
          vendidoLitros: resumoFinanceiro.litrosVendidos,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [selectedPeriod]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-golden mb-2">Dashboard</h1>
          <p className="text-beige">Visão geral da operação</p>
        </div>
        <PeriodFilter selected={selectedPeriod} onSelect={setSelectedPeriod} />
      </div>

      {/* Métricas Financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Faturamento Bruto"
          value={loading ? "..." : formatarMoeda(metrics.faturamento)}
          icon={DollarSign}
          variant="golden"
        />
        <MetricCard
          title="Total em Ganhos"
          value={loading ? "..." : formatarMoeda(metrics.ganhos)}
          icon={TrendingUp}
          variant="primary"
        />
        <MetricCard
          title="Total em Gastos"
          value={loading ? "..." : formatarMoeda(metrics.gastos)}
          icon={TrendingDown}
        />
        <MetricCard
          title="Lucro do Período"
          value={loading ? "..." : formatarMoeda(metrics.lucro)}
          icon={Wallet}
          variant="golden"
        />
      </div>

      {/* Estoque */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Estoque Atual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Barris em Estoque"
            value={loading ? "..." : Math.round(metrics.estoqueBarris)}
            icon={Package}
            subtitle="unidades"
          />
          <MetricCard
            title="Litros em Estoque"
            value={loading ? "..." : Math.round(metrics.estoqueLitros)}
            icon={Package}
            subtitle="litros totais"
          />
          <MetricCard
            title="Barris Vendidos"
            value={loading ? "..." : Math.round(metrics.vendidoBarris)}
            icon={BarChart3}
            subtitle="no período"
            variant="primary"
          />
          <MetricCard
            title="Litros Vendidos"
            value={loading ? "..." : Math.round(metrics.vendidoLitros)}
            icon={BarChart3}
            subtitle="no período"
            variant="primary"
          />
        </div>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            size="lg"
            onClick={() => navigate("/financeiro")}
            className="h-20 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-5 w-5" />
            Registrar Venda
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/financeiro")}
            className="h-20 border-primary/50 hover:bg-primary/10"
          >
            <Plus className="mr-2 h-5 w-5" />
            Registrar Gasto
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/notas")}
            className="h-20 border-accent/50 hover:bg-accent/10"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nova Nota
          </Button>
        </div>
      </div>
    </div>
  );
}
