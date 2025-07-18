import { useEffect, useState } from "react";
import axios from "axios";
import { Ban, CheckCircle } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Toggle blocked status
  const toggleBlock = async (userId, blockedStatus) => {
    try {
      await axios.patch(`http://localhost:3001/users/${userId}`, {
        blocked: !blockedStatus,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, blocked: !blockedStatus } : u
        )
      );
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4">
                  {user.blocked ? (
                    <span className="text-red-500 font-semibold ">Blocked</span>
                  ) : !user.active ? (
                    <span className="text-yellow-500 font-semibold">Logged Out</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleBlock(user.id, user.blocked)}
                    className={`px-4 py-1 rounded flex items-center gap-2 text-white ${
                      user.blocked ? "bg-green-500" : "bg-red-500"
                    } hover:opacity-80`}
                  >
                    {user.blocked ? (
                      <>
                        <CheckCircle size={10} />
                        Unblock
                      </>
                    ) : (
                      <>
                        <Ban size={16} />
                        Block
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
