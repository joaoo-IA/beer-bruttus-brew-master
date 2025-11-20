import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { PeriodFilter, Period } from "@/components/PeriodFilter";
import { toast } from "@/hooks/use-toast";

type Transaction = {
  id: string;
  type: "ganho" | "gasto";
  produto?: string;
  categoria?: string;
  valor: number;
  quantidade?: number;
  data: string;
  descricao?: string;
};

export default function Financeiro() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ganhoOpen, setGanhoOpen] = useState(false);
  const [gastoOpen, setGastoOpen] = useState(false);

  const handleAddGanho = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "ganho",
      produto: formData.get("produto") as string,
      quantidade: Number(formData.get("quantidade")),
      valor: Number(formData.get("valor")),
      data: formData.get("data") as string,
      descricao: formData.get("observacoes") as string,
    };

    setTransactions([newTransaction, ...transactions]);
    setGanhoOpen(false);
    toast({ title: "Ganho registrado com sucesso!" });
    e.currentTarget.reset();
  };

  const handleAddGasto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: "gasto",
      categoria: formData.get("categoria") as string,
      valor: Number(formData.get("valor")),
      data: formData.get("data") as string,
      descricao: formData.get("descricao") as string,
    };

    setTransactions([newTransaction, ...transactions]);
    setGastoOpen(false);
    toast({ title: "Gasto registrado com sucesso!" });
    e.currentTarget.reset();
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({ title: "Registro excluído" });
  };

  const totalGanhos = transactions
    .filter(t => t.type === "ganho")
    .reduce((sum, t) => sum + t.valor, 0);

  const totalGastos = transactions
    .filter(t => t.type === "gasto")
    .reduce((sum, t) => sum + t.valor, 0);

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
            <Dialog open={ganhoOpen} onOpenChange={setGanhoOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Ganho
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-primary/30">
                <DialogHeader>
                  <DialogTitle className="text-golden">Registrar Ganho</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddGanho} className="space-y-4">
                  <div>
                    <Label htmlFor="produto">Produto</Label>
                    <Input id="produto" name="produto" required className="bg-background/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input id="quantidade" name="quantidade" type="number" step="0.01" required className="bg-background/50" />
                    </div>
                    <div>
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input id="valor" name="valor" type="number" step="0.01" required className="bg-background/50" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Input id="data" name="data" type="date" required className="bg-background/50" />
                  </div>
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea id="observacoes" name="observacoes" className="bg-background/50" />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Salvar Ganho
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="mt-4 text-sm">
              <p className="text-primary font-semibold">Total: R$ {totalGanhos.toFixed(2)}</p>
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
            <Dialog open={gastoOpen} onOpenChange={setGastoOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-destructive/50 hover:bg-destructive/10">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Gasto
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-destructive/30">
                <DialogHeader>
                  <DialogTitle className="text-golden">Registrar Gasto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddGasto} className="space-y-4">
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input id="categoria" name="categoria" placeholder="Ex: Matéria-prima, Gás, Manutenção..." required className="bg-background/50" />
                  </div>
                  <div>
                    <Label htmlFor="valor-gasto">Valor (R$)</Label>
                    <Input id="valor-gasto" name="valor" type="number" step="0.01" required className="bg-background/50" />
                  </div>
                  <div>
                    <Label htmlFor="data-gasto">Data</Label>
                    <Input id="data-gasto" name="data" type="date" required className="bg-background/50" />
                  </div>
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea id="descricao" name="descricao" className="bg-background/50" />
                  </div>
                  <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90">
                    Salvar Gasto
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <div className="mt-4 text-sm">
              <p className="text-destructive font-semibold">Total: R$ {totalGastos.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma transação registrada no período selecionado
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    transaction.type === "ganho" ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {transaction.type === "ganho" ? (
                        <TrendingUp className="h-4 w-4 text-primary" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className="font-semibold text-foreground">
                        {transaction.produto || transaction.categoria}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.data).toLocaleDateString("pt-BR")}
                      {transaction.quantidade && ` • ${transaction.quantidade} un.`}
                      {transaction.descricao && ` • ${transaction.descricao}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold text-lg ${
                      transaction.type === "ganho" ? "text-primary" : "text-destructive"
                    }`}>
                      R$ {transaction.valor.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                      className="hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
