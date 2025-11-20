import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Beer } from "lucide-react";

export default function Produtos() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-golden mb-2">Produtos</h1>
          <p className="text-beige">Gerencie seus produtos</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beer className="h-5 w-5 text-primary" />
            Lista de Produtos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Beer className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">Nenhum produto cadastrado</p>
            <p className="text-sm">Clique em "Novo Produto" para começar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
