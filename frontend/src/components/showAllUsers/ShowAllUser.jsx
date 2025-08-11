import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUsersGrid = () => {
  const [users, setUsers] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [deletingUser, setDeletingUser] = useState(null);
  const [keyword, setKeyword] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3500/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setAllUser(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  useEffect(() => {
    if (keyword.trim() === "") {
      setUsers(allUser);
    } else {
      const filtered = allUser.filter((user) =>
        user.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setUsers(filtered);
    }
  }, [keyword, allUser]);

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3500/admin/users/${deletingUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== deletingUser));
      setDeletingUser(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const startEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3500/admin/users/${editingUser}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingUser(null);
      toast.success("User updated successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
     
      <div className="mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="🔎 Search by User Name..."
          className="p-2 rounded bg-gray-700 border border-gray-600 text-white w-full"
        />
      </div>

      <h2 className="text-3xl text-center font-extrabold text-red-500 mb-8 flex items-center justify-center gap-3">
        <FaUserShield /> Manage Users
      </h2>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800 border border-gray-700 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-red-500/40 transition duration-300"
          >
            <div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-gray-400">{user.email}</p>
              <span className="inline-block mt-3 px-3 py-1 text-sm rounded-full bg-red-600 text-white shadow">
                {user.role}
              </span>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => startEdit(user)}
                className="text-blue-400 hover:text-blue-600 transition"
                title="Edit User"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => setDeletingUser(user._id)}
                className="text-red-400 hover:text-red-600 transition"
                title="Delete User"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl shadow-lg w-full max-w-md text-white">
            <h3 className="text-2xl font-bold mb-6 text-red-500">Edit User</h3>
            <form onSubmit={updateUser} className="space-y-5">
              <div>
                <label className="block font-semibold text-gray-300">Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-300">Email</label>
                <input
                  type="email"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-300">Role</label>
                <select
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="manager">Manager</option>
                  <option value="qa">QA</option>
                  <option value="dev">Developer</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl shadow-lg w-full max-w-sm text-white">
            <h3 className="text-xl font-bold mb-4 text-red-500">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeletingUser(null)}
                className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersGrid;
