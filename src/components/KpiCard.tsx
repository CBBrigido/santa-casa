import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "primary" | "secondary" | "destructive" | "pending" | "muted";
  trend?: { value: number; positive: boolean };
}

const variantStyles = {
  primary: "border-l-4 border-l-primary",
  secondary: "border-l-4 border-l-secondary",
  destructive: "border-l-4 border-l-destructive",
  pending: "border-l-4 border-l-status-pending",
  muted: "border-l-4 border-l-muted-foreground",
};

export function KpiCard({ title, value, icon: Icon, variant, trend }: KpiCardProps) {
  return (
    <div className={`bg-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-shadow ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground font-mono">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
          </p>
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? "text-status-ok" : "text-destructive"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}% vs mês anterior
            </p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
