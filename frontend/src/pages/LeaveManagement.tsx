import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Check, X, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { demandeApi, DemandeDTO } from '../api/demandeApi';

interface LeaveManagementProps {
  userRole: 'admin' | 'hr' | 'employee';
}

export function LeaveManagement({ userRole }: LeaveManagementProps) {
  const [requests, setRequests] = useState<DemandeDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const stored = localStorage.getItem('user');
  const currentUser = stored ? JSON.parse(stored) : null;
  const rhId = currentUser?.userId;

  const canManageRequests = userRole === 'admin' || userRole === 'hr';

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await demandeApi.getRhRequest(rhId);
      setRequests(data);
    } catch (err) {
      toast.error("Impossible de charger les demandes");
    }
  }

  async function handleEvaluate(d: DemandeDTO, status: "ACCEPTEE" | "REFUSEE") {
    if (!rhId) {
      toast.error("Session invalide : RH ID manquant");
      return;
    }

    try {
      console.log("Demande évaluée :", status,rhId);
      await demandeApi.evaluate(d.demandeId, {
        status: status === "ACCEPTEE" ? "ACCEPTEE" : "REFUSEE",
        rhId,
        commentaire: status === "ACCEPTEE" ? "Requête valable" : "Requête non valable",
      });
      console.log("Demande évaluée :", d.demandeId, status);
      toast.success(`Demande ${status === "ACCEPTEE" ? "approuvée" : "refusée"}`);
      loadRequests();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  }

  async function handleDelete(d: DemandeDTO) {
    if (!confirm("Supprimer cette demande ?")) return;

    try {
      await demandeApi.remove(d.demandeId);
      toast.success("Demande supprimée");
      loadRequests();
    } catch (err) {
      toast.error("Impossible de supprimer la demande");
    }
  }

  const filteredRequests = requests.filter(d =>
    d.employerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.raison?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
  switch (status) {
    case "EN COURS":
      return <Badge className="bg-orange-100 text-orange-700">En attente</Badge>;
    case "ACCEPTEE":
      return <Badge className="bg-green-100 text-green-700">Approuvée</Badge>;
    case "REFUSEE":
      return <Badge className="bg-red-100 text-red-700">Refusée</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
};

const isPending = (status: string) =>
  status === "EN_ATTENTE" || status === "EN COURS";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white">
            Gestion des Demandes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {requests.length} demandes au total
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Rechercher par employé ou raison..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="size-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Employé</th>
                  <th className="text-left py-3 px-4">Raison</th>
                  <th className="text-left py-3 px-4">Période</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  {canManageRequests && <th className="text-left py-3 px-4">Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.demandeId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50">
                    <td className="py-3 px-4">{req.employerId}</td>
                    <td className="py-3 px-4">{req.raison}</td>
                    <td className="py-3 px-4">
                      {new Date(req.dateDebut).toLocaleDateString()} → {new Date(req.dateFin).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(req.status)}</td>

                    {canManageRequests && (
                      <td className="py-3 px-4 flex gap-2">

                        {isPending(req.status) && (
                          <>
                            {/* Approuver */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEvaluate(req, "ACCEPTEE")}
                              className="text-green-600 hover:text-green-700"
                              title="Approuver"
                            >
                              <Check className="size-4" />
                            </Button>

                            {/* Refuser */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEvaluate(req, "REFUSEE")}
                              className="text-red-600 hover:text-red-700"
                              title="Refuser"
                            >
                              <X className="size-4" />
                            </Button>
                          </>
                        )}

                        {/* Supprimer */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(req)}
                          className="text-gray-500 hover:text-red-600"
                          title="Supprimer"
                        >
                          <X className="size-4" />
                        </Button>

                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
