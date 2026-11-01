"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Shield,
  GraduationCap,
  BookOpen,
  BriefcaseBusiness,
  Ban,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

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
  salesTeam?: boolean;
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
  const t = useTranslations("admin");
  const de = locale === "de";
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.users))
        throw new Error(
          de ? "Benutzer konnten nicht geladen werden." : "Users could not be loaded."
        );
      setUsers(data.users);
      setError("");
    } catch {
      setError("Users could not be loaded. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [de]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function updateUser(
    uid: string,
    payload: { role?: UserRole; disabled?: boolean; salesTeam?: boolean }
  ) {
    setActionLoading(uid);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, ...payload }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Update was not saved.");
      await fetchUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update was not saved.");
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
    sales: users.filter((u) => u.salesTeam).length,
  };

  return (
    <div className="space-y-6">
      <p className="mb-4 text-sm text-white/60">
        {de
          ? "Zugänge können hier gesperrt werden. Dauerhafte Löschungen erfolgen über den Datenschutzprozess mit Prüfung der Aufbewahrungsfristen und vollständiger Dateibereinigung."
          : "Suspend access here. Permanent deletion follows the privacy workflow, including retention review and complete file cleanup."}
      </p>
      {!!error && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: t("statTotal"), value: stats.total, color: "text-white" },
          { label: t("statStudents"), value: stats.students, color: "text-[#E0B873]" },
          { label: t("statTeachers"), value: stats.teachers, color: "text-blue-400" },
          { label: t("statAdmins"), value: stats.admins, color: "text-red-400" },
          { label: de ? "Sales Team" : "Sales team", value: stats.sales, color: "text-cyan-300" },
        ].map((s) => (
          <div
            key={s.label}
            className="border-white/8 rounded-xl border bg-[#0A1E35]/70 p-4 text-center"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#CEA66F]/50 focus:outline-none"
        />
        <div className="flex gap-2">
          {(["all", "student", "teacher", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                roleFilter === r
                  ? "border-[#CEA66F]/50 bg-[#CEA66F]/15 text-[#CEA66F]"
                  : "bg-white/3 border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              {r === "all"
                ? t("filterAll")
                : r === "student"
                  ? t("statStudents")
                  : r === "teacher"
                    ? t("statTeachers")
                    : t("statAdmins")}
            </button>
          ))}
          <button
            onClick={fetchUsers}
            className="bg-white/3 rounded-lg border border-white/10 px-3 py-2 text-white/50 transition-all hover:border-white/20"
            title={t("refresh")}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border-white/8 overflow-hidden rounded-xl border bg-[#0A1E35]/70">
        {loading ? (
          <div className="py-16 text-center text-sm text-white/30">{t("loading")}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-white/30">{t("noUsersFound")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/40">
                    {t("colUser")}
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/40">
                    {t("colRole")}
                  </th>
                  <th className="hidden px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/40 sm:table-cell">
                    {t("colLevel")}
                  </th>
                  <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/40">
                    Sales
                  </th>
                  <th className="hidden px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/40 md:table-cell">
                    {t("colStatus")}
                  </th>
                  <th className="hidden px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-white/40 lg:table-cell">
                    {t("colJoined")}
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-white/40">
                    {t("colActions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-white/4 divide-y">
                {filtered.map((user) => {
                  const isLoading = actionLoading === user.uid;
                  const isSelf = user.uid === currentUserId;
                  return (
                    <tr
                      key={user.uid}
                      className={`hover:bg-white/2 transition-colors ${user.disabled ? "opacity-50" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#E0B873]/20 bg-[#E0B873]/10">
                            <span className="text-xs font-semibold text-[#E0B873]">
                              {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name || "…"}</p>
                            <p className="text-xs text-white/40">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {isSelf ? (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${ROLE_COLORS[user.role]}`}
                          >
                            {ROLE_ICONS[user.role]}
                            {user.role}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            disabled={isLoading}
                            onChange={(e) =>
                              updateUser(user.uid, { role: e.target.value as UserRole })
                            }
                            className={`cursor-pointer rounded-full border bg-transparent px-2.5 py-1 text-xs font-medium focus:outline-none ${ROLE_COLORS[user.role]}`}
                          >
                            <option value="student" className="bg-[#071424] text-white">
                              Student
                            </option>
                            <option value="teacher" className="bg-[#071424] text-white">
                              Teacher
                            </option>
                            <option value="admin" className="bg-[#071424] text-white">
                              Admin
                            </option>
                          </select>
                        )}
                      </td>

                      <td className="hidden px-5 py-4 sm:table-cell">
                        <span className="text-xs text-white/50">{user.level ?? "…"}</span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => updateUser(user.uid, { salesTeam: !user.salesTeam })}
                          disabled={isLoading}
                          aria-pressed={user.salesTeam === true}
                          title={de ? "Sales-Zugang ändern" : "Change sales access"}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-40 ${user.salesTeam ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-300" : "border-white/10 text-white/30 hover:text-white/60"}`}
                        >
                          <BriefcaseBusiness className="h-3.5 w-3.5" />
                          {user.salesTeam ? (de ? "Aktiv" : "Active") : de ? "Aus" : "Off"}
                        </button>
                      </td>

                      <td className="hidden px-5 py-4 md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 text-xs ${user.emailVerified ? "text-green-400" : "text-white/30"}`}
                          >
                            {user.emailVerified ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {t("emailLabel")}
                          </span>
                          {user.disabled && (
                            <span className="text-xs text-red-400">{t("disabledLabel")}</span>
                          )}
                        </div>
                      </td>

                      <td className="hidden px-5 py-4 lg:table-cell">
                        <span className="text-xs text-white/35">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(de ? "de-DE" : "en-GB")
                            : "…"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {!isSelf && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateUser(user.uid, { disabled: !user.disabled })}
                              disabled={isLoading}
                              title={user.disabled ? t("enable") : t("disable")}
                              className="rounded-md p-1.5 text-white/30 transition-all hover:bg-white/5 hover:text-white/60 disabled:opacity-40"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        {isSelf && (
                          <span className="block text-right text-xs text-white/20">
                            {t("youLabel")}
                          </span>
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
