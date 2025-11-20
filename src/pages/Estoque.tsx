import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Package } from "lucide-react";

export default function Estoque() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-golden mb-2">Estoque</h1>
        <p className="text-beige">Controle manual de estoque</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Produtos em Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">Nenhum produto cadastrado</p>
            <p className="text-sm">Adicione produtos na seção "Produtos" para começar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
