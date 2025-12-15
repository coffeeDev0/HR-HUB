
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button} from "./ui/button";
import { CheckCircle, Clock, AlertCircle, Star } from "lucide-react";

export function TaskCard({ task, userRole, onEvaluate }) {
  const statusColor = {
    pending: "bg-yellow-500",
    in_progress: "bg-blue-500",
    completed: "bg-green-600",
    canceled: "bg-red-500"
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {task.name}
          <Badge className={statusColor[task.status]}>{task.status}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-gray-600">{task.description}</p>

        <div className="text-sm text-gray-500">
          Début : {new Date(task.startDate).toLocaleDateString()}
        </div>

        {task.endDate && (
          <div className="text-sm text-gray-500">
            Fin : {new Date(task.endDate).toLocaleDateString()}
          </div>
        )}

        {/* Bouton d’évaluation pour RH */}
        {userRole === "hr" && task.status === "completed" && (
          <Button className="mt-3 w-full bg-purple-600" onClick={onEvaluate}>
            <Star className="size-4 mr-2" />
            Évaluer
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
