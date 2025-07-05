"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Alert } from "@/components/ui/alert";
import { User } from "@/types/user";
import { userSchema, UserFormData } from "@/lib/validation";
import { userApi } from "@/lib/api";
import { handleError } from "@/lib/utils";
import { Trash2, Edit, Save, X, Plus, RefreshCw } from "lucide-react";
import { ZodError as ZodValidationError } from "zod";

interface ValidationErrors {
  name?: string;
  email?: string;
  city?: string;
  country?: string;
}

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    city: "",
    country: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (field: keyof UserFormData, value: string) => {
    try {
      userSchema.shape[field].parse(value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      if (err instanceof ZodValidationError) {
        setErrors((prev) => ({
          ...prev,
          [field]: err.issues[0]?.message || "Invalid value",
        }));
      } else if (typeof err === "object" && err !== null && "errors" in err) {
        const zodError = err as { errors: Array<{ message: string }> };
        setErrors((prev) => ({
          ...prev,
          [field]: zodError.errors[0]?.message || "Invalid value",
        }));
      } else if (err instanceof Error) {
        setErrors((prev) => ({ ...prev, [field]: err.message }));
      }
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const isFormValid = () => {
    try {
      userSchema.parse(formData);
      return true;
    } catch {
      return false;
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", city: "", country: "" });
    setErrors({});
    setShowForm(false);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(handleError(err));
    }
  };

  const refreshUsers = async () => {
    setIsInitialLoading(true);
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setIsInitialLoading(false);
    }
  };

  const createUser = async () => {
    if (!isFormValid()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await userApi.create(formData);
      await fetchUsers();
      setSuccess("User created successfully!");
      resetForm();
    } catch (err) {
      setError(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string) => {
    if (!isFormValid()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await userApi.update(id, formData);
      await fetchUsers();
      setSuccess("User updated successfully!");
      resetForm();
    } catch (err) {
      setError(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await userApi.delete(id);
      await fetchUsers();
      setSuccess("User deleted successfully!");
    } catch (err) {
      setError(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      city: user.city,
      country: user.country,
    });
    setEditingId(user.id);
    setShowForm(true);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshUsers}
            disabled={isInitialLoading}
            className="flex items-center gap-2"
          >
            {isInitialLoading ? (
              <Loading size={16} />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            disabled={showForm}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {editingId ? "Edit User" : "Add New User"}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className={errors.country ? "border-red-500" : ""}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingId ? () => updateUser(editingId) : createUser}
                disabled={!isFormValid() || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loading size={16} />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading
                  ? "Saving..."
                  : editingId
                  ? "Update User"
                  : "Create User"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {isInitialLoading ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Loading size={32} className="mx-auto mb-2" />
              <p className="text-gray-500">Loading users...</p>
            </CardContent>
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No users found. Add your first user to get started.
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {user.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{user.email}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📍 {user.city}</span>
                      <span>🌍 {user.country}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(user)}
                      disabled={showForm}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {isLoading ? (
                        <Loading size={16} />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
