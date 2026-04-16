import { useState } from "react";
import { Clock, XCircle, DollarSign, CheckCircle } from "lucide-react";
import { kpiData } from "@/data/mockData";
import { BilledPaymentsDialog } from "@/components/BilledPaymentsDialog";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

interface StageCardProps {
  label: string;
  sublabel: string;
  value: number;
  count: number;
  icon: React.ElementType;
  bgColor: string;
  borderColor: string;
  textColor: string;
  barColor: string;
  totalValue: number;
  clickable?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function StageCard({
  label, sublabel, value, count, icon: Icon,
  bgColor, borderColor, textColor, barColor,
  totalValue, clickable, active, onClick, className,
}: StageCardProps) {
  const pct = ((value / totalValue) * 100).toFixed(1);
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex flex-col gap-2 p-4 rounded-lg border-2 text-left transition-all
        ${bgColor} ${borderColor}
        ${clickable ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : "cursor-default"}
        ${active ? "ring-2 ring-offset-1 ring-primary shadow-md" : ""}
        ${className ?? ""}
      `}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-white/70">
          <Icon className={`h-4 w-4 ${textColor}`} />
        </div>
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${textColor}`}>
          {label}
        </span>
        {clickable && (
          <span className={`ml-auto text-[10px] font-medium ${textColor} opacity-60`}>
            Ver detalhes →
          </span>
        )}
      </div>
      <div>
        <p className="text-lg font-bold font-mono text-card-foreground leading-tight">
          {formatCurrency(value)}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sublabel}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/60">
        <span className="text-[11px] text-muted-foreground">
          <span className="font-semibold text-card-foreground">{count}</span> registros
        </span>
        <span className={`text-[11px] font-semibold ${textColor}`}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/70 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </button>
  );
}

// Fork SVG connector: Pendente → splits into Glosado (top) + Liberado (bottom)
function ForkConnector() {
  return (
    <div className="relative flex-shrink-0 w-[72px]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 72 252"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        {/* Horizontal input from Pendente */}
        <line x1="0" y1="126" x2="28" y2="126" stroke="hsl(220 15% 70%)" strokeWidth="1.5" />
        {/* Vertical fork bar */}
        <line x1="28" y1="60" x2="28" y2="192" stroke="hsl(220 15% 70%)" strokeWidth="1.5" />

        {/* Top branch → Glosado (red dashed) */}
        <line x1="28" y1="60" x2="72" y2="60"
          stroke="hsl(0 72% 55%)" strokeWidth="1.5" strokeDasharray="5 3" />
        {/* Top arrowhead */}
        <polygon points="66,55 72,60 66,65" fill="hsl(0 72% 55%)" />

        {/* Bottom branch → Liberado (blue dashed) */}
        <line x1="28" y1="192" x2="72" y2="192"
          stroke="hsl(220 53% 45%)" strokeWidth="1.5" strokeDasharray="5 3" />
        {/* Bottom arrowhead */}
        <polygon points="66,187 72,192 66,197" fill="hsl(220 53% 45%)" />
      </svg>

      {/* Labels on the branches */}
      <div className="absolute inset-0 flex flex-col justify-between py-[10px] pointer-events-none">
        <span className="text-[9px] font-medium text-red-500 text-center leading-tight mt-1">
          Rejeitado
        </span>
        <span className="text-[9px] font-medium text-blue-600 text-center leading-tight mb-1">
          Aprovado
        </span>
      </div>
    </div>
  );
}

// Simple arrow connector between Liberado and Faturado
function ArrowConnector() {
  return (
    <div className="flex-shrink-0 w-[48px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-0.5">
        <svg width="48" height="24" viewBox="0 0 48 24">
          <line x1="0" y1="12" x2="40" y2="12"
            stroke="hsl(145 60% 42%)" strokeWidth="1.5" strokeDasharray="4 3" />
          <polygon points="36,7 44,12 36,17" fill="hsl(145 60% 42%)" />
        </svg>
        <span className="text-[9px] font-medium text-emerald-600 text-center">Faturado</span>
      </div>
    </div>
  );
}

