import { User } from "@/types/user";
import { UserFormData } from "@/lib/validation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorResponse {
  message?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({} as ErrorResponse));
    throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const userApi = {
  // Get all users
  async getAll(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`);
    const data = await handleResponse<User[]>(response);
    return Array.isArray(data) ? data : [data];
  },

  // Get single user
  async getById(id: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}`);
    return handleResponse<User>(response);
  },

  // Create user
  async create(userData: UserFormData): Promise<{ message: string; id: string }> {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse<{ message: string; id: string }>(response);
  },

  // Update user
  async update(id: string, userData: Partial<UserFormData>): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse<{ message: string }>(response);
  },

  // Delete user
  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE",
    });
    return handleResponse<{ message: string }>(response);
  },
}; 