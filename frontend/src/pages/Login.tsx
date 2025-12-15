import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Building2 } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {}

export function Login({}: LoginProps) {
  const [userMail, setUserMail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Tentative de connexion pour :", userMail);
      const response = await fetch("http://10.152.224.91:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMail, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Identifiants invalides");
        return;
      }

      const data = await response.json();
      toast.success("Connexion réussie !");

      // Sauvegarde du token
      if (data.token) localStorage.setItem("authToken", data.token);

      //  Récupération des infos utilisateur (inclut le rôle)
      const userRes = await fetch(`http://10.152.224.91:8085/user/email/${userMail}`);
      
      if (!userRes.ok) {
        toast.error("Impossible de récupérer les données utilisateur.");
        return;
      }

      const userData = await userRes.json();
      console.log(userData)

      // Stockage des infos
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("role", userData.role);

      // Redirection AUTOMATIQUE selon le vrai rôle récupéré
      switch (userData.role) {
        case "ADMIN":
          navigate("/admin");
          break;
       
        case "RH":
          navigate("/rh");
          break;
        case "EMPLOYER":
          navigate("/employee");
          break;
        default:
          toast.error("Rôle utilisateur inconnu");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur réseau lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Building2 className="size-12 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl">HR-HUB</CardTitle>
            <CardDescription className="mt-2">
              Connectez-vous à votre espace
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@entreprise.com"
                value={userMail}
                onChange={(e) => setUserMail(e.target.value)}
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

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Connexion"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
