import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    const load = async () => {
        try {
            const res = await adminAPI.getAllUsers();
            setUsers(res.data.data || []);
        } catch { 
            alert("Failed to load users"); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { load(); }, []);

    const toggle = async (id, status) => {
        try {
            await adminAPI.updateUserStatus(id, !status);
            setUsers(users.map(u => u._id === id ? { ...u, isActive: !status } : u));
        } catch { 
            alert("Failed to update status"); 
        }
    };

    const del = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await adminAPI.deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch { 
            alert("Failed to delete user"); 
        }
    };

    const handleRoleChange = async (id, newRole) => {
        const user = users.find(u => u._id === id);
        if (!user || user.role === newRole) return;

        if (!confirm(`Change role from ${user.role} to ${newRole}?`)) return;

        try {
            await adminAPI.updateUserRole(id, newRole);
            setUsers(users.map(u =>
                u._id === id ? { ...u, role: newRole } : u
            ));
            alert("Role updated successfully");
        } catch {
            alert("Failed to change role");
        }
    };

    const filtered = users.filter(u => 
        (u.name?.toLowerCase().includes(search.toLowerCase()) || 
         u.email?.toLowerCase().includes(search.toLowerCase())) &&
        (!role || u.role === role)
    );

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading users...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 font-sans bg-zinc-950 min-h-screen pb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-white tracking-tight">User Management</h1>
                <p className="text-zinc-400 mt-2">Manage all users, roles, and access</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <input 
                    placeholder="Search by name or email..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="flex-1 p-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-white placeholder:text-zinc-500" 
                />
                <select 
                    value={role} 
                    onChange={e => setRole(e.target.value)} 
                    className="w-full sm:w-56 p-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-white font-medium"
                >
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                <th className="p-6 font-black">Name</th>
                                <th className="p-6 font-black">Contact Info</th>
                                <th className="p-6 font-black">Role</th>
                                <th className="p-6 font-black">Status</th>
                                <th className="p-6 font-black text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr 
                                    key={u._id} 
                                    className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0"
                                >
                                    <td className="p-6 font-bold text-white">{u.name}</td>
                                    
                                    <td className="p-6 text-sm text-zinc-300">
                                        {u.email}<br/>
                                        <span className="text-xs text-zinc-500">{u.phone || 'No phone'}</span>
                                    </td>
                                    
                                    <td className="p-6">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            className="bg-zinc-800 border border-zinc-700 text-emerald-400 font-semibold capitalize px-5 py-2 rounded-2xl focus:outline-none focus:border-emerald-500 cursor-pointer transition-all"
                                        >
                                            <option value="student">Student</option>
                                            <option value="instructor">Instructor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    
                                    <td className="p-6">
                                        <span className={`inline-block px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest
                                            ${u.isActive 
                                                ? 'bg-emerald-900 text-emerald-400' 
                                                : 'bg-red-950 text-red-400'}`}>
                                            {u.isActive ? 'Active' : 'Blocked'}
                                        </span>
                                    </td>
                                    
                                    <td className="p-6 text-center whitespace-nowrap space-x-3">
                                        <button 
                                            onClick={() => toggle(u._id, u.isActive)} 
                                            className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all
                                                ${u.isActive 
                                                    ? 'bg-amber-900 hover:bg-amber-800 text-amber-300' 
                                                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'}`}
                                        >
                                            {u.isActive ? 'Block' : 'Unblock'}
                                        </button>
                                        
                                        <button 
                                            onClick={() => del(u._id)} 
                                            className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-red-950 hover:bg-red-900 text-red-400 transition-all"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center text-zinc-400 font-medium">
                                        No users match your search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;