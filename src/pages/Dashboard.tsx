import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { PeriodFilter, Period } from "@/components/PeriodFilter";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Package, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");

  // Mock data - será substituído por dados reais
  const metrics = {
    faturamento: "R$ 45.800,00",
    ganhos: "R$ 42.300,00",
    gastos: "R$ 15.600,00",
    lucro: "R$ 26.700,00",
    estoqueBarris: 24,
    estoqueLitros: 720,
    vendidoBarris: 56,
    vendidoLitros: 1680,
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
          value={metrics.faturamento}
          icon={DollarSign}
          variant="golden"
        />
        <MetricCard
          title="Total em Ganhos"
          value={metrics.ganhos}
          icon={TrendingUp}
          variant="primary"
        />
        <MetricCard
          title="Total em Gastos"
          value={metrics.gastos}
          icon={TrendingDown}
        />
        <MetricCard
          title="Lucro do Período"
          value={metrics.lucro}
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
            value={metrics.estoqueBarris}
            icon={Package}
            subtitle="unidades"
          />
          <MetricCard
            title="Litros em Estoque"
            value={metrics.estoqueLitros}
            icon={Package}
            subtitle="litros totais"
          />
          <MetricCard
            title="Barris Vendidos"
            value={metrics.vendidoBarris}
            icon={BarChart3}
            subtitle="no período"
            variant="primary"
          />
          <MetricCard
            title="Litros Vendidos"
            value={metrics.vendidoLitros}
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
            className="h-20 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-5 w-5" />
            Registrar Venda
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-20 border-primary/50 hover:bg-primary/10"
          >
            <Plus className="mr-2 h-5 w-5" />
            Registrar Gasto
          </Button>
          <Button
            size="lg"
            variant="outline"
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
