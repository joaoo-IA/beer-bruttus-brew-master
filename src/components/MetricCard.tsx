import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  variant?: "default" | "golden" | "primary";
}

export function MetricCard({ title, value, icon: Icon, subtitle, variant = "default" }: MetricCardProps) {
  const variantStyles = {
    default: "border-border",
    golden: "border-accent/30 bg-gradient-to-br from-accent/5 to-transparent",
    primary: "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    golden: "text-golden",
    primary: "text-primary",
  };

  const valueStyles = {
    default: "text-foreground",
    golden: "text-golden",
    primary: "text-primary",
  };

  return (
    <Card className={`${variantStyles[variant]} transition-all hover:border-primary/50`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className={`text-3xl font-bold ${valueStyles[variant]} mb-1`}>{value}</h3>
            {subtitle && <p className="text-xs text-beige">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full bg-secondary ${iconStyles[variant]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
