import { AppLayout } from "@/components/AppLayout";
import { doctorPortalData } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, TrendingUp, Clock, MessageSquare } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const d = doctorPortalData;

const timelineIcon: Record<string, string> = {
  ok: "bg-status-ok",
  pending: "bg-status-pending",
  issue: "bg-status-issue",
  processing: "bg-status-processing",
};

export default function DoctorPortal() {
  return (
    <AppLayout title="Portal do Médico">
      <div className="space-y-6 animate-fade-in max-w-6xl">
        {/* Doctor header */}
        <div className="bg-card rounded-lg shadow-card p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-primary-foreground">CS</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-card-foreground">{d.name}</h2>
            <p className="text-sm text-muted-foreground">{d.crm} · {d.specialty}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              Notas Fiscais
            </Button>
            <Button size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Solicitar Revisão
            </Button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg shadow-card p-5 border-l-4 border-l-status-pending">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase text-muted-foreground">Previsto</span>
            </div>
            <p className="text-2xl font-bold font-mono text-card-foreground">{formatCurrency(d.expectedEarnings)}</p>
          </div>
          <div className="bg-card rounded-lg shadow-card p-5 border-l-4 border-l-secondary">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase text-muted-foreground">Confirmado</span>
            </div>
            <p className="text-2xl font-bold font-mono text-card-foreground">{formatCurrency(d.confirmedEarnings)}</p>
          </div>
          <div className="bg-card rounded-lg shadow-card p-5 border-l-4 border-l-destructive">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase text-muted-foreground">NFs Pendentes</span>
            </div>
            <p className="text-2xl font-bold font-mono text-card-foreground">{d.pendingInvoices}</p>
          </div>
          <div className="bg-card rounded-lg shadow-card p-5 border-l-4 border-l-status-ok">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase text-muted-foreground">Total Recebido</span>
            </div>
            <p className="text-2xl font-bold font-mono text-card-foreground">{formatCurrency(d.totalPaid)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="bg-card rounded-lg shadow-card p-5 lg:col-span-1">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Linha do Tempo</h3>
            <div className="space-y-4">
              {d.timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${timelineIcon[item.status]} mt-1`} />
                    {i < d.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-card-foreground">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.date} · {formatCurrency(item.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invoices */}
          <div className="bg-card rounded-lg shadow-card lg:col-span-2">
            <div className="p-5 border-b">
              <h3 className="text-sm font-semibold text-card-foreground">Notas Fiscais Pendentes</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Período</TableHead>
                  <TableHead className="text-xs text-right">Valor</TableHead>
                  <TableHead className="text-xs">Vencimento</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {d.pendingInvoicesList.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm">{inv.period}</TableCell>
                    <TableCell className="text-sm font-mono text-right">{formatCurrency(inv.amount)}</TableCell>
                    <TableCell className="text-xs font-mono">{inv.dueDate}</TableCell>
                    <TableCell><StatusBadge status={inv.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-card rounded-lg shadow-card">
          <div className="p-5 border-b">
            <h3 className="text-sm font-semibold text-card-foreground">Histórico de Pagamentos</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Competência</TableHead>
                <TableHead className="text-xs text-right">Bruto</TableHead>
                <TableHead className="text-xs text-right">Impostos</TableHead>
                <TableHead className="text-xs text-right">Líquido</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.paymentHistory.map((p) => (
                <TableRow key={p.period}>
                  <TableCell className="text-sm font-medium">{p.period}</TableCell>
                  <TableCell className="text-sm font-mono text-right">{formatCurrency(p.gross)}</TableCell>
                  <TableCell className="text-sm font-mono text-right text-destructive">{formatCurrency(p.taxes)}</TableCell>
                  <TableCell className="text-sm font-mono text-right font-semibold">{formatCurrency(p.net)}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </div>
      </div>
    </AppLayout>
  );
}
