import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { PeriodFilter, Period } from "@/components/PeriodFilter";
import { toast } from "@/hooks/use-toast";
import { criarTransacao, excluirTransacao, getResumoFinanceiro } from "@/lib/database";
import { useTransacoes } from "@/hooks/useDatabase";
import { useProdutos } from "@/hooks/useDatabase";
import { format, subDays, subMonths, subYears, startOfDay } from "date-fns";

export default function Financeiro() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");
  const [ganhoOpen, setGanhoOpen] = useState(false);
  const [gastoOpen, setGastoOpen] = useState(false);
  const [totais, setTotais] = useState({ ganhos: 0, gastos: 0 });
  const [produtoSelecionado, setProdutoSelecionado] = useState("");

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

  const periodo = getPeriodoDatas(selectedPeriod);
  const { transacoes, refetch } = useTransacoes(periodo);
  const { produtos } = useProdutos();

  useEffect(() => {
    const carregarTotais = async () => {
      const resumo = await getResumoFinanceiro(periodo);
      setTotais({ ganhos: resumo.ganhos, gastos: resumo.gastos });
    };
    carregarTotais();
  }, [selectedPeriod, transacoes]);

  const handleAddGanho = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await criarTransacao({
        tipo: "ganho",
        produto_id: produtoSelecionado || undefined,
        categoria: "Venda",
        quantidade: Number(formData.get("quantidade")),
        valor: Number(formData.get("valor")),
        data: formData.get("data") as string,
        descricao: formData.get("observacoes") as string || undefined,
      });

      toast({ title: "Ganho registrado com sucesso!" });
      setGanhoOpen(false);
      setProdutoSelecionado("");
      refetch();
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao registrar ganho", variant: "destructive" });
    }
  };

  const handleAddGasto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await criarTransacao({
        tipo: "gasto",
        categoria: formData.get("categoria") as string,
        valor: Number(formData.get("valor")),
        data: formData.get("data") as string,
        descricao: formData.get("descricao") as string || undefined,
      });

      toast({ title: "Gasto registrado com sucesso!" });
      setGastoOpen(false);
      refetch();
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao registrar gasto", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await excluirTransacao(id);
      toast({ title: "Registro excluído" });
      refetch();
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao excluir registro", variant: "destructive" });
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

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
                    <Label htmlFor="produto_id">Produto</Label>
                    <Select value={produtoSelecionado} onValueChange={setProdutoSelecionado} required>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtos.map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input
                        id="quantidade"
                        name="quantidade"
                        type="number"
                        step="0.01"
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input id="valor" name="valor" type="number" step="0.01" required className="bg-background/50" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      name="data"
                      type="date"
                      required
                      defaultValue={format(new Date(), "yyyy-MM-dd")}
                      className="bg-background/50"
                    />
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
              <p className="text-primary font-semibold">Total: {formatarMoeda(totais.ganhos)}</p>
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
                    <Input
                      id="categoria"
                      name="categoria"
                      placeholder="Ex: Matéria-prima, Gás, Manutenção..."
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor-gasto">Valor (R$)</Label>
                    <Input
                      id="valor-gasto"
                      name="valor"
                      type="number"
                      step="0.01"
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="data-gasto">Data</Label>
                    <Input
                      id="data-gasto"
                      name="data"
                      type="date"
                      required
                      defaultValue={format(new Date(), "yyyy-MM-dd")}
                      className="bg-background/50"
                    />
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
              <p className="text-destructive font-semibold">Total: {formatarMoeda(totais.gastos)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          {transacoes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma transação registrada no período selecionado
            </p>
          ) : (
            <div className="space-y-3">
              {transacoes.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    transaction.tipo === "ganho"
                      ? "border-primary/30 bg-primary/5"
                      : "border-destructive/30 bg-destructive/5"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {transaction.tipo === "ganho" ? (
                        <TrendingUp className="h-4 w-4 text-primary" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className="font-semibold text-foreground">
                        {transaction.produtos?.nome || transaction.categoria}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.data).toLocaleDateString("pt-BR")}
                      {transaction.quantidade && ` • ${transaction.quantidade} un.`}
                      {transaction.descricao && ` • ${transaction.descricao}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold text-lg ${
                        transaction.tipo === "ganho" ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {formatarMoeda(transaction.valor)}
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
