import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Building2 } from "lucide-react";

type UserRole = "admin" | "rh" | "employee";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

// Utilisateurs mock pour la démo
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@erp.com",
    password: "admin123",
    name: "Admin Principal",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    email: "rh@erp.com",
    password: "rh123",
    name: "Responsable RH",
    role: "rh" as UserRole,
  },
  {
    id: "3",
    email: "employe@erp.com",
    password: "emp123",
    name: "Jean Dupont",
    role: "employee" as UserRole,
  },
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simulation d'authentification avec JWT (normalement fait par le micro-service auth)
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-blue-900">Mini-ERP RH</CardTitle>
          <CardDescription>
            Gestion des employés et des ressources humaines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700">
              Se connecter
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 mb-2">Comptes de test :</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>Admin: admin@erp.com / admin123</p>
                <p>RH: rh@erp.com / rh123</p>
                <p>Employé: employe@erp.com / emp123</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
