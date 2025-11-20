import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { PeriodFilter, Period } from "@/components/PeriodFilter";

export default function Financeiro() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-golden mb-2">Financeiro</h1>
          <p className="text-beige">Controle de ganhos e gastos</p>
        </div>
        <PeriodFilter selected={selectedPeriod} onSelect={setSelectedPeriod} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-5 w-5" />
              Ganhos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Ganho
            </Button>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Nenhum ganho registrado ainda</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <TrendingDown className="h-5 w-5" />
              Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-destructive/50 hover:bg-destructive/10">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Gasto
            </Button>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Nenhum gasto registrado ainda</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Nenhuma transação registrada no período selecionado
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
