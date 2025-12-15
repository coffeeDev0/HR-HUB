// src/api/demandeApi.ts
export interface DemandeDTO {
  demandeId: string;
  employerId: string;
  rhId: string;
  raison: string;
  dateDebut: string;
  dateFin: string;
  status: string;
  commentaire?: string;
}

const BASE = "http://10.152.224.91:8084";

function authHeaders(contentType?: string | null) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const demandeApi = {
  async getAll(): Promise<DemandeDTO[]> {
    const res = await fetch(`${BASE}/demande/all`, {
      method: "GET",
      headers: authHeaders(null),
    });
    if (!res.ok) throw new Error("Erreur GET /demande/all");
    return res.json();
  },

  async getByEmail(email: string): Promise<DemandeDTO[]> {
    const res = await fetch(`${BASE}/demande/${email}`, {
      method: "GET",
      headers: authHeaders(null),
    });
    if (!res.ok) throw new Error("Erreur GET /demande/{email}");
    return res.json();
  },

  async create(email: string, payload: Partial<DemandeDTO>) {
    const res = await fetch(`${BASE}/demande/${email}`, {
      method: "POST",
      headers: authHeaders("application/json"),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erreur POST /demande/{email}");
    return res.json();
  },

  async update(demandeId: string, payload: Partial<DemandeDTO>) {
    const res = await fetch(`${BASE}/demande/${demandeId}`, {
      method: "PUT",
      headers: authHeaders("application/json"),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erreur PUT /demande/{id}");
    return res.json();
  },

  async remove(demandeId: string) {
    const res = await fetch(`${BASE}/demande/${demandeId}`, {
      method: "DELETE",
      headers: authHeaders(null),
    });
    if (!res.ok) throw new Error("Erreur DELETE /demande/{id}");
    return res.text();
  },

  async evaluate(demandeId: string, payload: { status: string; rhId: string; commentaire: string }) {
    const res = await fetch(`${BASE}/demande/evaluate/${demandeId}`, {
      method: "POST",
      headers: authHeaders("application/json"),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erreur POST /demande/evaluate/{id}");
    return res.text();
  },

 async getRhRequest(rhId: string): Promise<DemandeDTO[]> {
  const res = await fetch(`${BASE}/demande/all/${rhId}`, {
    method: "GET",
    headers: authHeaders(null),
  });
  if (!res.ok) throw new Error("Erreur GET /demande/all/{rhId}");
  return res.json();
}

};
