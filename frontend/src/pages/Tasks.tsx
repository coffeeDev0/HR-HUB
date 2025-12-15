import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { taskApi, TaskDTO, TaskPayload, UserDTO } from '../api/TaskApi';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Loader2, Plus, Edit, Trash2, UserPlus, CheckCircle, Clock, FileText, Download, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const getCurrentUser = () => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch (e) {
        return null;
    }
};

const getCurrentUserRole = () => {
    const user = getCurrentUser();
    return user?.role || "employee";
};

const getCurrentUserEmail = () => {
    const user = getCurrentUser();
    return user?.email || "default@example.com";
};

interface TaskCardProps {
    task: TaskDTO;
    role: string;
    currentUserId: string;
    onEdit: (task: TaskDTO) => void;
    onDelete: (taskId: string) => void;
    onAssign: (task: TaskDTO) => void;
    onEvaluate: (task: TaskDTO, isComplete: boolean) => void;
    onFileUploaded: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, role, currentUserId, onEdit, onDelete, onAssign, onEvaluate, onFileUploaded }) => {
    const [isUploading, setIsUploading] = useState(false);
    const rhActions = role === 'RH';
    const employeeActions = role === 'EMPLOYER';
    const adminActions = role === 'ADMIN';

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const BASE = "http://10.210.22.91:8086";
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        try {
            const response = await fetch(
                `${BASE}/fichiers?tacheId=${task.tacheId}&employerId=${currentUserId}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg);
            }

            toast.success(`Fichier "${file.name}" uploadé avec succès !`);
            onFileUploaded(task.tacheId);
        } catch (err: any) {
            toast.error("Erreur lors de l'upload", {
                description: err.message || "Erreur inconnue",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleEvaluation = (isComplete: boolean) => {
        onEvaluate(task, isComplete);
    };

    const statusClasses = {
        'NOUVEAU': 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-300 dark:border-blue-700',
        'EN_COURS': 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-300 dark:border-amber-700',
        'TERMINÉ': 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:text-emerald-300 dark:border-emerald-700',
        'ÉVALUÉ': 'bg-gradient-to-r from-cyan-50 to-cyan-100 text-cyan-700 border border-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30 dark:text-cyan-300 dark:border-cyan-700',
    };

    const priorityConfig = {
        1: { color: 'border-l-red-500', bgAccent: 'bg-red-50 dark:bg-red-900/10', label: 'HAUTE', icon: '🔴' },
        2: { color: 'border-l-amber-500', bgAccent: 'bg-amber-50 dark:bg-amber-900/10', label: 'MOYENNE', icon: '🟡' },
        3: { color: 'border-l-emerald-500', bgAccent: 'bg-emerald-50 dark:bg-emerald-900/10', label: 'BASSE', icon: '🟢' },
    };

    const getStatusClass = (status: string) => statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    const priority = priorityConfig[task.priorite as keyof typeof priorityConfig] || priorityConfig[3];

    const daysUntilDue = Math.ceil((new Date(task.dateFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;

    return (
        <Card className={`overflow-hidden border-l-4 ${priority.color} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] dark:hover:shadow-white/10 ${priority.bgAccent}`}>
            <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 truncate">
                            {task.nom}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(task.etat)} shadow-sm`}>
                                {task.etat}
                            </span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 shadow-sm">
                                {priority.icon} {priority.label}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                    {task.description}
                </p>

                <div className="grid grid-cols-2 gap-3 bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <div>
                            <div className="font-medium text-gray-500 dark:text-gray-400">Début</div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {new Date(task.dateDebut).toLocaleDateString('fr-FR')}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <Clock className={`w-4 h-4 flex-shrink-0 ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-amber-500' : 'text-blue-500'}`} />
                        <div>
                            <div className="font-medium text-gray-500 dark:text-gray-400">Échéance</div>
                            <div className={`font-semibold ${isOverdue ? 'text-red-600 dark:text-red-400' : isDueSoon ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                {new Date(task.dateFin).toLocaleDateString('fr-FR')}
                            </div>
                        </div>
                    </div>
                </div>

                {(isOverdue || isDueSoon) && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium ${isOverdue ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {isOverdue ? `En retard de ${Math.abs(daysUntilDue)} jour(s)` : `Échéance dans ${daysUntilDue} jour(s)`}
                    </div>
                )}

                <Separator className="my-3" />

                <div className="space-y-3">
                    <h4 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <FileText className="w-4 h-4" />
                        Fichiers ({task.fichiers.length})
                    </h4>
                    {task.fichiers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {task.fichiers.map((file) => (
                                <a
                                    key={file.id}
                                    href={taskApi.getFileUrl(file.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-all duration-200 hover:scale-105"
                                >
                                    <Download className="w-3 h-3" />
                                    {file.name}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">Aucun fichier attaché</p>
                    )}
                </div>

                <Separator className="my-3" />

                <div className="flex flex-wrap gap-2">
                    {(rhActions || adminActions) && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(task)}
                                className="text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            >
                                <Edit className="w-4 h-4 mr-1.5" /> Modifier
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(task.tacheId)}
                                className="text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 transition-all"
                            >
                                <Trash2 className="w-4 h-4 mr-1.5" /> Supprimer
                            </Button>
                        </>
                    )}

                    {rhActions && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onAssign(task)}
                                className="text-xs font-medium hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all"
                            >
                                <UserPlus className="w-4 h-4 mr-1.5" /> Attribuer
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleEvaluation(true)}
                                disabled={task.etat === 'ÉVALUÉ'}
                                className="text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-all disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4 mr-1.5" /> Évaluer
                            </Button>
                        </>
                    )}

                    {employeeActions && (
                        <div className="flex items-center space-x-2">
                            <Label
                                htmlFor={`file-upload-${task.tacheId}`}
                                className="text-xs cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 h-9 px-4 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-md"
                            >
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />}
                                Uploader Fichier
                            </Label>
                            <Input
                                id={`file-upload-${task.tacheId}`}
                                type="file"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={isUploading}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const TaskFormDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    taskToEdit: TaskDTO | null;
    onSave: (payload: TaskPayload) => void;
    rhId: string;
}> = ({ isOpen, onClose, taskToEdit, onSave, rhId }) => {
    const [formData, setFormData] = useState<TaskPayload>({
        nom: '',
        description: '',
        priorite: 1,
        dateFin: '',
        rhId: rhId,
    });
    const isEdit = !!taskToEdit;

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                nom: taskToEdit.nom,
                description: taskToEdit.description,
                priorite: taskToEdit.priorite,
                dateFin: taskToEdit.dateFin.substring(0, 16),
                rhId: taskToEdit.rhId,
            });
        } else {
            setFormData({
                nom: '',
                description: '',
                priorite: 1,
                dateFin: new Date().toISOString().substring(0, 16),
                rhId: rhId,
            });
        }
    }, [taskToEdit, rhId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === 'priorite' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.nom || !formData.dateFin) {
            toast.error("Veuillez remplir le nom et la date de fin.");
            return;
        }
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{isEdit ? 'Modifier la Tâche' : 'Créer une Nouvelle Tâche'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nom" className="font-semibold">Nom de la tâche</Label>
                        <Input id="nom" value={formData.nom} onChange={handleChange} className="border-2 focus:border-blue-500 transition" placeholder="Ex: Rapport mensuel" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="font-semibold">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={handleChange} className="border-2 focus:border-blue-500 transition min-h-[100px]" placeholder="Décrivez la tâche en détail..." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="priorite" className="font-semibold">Priorité</Label>
                        <select id="priorite" value={formData.priorite} onChange={handleChange} className="border-2 p-3 rounded-md dark:bg-gray-900 dark:border-gray-700 focus:border-blue-500 transition font-medium">
                            <option value={1}>🔴 Haute</option>
                            <option value={2}>🟡 Moyenne</option>
                            <option value={3}>🟢 Basse</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dateFin" className="font-semibold">Date d'échéance</Label>
                        <Input id="dateFin" type="datetime-local" value={formData.dateFin} onChange={handleChange} className="border-2 focus:border-blue-500 transition" />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="secondary" onClick={onClose}>Annuler</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">{isEdit ? 'Sauvegarder' : 'Créer'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface AssignEmployeesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    task: TaskDTO | null;
    employees: UserDTO[];
    onAssign: (taskId: string, employeeIds: string[]) => void;
}

export const AssignEmployeesDialog: React.FC<AssignEmployeesDialogProps> = ({
    isOpen,
    onClose,
    task,
    employees,
    onAssign,
}) => {
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Met à jour les employés sélectionnés quand la tâche change
    useEffect(() => {
        if (task && task.employers) {
            const ids = task.employers
                .map(e => e.employerId)
                .filter((id): id is string => !!id); // filtre les undefined
            setSelectedEmployeeIds(ids);
        } else {
            setSelectedEmployeeIds([]);
        }
    }, [task]);

    const toggleEmployee = (id: string) => {
        setSelectedEmployeeIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleAssign = () => {
        if (!task) return;
        setLoading(true);
        onAssign(task.tacheId, selectedEmployeeIds);
    };

    // Filtrage des employés avec employerId défini
    const employeesWithId = employees.filter((e): e is UserDTO & { employerId: string } => !!e.employerId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] dark:bg-gray-800 dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Attribuer : {task?.nom}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Sélectionner les employés :
                    </Label>

                    <div className="space-y-2">
                        {employeesWithId.map(employee => (
                            <div
                                key={employee.employerId}
                                className="flex items-center space-x-3 p-3 border-2 rounded-lg dark:border-gray-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                                onClick={() => toggleEmployee(employee.employerId)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedEmployeeIds.includes(employee.employerId)}
                                    onChange={() => toggleEmployee(employee.employerId)}
                                    className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5 cursor-pointer"
                                />
                                <Label className="font-medium cursor-pointer flex-1">
                                    {employee.email}
                                </Label>
                            </div>
                        ))}
                        {employeesWithId.length === 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                Aucun employé disponible
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Attribuer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const TaskManagement: React.FC = () => {
    const role = getCurrentUserRole();
    const userEmail = getCurrentUserEmail();

    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [employees, setEmployees] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskDTO | null>(null);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [taskToAssign, setTaskToAssign] = useState<TaskDTO | null>(null);

    const isRh = role === 'RH';
    const isAdmin = role === 'ADMIN';
    const isEmployee = role === 'EMPLOYER';

    const fetchUserId = useCallback(async () => {
        try {
            if (isRh) {
                const rhData = await taskApi.getRhByEmail(userEmail);
                if (rhData?.rhId) {
                    setCurrentUserId(rhData.rhId);
                }
            } else if (isEmployee) {
                const employerData = await taskApi.getEmployerByEmail(userEmail);
                if (employerData?.employerId) {
                    setCurrentUserId(employerData.employerId);
                }
            }
        } catch (error) {
            toast.error("Impossible de récupérer l'identifiant utilisateur.");
            console.error(error);
        }
    }, [isRh, isEmployee, userEmail]);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            let fetchedTasks: TaskDTO[] = [];
            if (isRh) {
                fetchedTasks = await taskApi.getRhTasks(userEmail);
            } else if (isEmployee) {
                fetchedTasks = await taskApi.getEmployeeTasks(userEmail);
            } else if (isAdmin) {
                fetchedTasks = await taskApi.getAllTasks();
            }
            setTasks(fetchedTasks);
        } catch (error) {
            toast.error("Échec du chargement des tâches.", { description: "Veuillez vérifier la connexion API." });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [role, userEmail, isRh, isEmployee, isAdmin]);

    const fetchEmployees = useCallback(async () => {
        if (!isRh) return;
        try {
            const fetchedEmployees = await taskApi.getAllEmployees();
            setEmployees(fetchedEmployees);
        } catch (error) {
            toast.warning("Impossible de charger la liste des employés pour l'attribution.");
            console.error(error);
        }
    }, [isRh]);

    useEffect(() => {
        fetchUserId();
    }, [fetchUserId]);

    useEffect(() => {
        fetchTasks();
        if (isRh) {
            fetchEmployees();
        }
    }, [fetchTasks, fetchEmployees, isRh]);

    const handleCreateClick = () => {
        setTaskToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (task: TaskDTO) => {
        setTaskToEdit(task);
        setIsFormOpen(true);
    };

    const handleSaveTask = async (payload: TaskPayload) => {
        try {
            if (taskToEdit) {
                await taskApi.updateTask(taskToEdit.tacheId, payload);
                toast.success("Tâche modifiée avec succès.");
            } else {
                await taskApi.createTask(payload);
                toast.success("Tâche créée avec succès.");
            }
            setIsFormOpen(false);
            fetchTasks();
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde de la tâche.");
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return;
        try {
            await taskApi.deleteTask(taskId);
            toast.success("Tâche supprimée.");
            fetchTasks();
        } catch (error) {
            toast.error("Erreur lors de la suppression de la tâche.");
            console.error(error);
        }
    };

    const handleAssignClick = (task: TaskDTO) => {
        setTaskToAssign(task);
        setIsAssignOpen(true);
    };

    const handleAssignEmployees = async (taskId: string, employeeIds: string[]) => {
        try {
            await taskApi.assignEmployees(taskId, employeeIds);
            toast.success("Employés attribués avec succès.");
            setIsAssignOpen(false);
            fetchTasks();
        } catch (error) {
            toast.error("Erreur lors de l'attribution des employés.");
            console.error(error);
        }
    };

    const handleEvaluateTask = async (task: TaskDTO, isComplete: boolean) => {
        if (!window.confirm(`Confirmez-vous l'évaluation de la tâche "${task.nom}" ?`)) return;
        try {
            await taskApi.evaluateTask(task.tacheId, isComplete);
            toast.success("Tâche évaluée.");
            fetchTasks();
        } catch (error) {
            toast.error("Erreur lors de l'évaluation.");
            console.error(error);
        }
    };

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (a.priorite !== b.priorite) {
                return a.priorite - b.priorite;
            }

            const statusPriority: { [key: string]: number } = {
              
                'EN_COURS': 1,
                'TERMINÉ': 2,
               
            };
            const statusA = statusPriority[a.etat] || 999;
            const statusB = statusPriority[b.etat] || 999;
            if (statusA !== statusB) {
                return statusA - statusB;
            }

            return new Date(a.dateFin).getTime() - new Date(b.dateFin).getTime();
        });
    }, [tasks]);

    const taskStats = useMemo(() => {
        const stats = {
            total: tasks.length,
           
            enCours: tasks.filter(t => t.etat === 'EN COURS').length,
            termine: tasks.filter(t => t.etat === 'TERMINER').length,
           
        };
        return stats;
    }, [tasks]);

    return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Gestion des Tâches
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Rôle: <span className="text-blue-600 dark:text-blue-400 uppercase font-bold">{role}</span> • {userEmail}
                    </p>
                </div>
                {isRh && (
                    <Button onClick={handleCreateClick} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <Plus className="w-5 h-5 mr-2" /> Créer une Tâche
                    </Button>
                )}
            </header>

            {tasks.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-md">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{taskStats.total}</div>
                            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-1">Total</div>
                        </CardContent>
                    </Card>
                  
                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700 shadow-md">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{taskStats.enCours}</div>
                            <div className="text-xs font-medium text-amber-700 dark:text-amber-300 mt-1">En cours</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700 shadow-md">
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{taskStats.termine}</div>
                            <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mt-1">Terminé</div>
                        </CardContent>
                    </Card>
                  
                </div>
            )}

            <Separator className="dark:bg-gray-700" />

            {loading ? (
                <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600 dark:text-blue-400" />
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Chargement des tâches...</p>
                    </div>
                </div>
            ) : sortedTasks.length === 0 ? (
                <div className="text-center p-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Aucune tâche trouvée</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isRh ? "Commencez par créer une nouvelle tâche" : "Aucune tâche ne vous est assignée pour le moment"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedTasks.map(task => (
                        <TaskCard
                            key={task.tacheId}
                            task={task}
                            role={role}
                            currentUserId={currentUserId}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteTask}
                            onAssign={handleAssignClick}
                            onEvaluate={handleEvaluateTask}
                            onFileUploaded={fetchTasks}
                        />
                    ))}
                </div>
            )}

            <TaskFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                taskToEdit={taskToEdit}
                onSave={handleSaveTask}
                rhId={currentUserId}
            />

            {isRh && (
                <AssignEmployeesDialog
                    isOpen={isAssignOpen}
                    onClose={() => setIsAssignOpen(false)}
                    task={taskToAssign}
                    employees={employees}
                    onAssign={handleAssignEmployees}
                />
            )}
        </div>
    );
};

export default TaskManagement;
