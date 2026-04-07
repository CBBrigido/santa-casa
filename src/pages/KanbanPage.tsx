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
        <div className="flex gap-3 overflow-x-auto flex-1 p-6">
          {kanbanColumns.map((col) => (
            <div key={col.id} className="min-w-[250px] w-[250px] flex-shrink-0 flex flex-col bg-muted/40 rounded-xl p-3">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`h-2 w-2 rounded-full ${colorMap[col.color]}`} />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex-1">
                  {col.title}
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground bg-background rounded-full px-2 py-0.5">
                  {col.cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2 flex-1 overflow-y-auto">
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all cursor-pointer border-l-[3px] ${priorityBorder[card.priority]} p-3.5`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <h4 className="text-sm font-medium text-card-foreground">{card.doctor}</h4>
                      <button className="text-muted-foreground hover:text-foreground p-0.5 -mr-1 -mt-0.5">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-base font-bold font-mono text-card-foreground mb-1.5">
                      {formatCurrency(card.amount)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{card.items} itens</span>
                      {card.alert && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-destructive bg-destructive/10 rounded px-1.5 py-0.5">
                          <AlertTriangle className="h-3 w-3" />
                          {card.alert}
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
