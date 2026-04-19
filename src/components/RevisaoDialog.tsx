import { useState } from "react";
import { MessageSquare, CheckCircle2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const PROCEDIMENTOS = [
  { label: "Cirurgia Geral – cód. 30723013 – R$ 2.000,00", value: "cirurgia" },
  { label: "Anestesia – cód. 30101010 – R$ 1.500,00", value: "anestesia" },
  { label: "Ortopedia – cód. 30715016 – R$ 2.700,00", value: "ortopedia" },
];

const MOTIVOS = [
  "Falta de autorização prévia",
  "Código incompatível com o procedimento",
  "Documentação incompleta",
  "Valor divergente da tabela CBHPM",
  "Outro",
];

type Step = "form" | "success";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function RevisaoDialog({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("form");
  const [procedimento, setProcedimento] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fileName, setFileName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("success");
  }

  function handleClose() {
    setStep("form");
    setProcedimento("");
    setMotivo("");
    setDescricao("");
    setFileName("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {step === "form" ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-primary" />
                Solicitar Revisão de Glosa
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Procedimento */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Procedimento glosado <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={procedimento}
                  onChange={(e) => setProcedimento(e.target.value)}
                  className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring text-card-foreground"
                >
                  <option value="">Selecione o procedimento</option>
                  {PROCEDIMENTOS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Motivo */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Motivo da contestação <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring text-card-foreground"
                >
                  <option value="">Selecione o motivo</option>
                  {MOTIVOS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Descrição detalhada
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva os detalhes da contestação..."
                  rows={3}
                  className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none text-card-foreground"
                />
              </div>

              {/* Anexo */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Documentação de suporte
                </label>
                <label className="flex items-center gap-3 cursor-pointer border border-dashed border-border rounded-lg px-4 py-3 hover:bg-muted/60 transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground truncate">
                    {fileName || "Clique para anexar PDF, JPG ou PNG"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                  />
                </label>
              </div>

              {/* Info prazo */}
              <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
                <span className="text-primary text-sm">⏱️</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O prazo médio de análise é de <strong className="text-card-foreground">5 dias úteis</strong>. Você receberá uma notificação ao término.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={!procedimento || !motivo}>
                Enviar Solicitação
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-status-ok/10 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-status-ok" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-card-foreground mb-1">
                Solicitação enviada com sucesso!
              </h3>
              <p className="text-sm text-muted-foreground">
                Protocolo <strong className="text-card-foreground">#REV-2026-0419</strong> gerado.<br />
                Prazo de resposta: até 5 dias úteis.
              </p>
            </div>
            <Button size="sm" onClick={handleClose} className="mt-2">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
