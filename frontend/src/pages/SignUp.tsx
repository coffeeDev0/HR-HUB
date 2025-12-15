import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

export function SignUp({ onSuccess, onLoginClick }: SignUpProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "employee" as "admin" | "hr" | "employee",
  });

  const navigate = useNavigate(); // Initialisation de useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    // Remplacez 'URL_DU_SERVICE_EMPLOYE' par l'URL de l'API de votre collègue
    try {
      const response = await fetch("http://10.131.139.74/rh/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Inscription réussie !");
        onSuccess();
        navigate("/dashboard"); // Redirection après succès
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Accès complet : gestion des employés, approbation des demandes, rapports et paramètres.";
      case "hr":
        return "Gestion RH : employés, demandes de congés/absences, rapports.";
      case "employee":
        return "Soumettre des demandes de congés, absences et démissions.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Building2 className="size-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">Créer un compte</CardTitle>
            <CardDescription className="mt-2">
              Rejoignez RHConnect et choisissez votre rôle
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Votre prénom"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Votre nom"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@entreprise.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "hr" | "employee") =>
                  setFormData({ ...formData, role: value })
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employé</SelectItem>
                  <SelectItem value="hr">Ressources Humaines (RH)</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                📋 <strong>Rôle sélectionné :</strong>{" "}
                {formData.role === "admin"
                  ? "Administrateur"
                  : formData.role === "hr"
                  ? "RH"
                  : "Employé"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {getRoleDescription(formData.role)}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700">
              S'inscrire
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-blue-600 hover:underline dark:text-blue-400">
                Se connecter
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
