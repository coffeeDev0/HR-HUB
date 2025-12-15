import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  CalendarDays,
  BarChart,
  Settings,
  User,
  ClipboardList
} from "lucide-react";

// 1️⃣ — Définition stricte des pages possibles
export type Page =
  | "dashboard"
  | "employees"
  | "leaves"
  | "reports"
  | "settings"
  | "profile"
  | "tasks";

// 2️⃣ — Props du Sidebar
interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: "admin" | "employee" | "hr";
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  currentPage,
  onNavigate,
  userRole,
  isOpen,
  onClose,
}: SidebarProps) {
  const navigate = useNavigate();


  const menu = [
    { id: "dashboard" as Page, label: "Dashboard", icon: Home },
    { id: "employees" as Page, label: "Employees", icon: Users, roles: ["admin", "hr"] },
    { id: "leaves" as Page, label: "Leave Management", icon: CalendarDays,roles: ["admin", "hr"] },
    { id: "reports" as Page, label: "Reports", icon: BarChart, roles: ["admin", "hr"] },
    { id: "settings" as Page, label: "Settings", icon: Settings, roles: ["admin"] },
    { id: "profile" as Page, label: "Profile", icon: User },
    { id: 'tasks' as Page, label: 'Tâches', icon: ClipboardList, roles: ['admin', 'hr', 'employee'] },

  ];

  return (
  <aside
  className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform
  ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
>
 


  <div className="h-full pt-10">
    <nav className="px-4 py-10 space-y-3">
      {menu
        .filter(item => !item.roles || item.roles.includes(userRole))
        .map(item => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg
              text-left transition
              ${
                currentPage === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
    </nav>
  </div>
</aside>


  );
}
