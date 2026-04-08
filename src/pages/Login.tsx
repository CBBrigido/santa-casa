import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, UserCog, Stethoscope } from "lucide-react";

type Role = "admin" | "doctor";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    login(selectedRole);
    navigate(selectedRole === "admin" ? "/" : "/doctor");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(220 20% 97%)" }}>
      {/* Painel esquerdo — branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12"
        style={{ background: "hsl(220 53% 14%)" }}
      >
        <img
          src="/logo.png"
          alt="Santa Casa Porto Alegre"
          className="w-72 mb-10"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <p className="text-white/60 text-sm text-center max-w-xs leading-relaxed">
          Sistema de Gestão de Honorários Médicos
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo mobile */}
        <div className="lg:hidden mb-10">
          <img
            src="/logo.png"
            alt="Santa Casa Porto Alegre"
            className="w-48"
          />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "hsl(220 53% 20%)" }}>
            Bem-vindo
          </h1>
          <p className="text-sm text-gray-500 mb-8">Acesse sua conta para continuar</p>

          {/* Seleção de perfil */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all"
              style={{
                borderColor: selectedRole === "admin" ? "hsl(220 53% 26%)" : "hsl(220 15% 88%)",
                background: selectedRole === "admin" ? "hsl(220 53% 26%)" : "white",
                color: selectedRole === "admin" ? "white" : "hsl(220 40% 30%)",
              }}
            >
              <UserCog className="h-6 w-6" />
              <span className="text-xs font-semibold">Administrador</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("doctor")}
              className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all"
              style={{
                borderColor: selectedRole === "doctor" ? "hsl(220 53% 26%)" : "hsl(220 15% 88%)",
                background: selectedRole === "doctor" ? "hsl(220 53% 26%)" : "white",
                color: selectedRole === "doctor" ? "white" : "hsl(220 40% 30%)",
              }}
            >
              <Stethoscope className="h-6 w-6" />
              <span className="text-xs font-semibold">Médico</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220 40% 25%)" }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="seu@email.com.br"
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
                style={{
                  borderColor: "hsl(220 15% 88%)",
                  background: "white",
                  color: "hsl(220 40% 15%)",
                }}
                onFocus={(e) => e.target.style.borderColor = "hsl(220 53% 26%)"}
                onBlur={(e) => e.target.style.borderColor = "hsl(220 15% 88%)"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "hsl(220 40% 25%)" }}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-lg border text-sm outline-none transition-all"
                  style={{
                    borderColor: "hsl(220 15% 88%)",
                    background: "white",
                    color: "hsl(220 40% 15%)",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "hsl(220 53% 26%)"}
                  onBlur={(e) => e.target.style.borderColor = "hsl(220 15% 88%)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 mt-2"
              style={{ background: "hsl(220 53% 26%)" }}
            >
              Entrar como {selectedRole === "admin" ? "Administrador" : "Médico"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Santa Casa de Misericórdia de Porto Alegre
          </p>
        </div>
      </div>
    </div>
  );
}