export function FinancialPipeline() {
  const [billedOpen, setBilledOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const total = kpiData.pendingAmount + kpiData.deniedAmount + kpiData.releasedNoPayment + kpiData.releasedWithPayment;

  return (
    <>
      <div className="bg-card rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">Fluxo de Status Financeiro</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              O valor pendente pode ser rejeitado (glosado) ou aprovado (liberado), seguindo até o faturamento
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Total: {formatCurrency(total)}
          </span>
        </div>

        {/* Pipeline layout:
            [Pendente] ─fork─ [Glosado   ]
                             [Liberado   ] ──→ [Faturado]
        */}
        <div className="flex items-stretch gap-0">

          {/* Stage 1: Pendente (full height, spans both branches) */}
          <div className="flex-shrink-0 w-[22%]">
            <button
              onClick={() => setActiveStage(activeStage === "pending" ? null : "pending")}
              className={`
                w-full h-full flex flex-col gap-2 p-4 rounded-lg border-2 text-left transition-all
                bg-amber-50 border-amber-400
                cursor-pointer hover:shadow-sm
                ${activeStage === "pending" ? "ring-2 ring-offset-1 ring-primary shadow-md" : ""}
              `}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-white/70">
                  <Clock className="h-4 w-4 text-amber-700" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                  Valor Pendente
                </span>
              </div>
              <div>
                <p className="text-lg font-bold font-mono text-card-foreground leading-tight">
                  {formatCurrency(kpiData.pendingAmount)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Aguardando análise</p>
              </div>
              <div className="mt-auto pt-2 border-t border-white/60 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-card-foreground">{kpiData.pendingCount}</span> registros
                </span>
                <span className="text-[11px] font-semibold text-amber-700">
                  {((kpiData.pendingAmount / total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/70 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400"
                  style={{ width: `${(kpiData.pendingAmount / total) * 100}%` }} />
              </div>
            </button>
          </div>

          {/* Fork connector SVG */}
          <ForkConnector />

          {/* Middle column: Glosado (top) + Liberado (bottom) */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Glosado */}
            <StageCard
              label="Valor Glosado"
              sublabel="Rejeitados / Contestados"
              value={kpiData.deniedAmount}
              count={kpiData.deniedCount}
              icon={XCircle}
              bgColor="bg-red-50"
              borderColor="border-red-400"
              textColor="text-red-700"
              barColor="hsl(0 72% 55%)"
              totalValue={total}
              active={activeStage === "denied"}
              onClick={() => setActiveStage(activeStage === "denied" ? null : "denied")}
            />

            {/* Liberado */}
            <StageCard
              label="Liberado para Pagamento"
              sublabel="Aprovado, sem repasse"
              value={kpiData.releasedNoPayment}
              count={kpiData.releasedNoPaymentCount}
              icon={DollarSign}
              bgColor="bg-blue-50"
              borderColor="border-blue-400"
              textColor="text-blue-700"
              barColor="hsl(220 53% 45%)"
              totalValue={total}
              active={activeStage === "released"}
              onClick={() => setActiveStage(activeStage === "released" ? null : "released")}
            />
          </div>

          {/* Arrow: Liberado → Faturado (centered vertically in the bottom half) */}
          <div className="flex flex-col flex-shrink-0 justify-end">
            <div className="flex items-center justify-center" style={{ height: "50%" }}>
              <ArrowConnector />
            </div>
          </div>

          {/* Stage 4: Faturado (full height, fills empty space) */}
          <div className="flex-shrink-0 w-[22%] self-stretch">
            <StageCard
              label="Valor Faturado"
              sublabel="Com repasse — clique para detalhar"
              value={kpiData.releasedWithPayment}
              count={kpiData.releasedWithPaymentCount}
              icon={CheckCircle}
              bgColor="bg-emerald-50"
              borderColor="border-emerald-400"
              textColor="text-emerald-700"
              barColor="hsl(145 60% 42%)"
              className="h-full"
              totalValue={total}
              clickable
              onClick={() => setBilledOpen(true)}
            />
          </div>
        </div>

        {/* Drill-down info panel */}
        {activeStage && (() => {
          const map: Record<string, { label: string; value: number; count: number; textColor: string; bgColor: string; borderColor: string }> = {
            pending: { label: "Valor Pendente",            value: kpiData.pendingAmount,       count: kpiData.pendingCount,              textColor: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-300" },
            denied:  { label: "Valor Glosado",             value: kpiData.deniedAmount,        count: kpiData.deniedCount,               textColor: "text-red-700",   bgColor: "bg-red-50",   borderColor: "border-red-300"   },
            released:{ label: "Liberado para Pagamento",   value: kpiData.releasedNoPayment,   count: kpiData.releasedNoPaymentCount,    textColor: "text-blue-700",  bgColor: "bg-blue-50",  borderColor: "border-blue-300"  },
          };
          const s = map[activeStage];
          if (!s) return null;
          return (
            <div className={`mt-4 p-4 rounded-lg border ${s.bgColor} ${s.borderColor} animate-fade-in`}>
              <p className={`text-xs font-semibold ${s.textColor} mb-2`}>Detalhamento — {s.label}</p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Total de registros</p>
                  <p className="font-bold text-card-foreground text-base">{s.count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor médio por registro</p>
                  <p className="font-bold text-card-foreground text-base">{formatCurrency(s.value / s.count)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Participação no total</p>
                  <p className="font-bold text-card-foreground text-base">{((s.value / total) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <BilledPaymentsDialog open={billedOpen} onOpenChange={setBilledOpen} />
    </>
  );
}
