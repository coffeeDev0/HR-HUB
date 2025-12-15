// === Reports.tsx (version simplifiée uniquement congés + employés) ===

import React, { useState, useEffect } from "react"; // Correction des imports
import jsPDF from "jspdf";
import { FileDown, FileText, Loader2 } from "lucide-react";
import { userApi } from "../api/userApi";
import { demandeApi } from "../api/demandeApi";
import { UserDTO } from "../api/userApi";
import { DemandeDTO } from "../api/demandeApi";

// --- UI Components ---
const Card = ({ children }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">{children}</div>
);
const CardHeader = ({ children }: any) => <div className="p-6 pb-2">{children}</div>;
const CardTitle = ({ children, className = "" }: any) => (
  <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>{children}</h2>
);
const CardDescription = ({ children }: any) => (
  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{children}</p>
);
const CardContent = ({ children, className = "" }: any) => <div className={`p-6 pt-4 ${className}`}>{children}</div>;

const Button = ({ children, onClick, variant = "default" }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
      variant === "outline"
        ? "border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }`}
  >
    {children}
  </button>
);

// ID RH
const stored = localStorage.getItem("user");
const currentUser = stored ? JSON.parse(stored) : null;
const rhId = currentUser?.userId;
const rhRole = currentUser?.role; // Récupérer le rôle de l'utilisateur

export default function Reports() {
  const [reportType, setReportType] = useState("leaves"); // leaves | employees
  const [employers, setEmployers] = useState<UserDTO[]>([]);
  const [demands, setDemands] = useState<DemandeDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // === Fetch data ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Load employés
        const emp = await userApi.getRhEmployers(rhId);
        setEmployers(emp);

        // Load demandes congés
        if (rhRole === "RH") {
          console.log(rhRole)
          const dem = await demandeApi.getRhRequest(rhId);
          setDemands(dem);
        } else if (rhRole === "ADMIN") {
          const dem = await demandeApi.getAll();
          console.log("OKAY")
          setDemands(dem);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rhId, rhRole]);

  
  const leaveRows = demands.map((d) => {
    const emp = employers.find((e) => e.userId === d.employerId);
    return {
      ...d,
      fullName: emp ? `${emp.userPrenom} ${emp.userName}` : "Employé",
    };
  })

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);

    if (reportType === "employees") {
      doc.text("Rapport des employés", 10, 10);
      let y = 20;
      employers.forEach((emp) => {
        doc.text(`• ${emp.userPrenom} ${emp.userName} — ${emp.profession || "N/A"} — ${emp.status || "Actif"}`, 10, y);
        y += 10;
      });
    } else {
      doc.text("Rapport des congés", 10, 10);
      let y = 20;
      leaveRows.forEach((d) => {
        doc.text(`• ${d.fullName || "Employé"} (${d.dateDebut} → ${d.dateFin}) — ${d.status}`, 10, y);
        y += 10;
      });
    }

    doc.save(`rapport-${reportType}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold">Rapports RH</h1>

      {/* === PARAMETRES === */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" /> Paramètres
          </CardTitle>
          <CardDescription>Choisissez le type de rapport.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="p-2 border rounded bg-gray-100 dark:bg-gray-700"
          >
            <option value="leaves">Congés</option>
            <option value="employees">Employés</option>
          </select>

          <div className="flex gap-3">
            <Button onClick={handleExportPDF}><FileDown className="size-4" /> Exporter PDF</Button>
            <Button variant="outline"><FileDown className="size-4" /> Exporter CSV</Button>
          </div>
        </CardContent>
      </Card>

      {/* === TABLE === */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des données</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex items-center justify-center text-blue-500">
              <Loader2 className="animate-spin mr-2" /> Chargement...
            </div>
          ) : reportType === "employees" ? (
            // --- TABLE EMPLOYES ---
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs uppercase">Employé</th>
                    <th className="py-3 px-4 text-left text-xs uppercase">Profession</th>
                    <th className="py-3 px-4 text-left text-xs uppercase">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {employers.map((emp) => (
                    <tr key={emp.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">{emp.userPrenom} {emp.userName}</td>
                      <td className="px-4 py-3">{emp.profession || "N/A"}</td>
                      <td className="px-4 py-3">{emp.status || "Actif"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!employers.length && (
                <p className="text-center py-6 text-gray-500">Aucun employé trouvé.</p>
              )}
            </div>
          ) : (
            // --- TABLE CONGES ---
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs uppercase">Employé</th>
                    <th className="py-3 px-4 text-left text-xs uppercase">Date début</th>
                    <th className="py-3 px-4 text-left text-xs uppercase">Date fin</th>
                    <th className="py-3 px-4 text-left text-xs uppercase">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {leaveRows.map((d) => (
                    <tr key={d.demandeId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">{d.fullName}</td>
                      <td className="px-4 py-3">{d.dateDebut}</td>
                      <td className="px-4 py-3">{d.dateFin}</td>
                      <td className="px-4 py-3">{d.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!leaveRows.length && (
                <p className="text-center py-6 text-gray-500">Aucune demande de congé trouvée.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { Reports };