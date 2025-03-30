import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [userSearch, setUserSearch] = useState(""); 
  const [adminSearch, setAdminSearch] = useState(""); 

  useEffect(() => {
    const fetchUsersAndAdmins = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, "users"));
        const adminSnapshot = await getDocs(collection(db, "admin"));

        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const adminList = adminSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(userList);
        setAdmins(adminList);
      } catch (error) {
        console.error("Error fetching users and admins: ", error);
      }
    };

    fetchUsersAndAdmins();
  }, []);

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.id.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  const filteredAdmins = admins.filter((admin) => {
    return (
      admin.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      admin.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
      admin.uid.toLowerCase().includes(adminSearch.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Users and Admins</h2>

      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search users by name, email, or ID"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
        <h3 className="text-2xl font-semibold mb-4">Users</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-4 py-2 text-gray-700 border-b">Name</th>
              <th className="px-4 py-2 text-gray-700 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500 border-b">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="Search admins by name, email, or UID"
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg overflow-x-auto">
        <h3 className="text-2xl font-semibold mb-4">Admins</h3>
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-4 py-2 text-gray-700 border-b whitespace-nowrap">Name</th>
              <th className="px-4 py-2 text-gray-700 border-b whitespace-nowrap">Email</th>
              <th className="px-4 py-2 text-gray-700 border-b whitespace-nowrap">UID</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{admin.fullName}</td>
                  <td className="px-4 py-2 border-b">{admin.email}</td>
                  <td className="px-4 py-2 border-b">{admin.uid}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500 border-b">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
