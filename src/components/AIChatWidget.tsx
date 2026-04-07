import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const fakeResponses: Record<string, string> = {
  default:
    "Entendi sua dúvida! Com base nos seus registros, posso informar que todos os pagamentos estão sendo processados conforme a tabela CBHPM vigente. Caso identifique alguma divergência, você pode clicar em **Solicitar Revisão** no painel acima.",
  glosa:
    "As glosas identificadas no seu extrato referem-se a procedimentos que não atenderam aos critérios de elegibilidade do convênio. Recomendo verificar a documentação enviada e, se necessário, solicitar uma revisão formal pelo botão acima.",
  pagamento:
    "Seu próximo pagamento está previsto para o **dia 25 deste mês**. O valor estimado é de **R$ 12.500,00**, já descontados os impostos (ISS, IRRF e INSS). Você pode acompanhar o status em tempo real na aba de linha do tempo.",
  nota:
    "Para emitir a nota fiscal, utilize os dados do tomador disponíveis no menu **Notas Fiscais**. O prazo para envio é de até 5 dias úteis antes da data de pagamento.",
  imposto:
    "Os impostos retidos são: **ISS (5%)**, **IRRF (variável conforme faixa)** e **INSS (11%)**. O detalhamento completo está disponível no seu histórico de pagamentos acima.",
};

function getFakeResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("glosa") || lower.includes("negado") || lower.includes("negada")) return fakeResponses.glosa;
  if (lower.includes("pagamento") || lower.includes("receber") || lower.includes("quando")) return fakeResponses.pagamento;
  if (lower.includes("nota") || lower.includes("nf") || lower.includes("fiscal")) return fakeResponses.nota;
  if (lower.includes("imposto") || lower.includes("taxa") || lower.includes("irrf") || lower.includes("iss")) return fakeResponses.imposto;
  return fakeResponses.default;
}

export function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "Olá, Dr.! Sou o assistente de honorários. Como posso ajudá-lo hoje? Pergunte sobre pagamentos, glosas, impostos ou notas fiscais.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getFakeResponse(currentInput),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="bg-card rounded-lg shadow-card flex flex-col h-[420px]">
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
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-card-foreground rounded-bl-sm"
              }`}
            >
              {msg.content.split("**").map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
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
            placeholder="Pergunte sobre seus honorários..."
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
