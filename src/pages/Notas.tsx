import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Notas() {
  const categories = ["Produção", "Entregas", "Compras", "Eventos", "Outros"];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-golden mb-2">Notas</h1>
          <p className="text-beige">Anotações organizadas por categoria</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nova Nota
        </Button>
      </div>

      <Tabs defaultValue="Produção" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-secondary">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="data-[state=active]:bg-primary">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StickyNote className="h-5 w-5 text-primary" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">Nenhuma nota em {category}</p>
                  <p className="text-sm">Clique em "Nova Nota" para adicionar</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
