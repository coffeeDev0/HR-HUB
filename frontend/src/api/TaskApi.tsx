const BASE = "http://10.253.238.91:8086";

/**
 * Types de base de l'API
 */
export interface TaskFileDTO {
    id: number;
    name: string;
    url: string;
    tacheId: string;
    employerId: string;
    fileSize: number;
    contentType: string;
    extension: string;
}

export interface UserDTO {
    employerId?: string; // UUID pour l'employé
    rhId?: string; // UUID pour le RH
    email: string;
}

export interface TaskDTO {
    tacheId: string;
    nom: string; // Nom de la tâche
    description: string;
    priorite: number;
    etat: string; // État (e.g., NOUVEAU, EN_COURS, TERMINÉ, ÉVALUÉ)
    dateDebut: string;
    dateFin: string;
    rhId: string;
    fichiers: TaskFileDTO[];
    employers?: { employerId: string }[]; // Ajouté pour l'attribution
}

export interface TaskPayload {
    nom: string;
    description: string;
    priorite: number;
    dateFin: string;
    rhId: string;
}

/**
 * Client API pour la gestion des tâches et les opérations RH associées.
 */
export const taskApi = {
    // --- Utils pour récupérer les IDs (Nouveaux Endpoints) ---

    /** Récupère l'ID d'un Employé par email */
    async getEmployerByEmail(email: string): Promise<UserDTO> {
        const response = await fetch(`${BASE}/Employers/${email}`);
        if (!response.ok) throw new Error(`Employé non trouvé pour l'email ${email}.`);
        const data = await response.json();
        return { employerId: data.employerId, email: data.email };
    },

    /** Récupère l'ID d'un RH par email */
    async getRhByEmail(email: string): Promise<UserDTO> {
        const response = await fetch(`${BASE}/rhs/${email}`);
        if (!response.ok) throw new Error(`RH non trouvé pour l'email ${email}.`);
        const data = await response.json();
        return { rhId: data.rhId, email: data.email };
    },

    // --- Tâches (Task Controller: /taches) ---

    /** Récupère toutes les tâches (Admin) */
    async getAllTasks(): Promise<TaskDTO[]> {
        const response = await fetch(`${BASE}/taches`);
        if (!response.ok) throw new Error('Erreur lors de la récupération de toutes les tâches.');
        return response.json();
    },

    /** Récupère les tâches créées par un RH (RH) */
    async getRhTasks(rhEmail: string): Promise<TaskDTO[]> {
        // L'API utilise l'email directement dans le chemin pour RH
        const response = await fetch(`${BASE}/taches/rh/${rhEmail}`);
        if (!response.ok) throw new Error(`Erreur lors de la récupération des tâches pour le RH ${rhEmail}.`);
        return response.json();
    },

    /** Récupère les tâches assignées à un employé (Employee) */
    async getEmployeeTasks(employeeEmail: string): Promise<TaskDTO[]> {
        // L'API utilise l'email directement dans le chemin pour Employer
        const response = await fetch(`${BASE}/taches/employer/${employeeEmail}`);
        if (!response.ok) throw new Error(`Erreur lors de la récupération des tâches pour l'employé ${employeeEmail}.`);
        return response.json();
    },

    /** Crée une nouvelle tâche (RH/Admin) */
    async createTask(payload: TaskPayload): Promise<TaskDTO> {
        const response = await fetch(`${BASE}/taches/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Erreur lors de la création de la tâche.');
        return response.json();
    },

    /** Met à jour une tâche existante (RH/Admin) */
    async updateTask(taskId: string, payload: Partial<TaskPayload>): Promise<TaskDTO> {
        const response = await fetch(`${BASE}/taches/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Erreur lors de la mise à jour de la tâche ${taskId}.`);
        return response.json();
    },

    /** Supprime une tâche (RH/Admin) */
    async deleteTask(taskId: string): Promise<void> {
        const response = await fetch(`${BASE}/taches/${taskId}`, { method: "DELETE" });
        if (response.status === 404) {
             // 204 No Content est attendu, mais 404 peut arriver si l'objet est déjà supprimé.
             // On suppose que l'opération a réussi si ce n'est pas une erreur serveur (5xx)
             return;
        }
        if (!response.ok) throw new Error(`Erreur lors de la suppression de la tâche ${taskId}.`);
    },

    // --- Opérations RH (RH Controller: /rhs) ---

    /** Attribue des employés à une tâche (RH) */
    async assignEmployees(taskId: string, employeeIds: string[]): Promise<void> {
        const response = await fetch(`${BASE}/rhs/attribution/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeIds), // Le body est un tableau d'IDs
        });
        if (!response.ok) throw new Error(`Erreur lors de l'attribution des employés à la tâche ${taskId}.`);
    },

    /** Évalue une tâche (RH) */
    async evaluateTask(taskId: string, evaluation: boolean): Promise<boolean> {
        const response = await fetch(`${BASE}/rhs/evalue/${taskId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evaluation), // Le body est un boolean
        });
        if (!response.ok) throw new Error(`Erreur lors de l'évaluation de la tâche ${taskId}.`);
        return response.json();
    },

    // --- Fichiers (File Controller: /fichiers) ---

    /** Télécharge un fichier (URL) */
    getFileUrl(fileId: number): string {
        return `${BASE}/fichiers/download/${fileId}`;
    },

    /** Supprime un fichier */
    async deleteFile(fileId: number): Promise<void> {
        const response = await fetch(`${BASE}/fichiers/${fileId}`, { method: "DELETE" });
        if (response.status !== 204) throw new Error(`Erreur lors de la suppression du fichier ${fileId}.`);
    },

    /** Récupère tous les employés pour l'attribution (Simulé, basé sur employer-controller/all) */
    async getAllEmployees(): Promise<UserDTO[]> {
        const response = await fetch(`${BASE}/Employers/all`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des employés.');
        
        // Mappage de la structure EmployerResult à UserDTO
        const employers = await response.json();
        return employers.map((emp: any) => ({
            employerId: emp.employerId,
            email: emp.email,
        }));
    },
};
