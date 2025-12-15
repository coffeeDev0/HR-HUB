import { UndoIcon } from "lucide-react";

// src/api/userApi.ts
export interface UserDTO {
  userId: string;
  userName: string;
  userPrenom?: string;
  userPassword?: string;
  role?: string;
  email?: string;
  tel?: string;
  profession?: string;
  status?: string;
  rhId?: string;
}

/**
 * Récupère le token depuis localStorage et construit les headers
 */
function authHeaders(contentType = "application/json") {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

const BASE = "http://10.152.224.91:8085";

export const userApi = {
  async getAllUsers(): Promise<UserDTO[]> {
    const res = await fetch(`${BASE}/user/all`, {
      method: "GET",
      headers: authHeaders(undefined),
    });
    if (!res.ok) throw new Error(`GET /user/all failed: ${res.status}`);
    return res.json();
  },

  async getUserById(id: string): Promise<UserDTO> {
    const res = await fetch(`${BASE}/user/${id}`, {
      method: "GET",
      headers: authHeaders(undefined),
    });
    if (!res.ok) throw new Error(`GET /user/${id} failed: ${res.status}`);
    return res.json();
  },

  async getRhEmployers(rhId: string): Promise<UserDTO[]> {
  const res = await fetch(`${BASE}/rh/${rhId}`, {
    method: "GET",
    headers: authHeaders(undefined), // ou null si tu as modifié la fonction
  });
  if (!res.ok) throw new Error(`GET /rh/${rhId} failed: ${res.status}`);
  return res.json();
},

  async getUserByEmail(email: string): Promise<UserDTO> {
    const res = await fetch(`${BASE}/user/email/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: authHeaders(undefined),
    });
    if (!res.ok) throw new Error(`GET /user/email/${email} failed: ${res.status}`);
    return res.json();
  },

  async deleteUser(id: string): Promise<string> {
    const res = await fetch(`${BASE}/user/${id}`, {
      method: "DELETE",
      headers: authHeaders(undefined),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DELETE /user/${id} failed: ${res.status} ${text}`);
    }
    return res.text();
  },

  async updateUserInfo(id: string, payload: Partial<UserDTO>): Promise<UserDTO | string> {
    // There is no explicit PUT /user/{id} in your doc except update password.
    // But employer-service exposes /user/update/{id} for password only.
    // We'll try to use /employer/add for create and other endpoints for role
    // If backend supports update endpoint, change this to that endpoint.
    // For now, try PUT /user/update/{id} with JSON (may be limited to password)
    const res = await fetch(`${BASE}/user/update/${id}`, {
      method: "PUT",
      headers: authHeaders("application/json"),
      body: JSON.stringify(payload.userPassword ?? JSON.stringify(payload)),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PUT /user/update/${id} failed: ${res.status} ${text}`);
    }
    // backend returns string for update password; try parse JSON otherwise return text
    const txt = await res.text();
    try {
      return JSON.parse(txt);
    } catch {
      return txt;
    }
  },

  async setRole(id: string, role: string): Promise<string> {
  const res = await fetch(`${BASE}/admin/attribute/${id}`, {
    method: "POST",
    headers: authHeaders("application/json"),
    body: JSON.stringify(role), 
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /admin/attribute/${id} failed: ${res.status} ${text}`);
  }
  return res.text();
},

  async updateRhStatus(userId: string, status: string): Promise<string> {
    // PUT /rh/update/{userId} expects a raw string in body
    const res = await fetch(`${BASE}/rh/update/${userId}`, {
      method: "PUT",
      headers: authHeaders("text/plain"),
      body: status,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PUT /rh/update/${userId} failed: ${res.status} ${text}`);
    }
    return res.text();
  },

  async getAllEmployers(): Promise<UserDTO[]> {
    const res = await fetch(`${BASE}/employer/all`, {
      method: "GET",
      headers: authHeaders(undefined),
    });
    if (!res.ok) throw new Error(`GET /employer/all failed: ${res.status}`);
    return res.json();
  },

  async getAllRh(): Promise<UserDTO[]> {
    const res = await fetch(`${BASE}/rh/all`, {
      method: "GET",
      headers: authHeaders(undefined),
    });
    if (!res.ok) throw new Error(`GET /employer/all failed: ${res.status}`);
    return res.json();
  },
  async addEmployer(payload: Partial<UserDTO>): Promise<UserDTO> {
    const res = await fetch(`${BASE}/employer/add`, {
      method: "POST",
      headers: authHeaders("application/json"),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST /employer/add failed: ${res.status} ${text}`);
    }
    return res.json();
  },
  async deleteUserByEmail(email: string) {
  const res = await fetch(`${BASE}/user/email/${email}`, {
    method: "DELETE",
    headers: authHeaders(undefined),
  });

  if (!res.ok) throw new Error(`DELETE /user/email/${email} failed`);
  return res.text();
},

async addRh(payload: any) {
  const res = await fetch(`${BASE}/rh/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Erreur serveur: ${res.status}`);
  }

  return await res.json();
}


};
