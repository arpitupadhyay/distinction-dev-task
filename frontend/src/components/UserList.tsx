"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types/user";

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [users, setUsers] = useState(initialUsers);

  const isFormValid = name && email && city && country;

  const handleCreate = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, city, country }),
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    const updated = await res.json();
    setUsers(Array.isArray(updated) ? updated : [updated]);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2 mb-6">
        {users.map((user) => (
          <div key={user.id} className="border p-3 rounded">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm">City: {user.city}</p>
            <p className="text-sm">Country: {user.country}</p>
          </div>
        ))}
      </div>

      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <Input
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <Button
        onClick={handleCreate}
        disabled={!isFormValid}
        className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
      >
        Add User
      </Button>
    </div>
  );
}
