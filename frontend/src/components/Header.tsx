import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { User } from '../App';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const ROLE_LABELS = {
  admin: 'Administrateur',
  rh: 'Ressources Humaines',
  employee: 'Employé'
};

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-800 border-red-300',
  rh: 'bg-blue-100 text-blue-800 border-blue-300',
  employee: 'bg-green-100 text-green-800 border-green-300'
};

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-600">Bienvenue, {user.name}</h2>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className={ROLE_COLORS[user.role]}>
            {ROLE_LABELS[user.role]}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <UserIcon className="w-4 h-4" />
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="w-4 h-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
