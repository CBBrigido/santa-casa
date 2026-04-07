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
      <div className="animate-fade-in">
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 10rem)" }}>
          {kanbanColumns.map((col) => (
            <div key={col.id} className="min-w-[260px] w-[260px] flex-shrink-0 flex flex-col">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`h-2.5 w-2.5 rounded-full ${colorMap[col.color]}`} />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.title}
                </h3>
                <span className="ml-auto text-xs font-mono text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                  {col.cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3 flex-1">
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    className={`bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all cursor-pointer border-l-4 ${priorityBorder[card.priority]} p-4`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-card-foreground">{card.doctor}</h4>
                      <button className="text-muted-foreground hover:text-foreground p-0.5">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-lg font-bold font-mono text-card-foreground mb-2">
                      {formatCurrency(card.amount)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{card.items} itens</span>
                      {card.alert && (
                        <span className="inline-flex items-center gap-1 text-xs text-destructive bg-destructive/10 rounded-md px-2 py-0.5">
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
