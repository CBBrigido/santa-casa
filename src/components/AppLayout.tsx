import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import { FloatingChat } from "@/components/FloatingChat";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const { role } = useRole();
  const { role: authRole } = useAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shadow-card">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: "hsl(220 53% 26% / 0.1)",
                  color: "hsl(220 53% 26%)",
                }}
              >
                {authRole === "admin" ? "Administrador" : "Médico"}
              </span>
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ background: "hsl(220 53% 26%)" }}
              >
                <span className="text-xs font-semibold text-white">
                  {authRole === "admin" ? "AD" : "MD"}
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
