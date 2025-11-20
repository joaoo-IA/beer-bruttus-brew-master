import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PeriodFilter, Period } from "@/components/PeriodFilter";
import { BarChart3 } from "lucide-react";

export default function Relatorios() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-golden mb-2">Relatórios</h1>
          <p className="text-beige">Análises e gráficos do período</p>
        </div>
        <PeriodFilter selected={selectedPeriod} onSelect={setSelectedPeriod} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Gráficos e Análises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">Relatórios serão gerados aqui</p>
            <p className="text-sm">Adicione transações e dados para visualizar análises</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
