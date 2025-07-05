import UserList from "@/components/UserList";
import { User } from "@/types/user";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    cache: "no-store",
  });
  const users: User[] = await res.json();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <UserList initialUsers={Array.isArray(users) ? users : [users]} />
    </div>
  );
}
