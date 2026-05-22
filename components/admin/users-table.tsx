"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, GraduationCap, BookOpen, Ban, Trash2, RefreshCw, CheckCircle, XCircle } from "lucide-react";

type UserRole = "student" | "teacher" | "admin";

interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  level?: string | null;
  createdAt?: string | null;
  emailVerified: boolean;
  disabled: boolean;
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="h-3.5 w-3.5" />,
  teacher: <BookOpen className="h-3.5 w-3.5" />,
  student: <GraduationCap className="h-3.5 w-3.5" />,
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "text-red-400 bg-red-400/10 border-red-400/20",
  teacher: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  student: "text-[#E0B873] bg-[#E0B873]/10 border-[#E0B873]/20",
};

interface Props {
  locale: string;
  currentUserId: string;
}

export function UsersTable({ locale, currentUserId }: Props) {
  const de = locale === "de";
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function updateUser(uid: string, payload: { role?: UserRole; disabled?: boolean }) {
    setActionLoading(uid);
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, ...payload }),
      });
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUser(uid: string) {
    setActionLoading(uid);
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      setConfirmDelete(null);
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    students: users.filter((u) => u.role === "student").length,
    teachers: users.filter((u) => u.role === "teacher").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: de ? "Gesamt" : "Total", value: stats.total, color: "text-white" },
          { label: de ? "Lernende" : "Students", value: stats.students, color: "text-[#E0B873]" },
          { label: de ? "Lehrer" : "Teachers", value: stats.teachers, color: "text-blue-400" },
          { label: de ? "Admins" : "Admins", value: stats.admins, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0A1E35]/70 border border-white/8 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={de ? "Suche nach Name oder E-Mail…" : "Search by name or email…"}
          className="flex-1 rounded-lg bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CEA66F]/50"
        />
        <div className="flex gap-2">
          {(["all", "student", "teacher", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                roleFilter === r
                  ? "bg-[#CEA66F]/15 border-[#CEA66F]/50 text-[#CEA66F]"
                  : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              {r === "all" ? (de ? "Alle" : "All") : r === "student" ? (de ? "Lernende" : "Students") : r === "teacher" ? (de ? "Lehrer" : "Teachers") : "Admins"}
            </button>
          ))}
          <button
            onClick={fetchUsers}
            className="px-3 py-2 rounded-lg bg-white/3 border border-white/10 text-white/50 hover:border-white/20 transition-all"
            title={de ? "Aktualisieren" : "Refresh"}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A1E35]/70 border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-white/30 text-sm">
            {de ? "Wird geladen…" : "Loading…"}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-white/30 text-sm">
            {de ? "Keine Benutzer gefunden." : "No users found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-5 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider">{de ? "Benutzer" : "User"}</th>
                  <th className="px-5 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider">{de ? "Rolle" : "Role"}</th>
                  <th className="px-5 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">{de ? "Niveau" : "Level"}</th>
                  <th className="px-5 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">{de ? "Status" : "Status"}</th>
                  <th className="px-5 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider hidden lg:table-cell">{de ? "Beigetreten" : "Joined"}</th>
                  <th className="px-5 py-3.5 text-xs font-medium text-white/40 uppercase tracking-wider text-right">{de ? "Aktionen" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.map((user) => {
                  const isLoading = actionLoading === user.uid;
                  const isSelf = user.uid === currentUserId;
                  return (
                    <tr key={user.uid} className={`hover:bg-white/2 transition-colors ${user.disabled ? "opacity-50" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#E0B873]/10 border border-[#E0B873]/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-[#E0B873]">
                              {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name || "—"}</p>
                            <p className="text-xs text-white/40">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {isSelf ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${ROLE_COLORS[user.role]}`}>
                            {ROLE_ICONS[user.role]}
                            {user.role}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            disabled={isLoading}
                            onChange={(e) => updateUser(user.uid, { role: e.target.value as UserRole })}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium border cursor-pointer focus:outline-none bg-transparent ${ROLE_COLORS[user.role]}`}
                          >
                            <option value="student" className="bg-[#071424] text-white">Student</option>
                            <option value="teacher" className="bg-[#071424] text-white">Teacher</option>
                            <option value="admin" className="bg-[#071424] text-white">Admin</option>
                          </select>
                        )}
                      </td>

                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-xs text-white/50">{user.level ?? "—"}</span>
                      </td>

                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 text-xs ${user.emailVerified ? "text-green-400" : "text-white/30"}`}>
                            {user.emailVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {de ? "E-Mail" : "Email"}
                          </span>
                          {user.disabled && (
                            <span className="text-xs text-red-400">{de ? "Deaktiviert" : "Disabled"}</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs text-white/35">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString(de ? "de-DE" : "en-GB") : "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {!isSelf && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateUser(user.uid, { disabled: !user.disabled })}
                              disabled={isLoading}
                              title={user.disabled ? (de ? "Aktivieren" : "Enable") : (de ? "Deaktivieren" : "Disable")}
                              className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-all disabled:opacity-40"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>

                            {confirmDelete === user.uid ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => deleteUser(user.uid)}
                                  disabled={isLoading}
                                  className="text-xs text-red-400 hover:underline"
                                >
                                  {de ? "Bestätigen" : "Confirm"}
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="text-xs text-white/30 hover:underline"
                                >
                                  {de ? "Abbrechen" : "Cancel"}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(user.uid)}
                                disabled={isLoading}
                                title={de ? "Löschen" : "Delete"}
                                className="p-1.5 rounded-md text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all disabled:opacity-40"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                        {isSelf && (
                          <span className="text-xs text-white/20 text-right block">{de ? "(Du)" : "(You)"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
