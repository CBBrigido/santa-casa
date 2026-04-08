import { AppLayout } from "@/components/AppLayout";
import { kanbanColumns } from "@/data/mockData";
import { AlertTriangle, MoreHorizontal } from "lucide-react";

const colorMap = {
  ok: "bg-status-ok",
  pending: "bg-status-pending",
  issue: "bg-status-issue",
  processing: "bg-status-processing",
};

const priorityBorder = {
  low: "border-l-transparent",
  medium: "border-l-status-pending",
  high: "border-l-destructive",
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function KanbanPage() {
  return (
    <AppLayout title="Fluxo de Pagamento">
      <div className="animate-fade-in h-[calc(100vh-5rem)] flex flex-col -m-6">
        <div className="flex gap-2 flex-1 p-4 overflow-hidden">
          {kanbanColumns.map((col) => (
            <div
              key={col.id}
              className="flex-1 min-w-0 flex flex-col bg-muted/40 rounded-xl p-2.5"
            >
              {/* Cabeçalho da coluna */}
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${colorMap[col.color]}`} />
                <h3 className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex-1 truncate">
                  {col.title}
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground bg-background rounded-full px-1.5 py-0.5 flex-shrink-0">
                  {col.cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-1.5 flex-1 overflow-y-auto">
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all cursor-pointer border-l-[3px] ${priorityBorder[card.priority]} p-2.5`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="text-xs font-medium text-card-foreground leading-tight truncate">{card.doctor}</h4>
                      <button className="text-muted-foreground hover:text-foreground flex-shrink-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold font-mono text-card-foreground mb-1 leading-tight">
                      {formatCurrency(card.amount)}
                    </p>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-muted-foreground">{card.items} itens</span>
                      {card.alert && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] text-destructive bg-destructive/10 rounded px-1 py-0.5 leading-tight">
                          <AlertTriangle className="h-2.5 w-2.5 flex-shrink-0" />
                          <span className="truncate max-w-[60px]">{card.alert}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
