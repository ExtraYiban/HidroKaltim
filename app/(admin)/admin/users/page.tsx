import { AdminUsersManager } from "@/app/components/admin/admin-users-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type UsersPageRow = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date;
};

type AdminUsersPageProps = {
  searchParams: Promise<{ toast?: string }>;
};

const toastMessages: Record<string, string> = {
  created: "User baru berhasil ditambahkan.",
  deleted: "User berhasil dihapus.",
  role_updated: "Role user berhasil diperbarui.",
  invalid_input: "Input tidak valid. Mohon periksa kembali.",
  email_exists: "Email sudah digunakan user lain.",
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const users = (await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })) as UsersPageRow[];

  const params = await searchParams;
  const toast = params.toast ? toastMessages[params.toast] : null;

  return (
    <div className="space-y-4 md:space-y-6">
      {toast ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800">
          {toast}
        </div>
      ) : null}

      <AdminUsersManager
        users={users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
