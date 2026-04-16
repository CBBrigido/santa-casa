import { useState } from "react";
import { Download, CheckCircle, FileText, Receipt, Building2, Calendar, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { billedPayments } from "@/data/mockData";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");

// Only show payments with status "Faturado"
const faturadoPayments = billedPayments.filter(p => p.status === "Faturado");

interface Payment {
  id: number;
  provider: string;
  amount: number;
  date: string;
  status: string;
  type: string;
}

// ──────────────────────────────────────────────
// Receipt modal
// ──────────────────────────────────────────────
function ReceiptModal({
  payment,
  onClose,
}: {
  payment: Payment | null;
  onClose: () => void;
}) {
  if (!payment) return null;
  const iss    = payment.amount * 0.05;
  const irrf   = payment.amount * 0.075;
  const inss   = payment.amount * 0.11;
  const pis    = payment.amount * 0.0065;
  const totalDeductions = iss + irrf + inss + pis;
  const net    = payment.amount - totalDeductions;
  const receiptNumber = `RC-2026-${String(payment.id).padStart(5, "0")}`;

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    const lines = [
      "RECIBO DE PAGAMENTO DE HONORÁRIOS MÉDICOS",
      "Santa Casa – Sistema de Gestão de Honorários",
      "",
      `Recibo Nº: ${receiptNumber}`,
      `Data de Emissão: ${formatDate(payment.date)}`,
      "",
      "DADOS DO PRESTADOR",
      `Prestador: ${payment.provider}`,
      `Tipo de Serviço: ${payment.type}`,
      "",
      "DEMONSTRATIVO FINANCEIRO",
      `Valor Bruto:         ${formatCurrency(payment.amount)}`,
      `ISS (5%):            -${formatCurrency(iss)}`,
      `IRRF (7,5%):         -${formatCurrency(irrf)}`,
      `INSS (11%):          -${formatCurrency(inss)}`,
      `PIS (0,65%):         -${formatCurrency(pis)}`,
      `Total de Deduções:   -${formatCurrency(totalDeductions)}`,
      "",
      `VALOR LÍQUIDO:       ${formatCurrency(net)}`,
      "",
      "Documento gerado pelo Sistema de Honorários Médicos.",
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recibo_${receiptNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={!!payment} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Receipt header */}
        <div className="bg-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Recibo de Pagamento</span>
          </div>
          <p className="text-xs opacity-70">Santa Casa – Honorários Médicos</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Receipt metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-3.5 w-3.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wide">Recibo Nº</p>
                <p className="font-mono font-semibold text-card-foreground">{receiptNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wide">Data de Emissão</p>
                <p className="font-semibold text-card-foreground">{formatDate(payment.date)}</p>
              </div>
            </div>
          </div>

          {/* Provider */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-xs">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Prestador</p>
              <p className="font-semibold text-card-foreground">{payment.provider}</p>
              <p className="text-muted-foreground">{payment.type}</p>
            </div>
          </div>

          {/* Financial breakdown */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Demonstrativo</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Bruto</span>
                <span className="font-mono font-semibold">{formatCurrency(payment.amount)}</span>
              </div>
              <div className="border-t pt-1.5 space-y-1 text-destructive/80">
                {[
                  ["ISS (5%)",    iss],
                  ["IRRF (7,5%)", irrf],
                  ["INSS (11%)",  inss],
                  ["PIS (0,65%)", pis],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span>{label as string}</span>
                    <span className="font-mono">- {formatCurrency(val as number)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-1.5 flex justify-between text-[11px]">
                <span className="text-muted-foreground">Total de Deduções</span>
                <span className="font-mono text-destructive">- {formatCurrency(totalDeductions)}</span>
              </div>
            </div>

            {/* Net value */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-sm font-semibold text-emerald-800">Valor Líquido</span>
              <span className="text-lg font-bold font-mono text-emerald-700">{formatCurrency(net)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={handlePrint}>
              <FileText className="h-3.5 w-3.5" />
              Imprimir
            </Button>
            <Button size="sm" className="flex-1 gap-1.5 text-xs" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5" />
              Baixar Recibo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────
// Main dialog
// ──────────────────────────────────────────────
interface BilledPaymentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BilledPaymentsDialog({ open, onOpenChange }: BilledPaymentsDialogProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const total = faturadoPayments.reduce((s, p) => s + p.amount, 0);


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Valor Faturado — Detalhamento de Pagamentos
            </DialogTitle>
            <DialogDescription className="text-xs">
              Registros com status <strong>Faturado</strong>. Clique em um registro para visualizar o recibo.
            </DialogDescription>
          </DialogHeader>

          {/* Summary */}
          <div className="flex gap-4 py-3 border-y">
            <div className="flex-1 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total Faturado</p>
              <p className="text-lg font-bold font-mono text-card-foreground">{formatCurrency(total)}</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Registros</p>
              <p className="text-lg font-bold text-card-foreground">{faturadoPayments.length}</p>
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Valor Médio</p>
              <p className="text-lg font-bold font-mono text-card-foreground">
                {formatCurrency(total / faturadoPayments.length)}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">Prestador</TableHead>
                  <TableHead className="text-xs">Tipo</TableHead>
                  <TableHead className="text-xs">Data</TableHead>
                  <TableHead className="text-xs text-right">Valor</TableHead>
                  <TableHead className="text-xs text-center">Recibo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faturadoPayments.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/50">
                    <TableCell className="text-xs text-muted-foreground">{p.id}</TableCell>
                    <TableCell className="text-sm font-medium">{p.provider}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.type}</TableCell>
                    <TableCell className="text-xs font-mono">{formatDate(p.date)}</TableCell>
                    <TableCell className="text-sm font-mono text-right font-semibold">
                      {formatCurrency(p.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => setSelectedPayment(p)}
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        Ver recibo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Total: <span className="font-semibold font-mono text-card-foreground">{formatCurrency(total)}</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt modal */}
      <ReceiptModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </>
  );
}
