import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Calendar, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { UserRole } from '../App';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  userRole: UserRole;
  userId: string;
}

// Données mock pour les statistiques
const STATS_DATA = {
  totalEmployees: 45,
  presentToday: 38,
  absentToday: 7,
  pendingLeaves: 5,
  approvedLeaves: 12,
  rejectedLeaves: 2,
};

const monthlyData = [
  { month: 'Jan', presences: 920, absences: 80 },
  { month: 'Fév', presences: 880, absences: 120 },
  { month: 'Mar', presences: 950, absences: 50 },
  { month: 'Avr', presences: 900, absences: 100 },
  { month: 'Mai', presences: 870, absences: 130 },
  { month: 'Juin', presences: 940, absences: 60 },
];

const leaveTypeData = [
  { name: 'Congés payés', value: 65, color: '#3b82f6' },
  { name: 'Maladie', value: 20, color: '#ef4444' },
  { name: 'Formation', value: 10, color: '#10b981' },
  { name: 'Autres', value: 5, color: '#f59e0b' },
];

export function Dashboard({ userRole, userId }: DashboardProps) {
  const isHRorAdmin = userRole === 'admin' || userRole === 'rh';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">Tableau de bord</h1>
        <p className="text-slate-600 mt-1">Vue d'ensemble des ressources humaines</p>
      </div>

      {/* Statistiques principales */}
      {isHRorAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-700">Total Employés</CardDescription>
              <CardTitle className="text-blue-900">{STATS_DATA.totalEmployees}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-blue-700">
                <Users className="w-4 h-4" />
                <span className="text-sm">Effectif total</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-700">Présents aujourd'hui</CardDescription>
              <CardTitle className="text-green-900">{STATS_DATA.presentToday}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{Math.round((STATS_DATA.presentToday / STATS_DATA.totalEmployees) * 100)}% de présence</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardDescription className="text-red-700">Absents aujourd'hui</CardDescription>
              <CardTitle className="text-red-900">{STATS_DATA.absentToday}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">{Math.round((STATS_DATA.absentToday / STATS_DATA.totalEmployees) * 100)}% d'absence</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardDescription className="text-orange-700">Congés en attente</CardDescription>
              <CardTitle className="text-orange-900">{STATS_DATA.pendingLeaves}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-orange-700">
                <Clock className="w-4 h-4" />
                <span className="text-sm">À valider</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isHRorAdmin && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Présences vs Absences (6 derniers mois)</CardTitle>
                <CardDescription>Analyse mensuelle de la présence</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="presences" fill="#3b82f6" name="Présences" />
                    <Bar dataKey="absences" fill="#ef4444" name="Absences" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Répartition des congés par type</CardTitle>
                <CardDescription>Distribution des demandes de congés</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Vue employé */}
        {userRole === 'employee' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Mes congés</CardTitle>
                <CardDescription>Solde de congés disponibles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Congés payés</span>
                    <span className="text-sm">15 / 25 jours</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">RTT</span>
                    <span className="text-sm">5 / 10 jours</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">10 jours restants jusqu'au 31/12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-slate-900">Mes demandes récentes</CardTitle>
                <CardDescription>Statut de vos demandes de congés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="text-sm">15-19 Mai 2025</p>
                      <p className="text-xs text-slate-600">Congés payés (5 jours)</p>
                    </div>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Approuvé</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <p className="text-sm">10-14 Juin 2025</p>
                      <p className="text-xs text-slate-600">Congés payés (5 jours)</p>
                    </div>
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">En attente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Activité récente */}
      {isHRorAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Activité récente</CardTitle>
            <CardDescription>Dernières actions dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Nouvelle demande de congé', user: 'Marie Leblanc', time: 'Il y a 5 min', type: 'leave' },
                { action: 'Employé ajouté', user: 'Pierre Martin', time: 'Il y a 1h', type: 'employee' },
                { action: 'Congé approuvé', user: 'Sophie Rousseau', time: 'Il y a 2h', type: 'approval' },
                { action: 'Absence déclarée', user: 'Luc Bernard', time: 'Il y a 3h', type: 'absence' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'leave' ? 'bg-blue-500' :
                    activity.type === 'employee' ? 'bg-green-500' :
                    activity.type === 'approval' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-slate-600">{activity.user}</p>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
