import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Sidebar, type Page } from "../components/Sidebar";
import { RhDashboard } from "./RhDashboard";
import { Employees } from "./Employees";
import { LeaveManagement } from "./LeaveManagement";
import { Reports } from "./Reports";
import { Settings } from "./Settings";
import { Profile } from "./Profile";
import { Toaster } from "../components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { TaskManagement } from "./Tasks"; // NOUVEAU: Import de la gestion des tâches

export function PageRhDashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        userRole="hr"
        theme={theme}
        onMenuClick={() => setIsSidebarOpen(true)}
        onThemeToggle={() => {
          setTheme(theme === "light" ? "dark" : "light");
          document.documentElement.classList.toggle("dark");
        }}
        onLogout={() => {
          localStorage.clear();
          navigate("/");
        }}
        onProfileClick={() => setCurrentPage("profile")}
      />

      <div className="flex">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userRole="hr"  // ✅ corrigé
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-64 mt-16 p-4 md:p-6 lg:p-8">
          {currentPage === "dashboard" && <RhDashboard />}
          {currentPage === "employees" && <Employees />}
          {currentPage === "leaves" && <LeaveManagement userRole="hr" />}
          {currentPage === "reports" && <Reports />}
          {currentPage === "settings" && <Settings />}
          {currentPage === "profile" && <Profile />}
          {currentPage === "tasks" && <TaskManagement />} {/* NOUVEAU: Page de gestion des tâches */}
        </main>
      </div>

      <Toaster />
    </div>
  );
}