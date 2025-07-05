import UserList from "@/components/UserList";
import { userApi } from "@/lib/api";
import { User } from "@/types/user";

export default async function Page() {
  let users: User[] = [];
  
  try {
    users = await userApi.getAll();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserList initialUsers={users} />
      </div>
    </div>
  );
}
