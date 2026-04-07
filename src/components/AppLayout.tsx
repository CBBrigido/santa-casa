import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useRole } from "@/contexts/RoleContext";
import { Bell, ArrowLeftRight } from "lucide-react";
import { FloatingChat } from "@/components/FloatingChat";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const { role, toggleRole } = useRole();
  const navigate = useNavigate();

  const handleToggle = () => {
    toggleRole();
    if (role === "admin") {
      navigate("/doctor");
    } else {
      navigate("/");
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shadow-card">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <button
                onClick={handleToggle}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/50 hover:bg-muted transition-colors text-sm"
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground text-xs font-medium">
                  {role === "admin" ? "Admin" : "Médico"}
                </span>
                <span className="h-2 w-2 rounded-full" style={{ background: role === "admin" ? "hsl(210 70% 50%)" : "hsl(160 50% 45%)" }} />
              </button>

              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-foreground">
                  {role === "admin" ? "AD" : "CS"}
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
      {role === "doctor" && <FloatingChat />}
    </SidebarProvider>
  );
}
