"use client";

type UserRole = "user" | "admin";
import {
  createUserAction,
  deleteUserAction,
  updateUserRoleAction,
} from "@/app/(admin)/admin/users/actions";
import { useMemo, useState } from "react";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

type AdminUsersManagerProps = {
  users: AdminUser[];
};

function roleBadgeClass(role: UserRole) {
  return role === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700";
}

function formatIdDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("id-ID");
}

export function AdminUsersManager({ users }: AdminUsersManagerProps) {
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = query.toLowerCase();
      return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q);
    });
  }, [users, query]);

  return (
    <div className="space-y-4 md:space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="hidden items-start justify-between md:flex">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manajemen User</h1>
            <p className="mt-1 text-sm text-slate-600">Kelola role, tambah user, dan hapus akun dari panel admin.</p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Tambah Data
          </button>
        </div>

        <div className="md:hidden">
          <h1 className="text-xl font-bold text-slate-900">Manajemen User</h1>
        </div>

        <div className="mt-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nama</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Terdaftar</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadgeClass(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatIdDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <form action={updateUserRoleAction} className="flex items-center gap-2">
                        <input type="hidden" name="userId" value={user.id} />
                        <select
                          name="role"
                          defaultValue={user.role}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                        <button type="submit" className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white">
                          Ubah Role
                        </button>
                      </form>
                      <form action={deleteUserAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col space-y-3 p-3 md:hidden">
          {filteredUsers.map((user) => (
            <article key={user.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadgeClass(user.role)}`}>{user.role}</span>
              </div>

              <p className="mt-2 text-xs text-slate-500">Terdaftar: {formatIdDate(user.createdAt)}</p>

              <form action={updateUserRoleAction} className="mt-3">
                <input type="hidden" name="userId" value={user.id} />
                <select
                  name="role"
                  defaultValue={user.role}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button type="submit" className="mt-3 w-full rounded-lg bg-cyan-600 py-3 text-sm font-semibold text-white">
                  Ubah Role
                </button>
              </form>

              <form action={deleteUserAction}>
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" className="mt-3 w-full rounded-lg bg-red-600 py-3 text-sm font-semibold text-white">
                  Hapus User
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg md:hidden"
      >
        + Tambah
      </button>

      {createOpen ? (
        <>
          <div className="fixed inset-0 z-40 hidden bg-slate-950/40 backdrop-blur-sm md:block" onClick={() => setCreateOpen(false)} />

          <div className="fixed inset-0 z-50 md:hidden">
            <div className="flex h-full flex-col bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-bold text-slate-900">Tambah User</p>
                <button type="button" onClick={() => setCreateOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
                  Tutup
                </button>
              </div>
              <div className="flex-1 overflow-auto px-4 py-4">
                <form action={createUserAction} className="space-y-3">
                  <input name="name" required placeholder="Nama lengkap" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
                  <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
                  <input name="password" type="password" minLength={8} required placeholder="Password (min 8)" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
                  <select name="role" defaultValue="user" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white">Simpan User</button>
                </form>
              </div>
            </div>
          </div>

          <div className="fixed left-1/2 top-1/2 z-50 hidden w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:block">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-bold text-slate-900">Tambah User Baru</p>
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs">
                Tutup
              </button>
            </div>
            <form action={createUserAction} className="space-y-3">
              <input name="name" required placeholder="Nama lengkap" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
              <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
              <input name="password" type="password" minLength={8} required placeholder="Password (min 8)" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none" />
              <select name="role" defaultValue="user" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
              <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white">Simpan User</button>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
}
