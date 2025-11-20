import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export type Period = "today" | "week" | "month" | "year" | "custom";

interface PeriodFilterProps {
  selected: Period;
  onSelect: (period: Period) => void;
}

export function PeriodFilter({ selected, onSelect }: PeriodFilterProps) {
  const periods: { label: string; value: Period }[] = [
    { label: "Hoje", value: "today" },
    { label: "Semana", value: "week" },
    { label: "Mês", value: "month" },
    { label: "Ano", value: "year" },
    { label: "Personalizado", value: "custom" },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Calendar className="h-5 w-5 text-muted-foreground" />
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={selected === period.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(period.value)}
          className={selected === period.value ? "bg-primary hover:bg-primary/90" : ""}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
}
