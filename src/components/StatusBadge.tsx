import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Pago", className: "bg-status-ok/15 text-status-ok border-status-ok/30" },
  pending: { label: "Pendente", className: "bg-status-pending/15 text-status-pending border-status-pending/30" },
  denied: { label: "Glosado", className: "bg-destructive/15 text-destructive border-destructive/30" },
  processing: { label: "Processando", className: "bg-status-processing/15 text-status-processing border-status-processing/30" },
  review: { label: "Em Revisão", className: "bg-status-pending/15 text-status-pending border-status-pending/30" },
  waiting: { label: "Aguardando", className: "bg-status-pending/15 text-status-pending border-status-pending/30" },
  overdue: { label: "Atrasado", className: "bg-destructive/15 text-destructive border-destructive/30" },
  partial: { label: "Parcial", className: "bg-status-processing/15 text-status-processing border-status-processing/30" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}
