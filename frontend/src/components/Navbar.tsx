import { Building2, LogOut, Moon, Sun, User, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface NavbarProps {
  onLogout: () => void;
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
  userRole: 'admin' | 'hr' | 'employee';
  onProfileClick: () => void;
  onMenuClick: () => void;
}

export function Navbar({ onLogout, onThemeToggle, theme, userRole, onProfileClick, onMenuClick }: NavbarProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'Ressources Humaines';
      case 'employee': return 'Employé';
      default: return role;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="size-6" />
          </Button>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="size-5 md:size-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-gray-900 dark:text-white">RHConnect</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(userRole)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="size-5" />
            ) : (
              <Sun className="size-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onProfileClick}
            className="rounded-full"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="size-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}