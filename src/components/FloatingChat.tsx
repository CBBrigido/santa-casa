import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { AIChatWidget } from "./AIChatWidget";

export function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[380px] animate-fade-in shadow-elevated rounded-xl overflow-hidden">
          <AIChatWidget />
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full gradient-primary shadow-elevated flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </button>
    </>
  );
}
