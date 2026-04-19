import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step =
  | "welcome"
  | "ask_month"
  | "monthly_summary"
  | "glosa_summary"
  | "glosa_list"
  | "glosa_select"
  | "glosa_reason"
  | "glosa_confirm"
  | "continue"
  | "annual_summary";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  buttons?: { label: string; action: string }[];
  options?: string[];
}

const GLOSAS = [
  { name: "João Silva", value: "R$ 2.000,00", reason: "Falta de autorização" },
  { name: "Maria Souza", value: "R$ 1.500,00", reason: "Código incompatível" },
  { name: "Carlos Lima", value: "R$ 2.700,00", reason: "Documentação incompleta" },
];

const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function detectMonth(input: string): string | null {
  const lower = input.toLowerCase();
  for (const m of MONTHS) {
    if (lower.includes(m)) return m.charAt(0).toUpperCase() + m.slice(1);
  }
  return null;
}

function detectGlosa(lower: string) {
  return GLOSAS.find((g) =>
    g.name
      .toLowerCase()
      .split(" ")
      .some((part) => lower.includes(part))
  );
}

function renderContent(content: string) {
  return content.split("\n").map((line, lineIdx) => {
    const parts = line.split("**");
    return (
      <span key={lineIdx}>
        {parts.map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
        )}
        {lineIdx < content.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

const WELCOME =
  "Olá, Dr.! 👋 Sou o assistente de honorários.\n\nPosso te ajudar com:\n- Consultar valores do mês\n- Ver glosas\n- Acompanhar pagamentos\n\n👉 O que deseja?";

export function AIChatWidget() {
  const [step, setStep] = useState<Step>("welcome");
  const [month, setMonth] = useState("Março");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function pushUser(content: string) {
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content }]);
  }

  function pushAssistant(
    content: string,
    buttons?: { label: string; action: string }[],
    options?: string[]
  ) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), role: "assistant", content, buttons, options },
    ]);
  }

  function respond(
    nextStep: Step,
    content: string,
    buttons?: { label: string; action: string }[],
    options?: string[],
    then?: () => void
  ) {
    setIsTyping(false);
    setStep(nextStep);
    pushAssistant(content, buttons, options);
    if (then) setTimeout(then, 1500);
  }

  function processInput(userInput: string) {
    const lower = userInput.toLowerCase().trim();

    switch (step) {
      case "welcome": {
        if (
          lower.includes("honorário") ||
          lower.includes("mes") ||
          lower.includes("mês") ||
          lower.includes("valor")
        ) {
          respond("ask_month", "Claro! 📊\n\nQual mês você deseja consultar?");
        } else if (lower.includes("ano") || lower.includes("total")) {
          respond(
            "annual_summary",
            "📅 Resumo do Ano:\n\n- 💰 Total faturado: R$ 182.300,00\n- ✅ Total recebido: R$ 165.900,00\n- ⚠️ Em análise (glosas): R$ 16.400,00\n\n👉 Deseja detalhar por mês ou buscar por paciente?"
          );
        } else if (lower.includes("glosa")) {
          respond("ask_month", "Claro! 📊\n\nQual mês você deseja consultar?");
        } else {
          respond(
            "welcome",
            "Entendido! Posso te ajudar com honorários, glosas ou pagamentos. O que deseja consultar?"
          );
        }
        break;
      }

      case "ask_month": {
        const m = detectMonth(userInput) ?? "Março";
        setMonth(m);
        respond(
          "monthly_summary",
          `Perfeito, Dr.! Aqui está o resumo de ${m}:\n\n- 💰 Total faturado: R$ 48.500,00\n- ✅ Total pago: R$ 42.300,00\n- ⚠️ Total glosado: R$ 6.200,00\n\n👉 Deseja ver mais detalhes ou consultar glosas?`
        );
        break;
      }

      case "monthly_summary": {
        if (
          lower.includes("glosa") ||
          lower.includes("detalhe") ||
          lower.includes("sim") ||
          lower.includes("ver")
        ) {
          respond(
            "glosa_summary",
            `Sim, Dr. Foram identificadas 3 glosas em ${month}.\n\nPrincipais motivos:\n- Falta de autorização prévia\n- Divergência de código\n- Documentação incompleta\n\n👉 Deseja ver os detalhes?`
          );
        } else if (lower.includes("ano") || lower.includes("total")) {
          respond(
            "annual_summary",
            "📅 Resumo do Ano:\n\n- 💰 Total faturado: R$ 182.300,00\n- ✅ Total recebido: R$ 165.900,00\n- ⚠️ Em análise (glosas): R$ 16.400,00\n\n👉 Deseja detalhar por mês ou buscar por paciente?"
          );
        } else {
          respond(
            "monthly_summary",
            "Posso mostrar glosas, detalhes de pagamento ou consultar outro período. O que prefere?"
          );
        }
        break;
      }

      case "glosa_summary": {
        if (
          lower.includes("sim") ||
          lower.includes("ver") ||
          lower.includes("detalhe") ||
          lower.includes("quero")
        ) {
          respond(
            "glosa_list",
            `Aqui estão as glosas:\n\n1. 🗂️ João Silva\n   - Valor: R$ 2.000,00\n   - Motivo: Falta de autorização\n\n2. 🗂️ Maria Souza\n   - Valor: R$ 1.500,00\n   - Motivo: Código incompatível\n\n3. 🗂️ Carlos Lima\n   - Valor: R$ 2.700,00\n   - Motivo: Documentação incompleta\n\n👉 Deseja solicitar revisão de alguma?`,
            [{ label: "Solicitar Revisão", action: "solicitar_revisao" }]
          );
        } else {
          respond(
            "glosa_summary",
            "Ok! Se quiser ver os detalhes das glosas é só dizer. Posso ajudar com mais alguma coisa?"
          );
        }
        break;
      }

      case "glosa_list": {
        const matched = detectGlosa(lower);
        if (matched) {
          respond(
            "glosa_reason",
            `📌 Glosa selecionada: ${matched.name} – ${matched.value}\n\nInforme o motivo da contestação:`
          );
        } else if (
          lower.includes("sim") ||
          lower.includes("revisão") ||
          lower.includes("revisao") ||
          lower.includes("solicitar")
        ) {
          respond(
            "glosa_select",
            "Perfeito, Dr.! 👍\n\nSelecione a glosa que deseja revisar:",
            undefined,
            GLOSAS.map((g) => `${g.name} – ${g.value}`)
          );
        } else {
          respond(
            "glosa_list",
            "Para solicitar revisão, clique no botão ou informe o nome do paciente.",
            [{ label: "Solicitar Revisão", action: "solicitar_revisao" }]
          );
        }
        break;
      }

      case "glosa_select": {
        const matched = detectGlosa(lower);
        if (matched) {
          respond(
            "glosa_reason",
            `📌 Glosa selecionada: ${matched.name} – ${matched.value}\n\nInforme o motivo da contestação:`
          );
        } else {
          respond(
            "glosa_select",
            "Não encontrei essa glosa. Informe o nome do paciente: João Silva, Maria Souza ou Carlos Lima.",
            undefined,
            GLOSAS.map((g) => `${g.name} – ${g.value}`)
          );
        }
        break;
      }

      case "glosa_reason": {
        setIsTyping(false);
        setStep("glosa_confirm");
        pushAssistant(
          "Ótimo! 📎\n\nSua solicitação de revisão foi enviada com sucesso.\n\n⏱️ Prazo médio de análise: 5 dias úteis."
        );
        setTimeout(() => {
          setStep("continue");
          pushAssistant(
            "Posso ajudar com mais alguma coisa?\n\n- 📊 Ver outro mês\n- 📅 Consultar total do ano\n- 🧾 Ver notas fiscais"
          );
        }, 1800);
        break;
      }

      case "glosa_confirm":
      case "continue": {
        if (lower.includes("ano") || lower.includes("total")) {
          respond(
            "annual_summary",
            "📅 Resumo do Ano:\n\n- 💰 Total faturado: R$ 182.300,00\n- ✅ Total recebido: R$ 165.900,00\n- ⚠️ Em análise (glosas): R$ 16.400,00\n\n👉 Deseja detalhar por mês ou buscar por paciente?"
          );
        } else if (lower.includes("nota") || lower.includes("fiscal") || lower.includes("nf")) {
          respond(
            "continue",
            "Para emitir a nota fiscal, utilize os dados do tomador disponíveis no menu **Notas Fiscais**. O prazo para envio é de até 5 dias úteis antes da data de pagamento."
          );
        } else {
          respond("ask_month", "Claro! 📊\n\nQual mês você deseja consultar?");
        }
        break;
      }

      case "annual_summary": {
        if (lower.includes("mes") || lower.includes("mês")) {
          respond("ask_month", "Claro! 📊\n\nQual mês você deseja consultar?");
        } else {
          respond(
            "annual_summary",
            "Posso detalhar por mês ou ajudar com outro período. O que prefere?"
          );
        }
        break;
      }
    }
  }

  function handleAction(action: string) {
    if (action === "solicitar_revisao") {
      pushUser("Solicitar Revisão");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setStep("glosa_select");
        pushAssistant(
          "Perfeito, Dr.! 👍\n\nSelecione a glosa que deseja revisar:",
          undefined,
          GLOSAS.map((g) => `${g.name} – ${g.value}`)
        );
      }, 800);
    }
  }

  function handleOptionClick(option: string) {
    pushUser(option);
    setIsTyping(true);
    setTimeout(() => {
      processInput(option);
    }, 800);
  }

  const handleSend = () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    pushUser(userInput);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      processInput(userInput);
    }, 1000);
  };

  return (
    <div className="bg-card rounded-lg shadow-card flex flex-col h-[480px]">
      <div className="p-4 border-b flex items-center gap-2">
        <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Assistente de Honorários</h3>
          <p className="text-[11px] text-muted-foreground">IA · Disponível 24h</p>
        </div>
        <span className="ml-auto h-2 w-2 rounded-full bg-status-ok" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div className="flex flex-col gap-2 max-w-[82%]">
              <div
                className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "gradient-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-card-foreground rounded-bl-sm"
                }`}
              >
                {renderContent(msg.content)}
              </div>
              {msg.buttons && msg.buttons.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-1">
                  {msg.buttons.map((btn) => (
                    <button
                      key={btn.action}
                      onClick={() => handleAction(btn.action)}
                      className="text-xs font-medium px-3 py-1.5 rounded-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
              {msg.options && msg.options.length > 0 && (
                <div className="flex flex-col gap-1.5 pl-1">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionClick(opt)}
                      className="text-xs text-left font-medium px-3 py-1.5 rounded-lg border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-xl px-4 py-2.5 rounded-bl-sm">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 text-sm bg-muted rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <Button type="submit" size="sm" disabled={!input.trim()} className="px-3">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
