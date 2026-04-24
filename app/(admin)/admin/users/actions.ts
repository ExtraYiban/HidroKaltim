"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type UserRole = "user" | "admin";

function toSafeUserId(input: FormDataEntryValue | null) {
  const parsed = Number(input);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function createUserAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleRaw = String(formData.get("role") ?? "user");
  const role: UserRole = roleRaw === "admin" ? "admin" : "user";

  if (!name || !email || password.length < 8) {
    redirect("/admin/users?toast=invalid_input");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/admin/users?toast=email_exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role,
    },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?toast=created");
}

export async function updateUserRoleAction(formData: FormData) {
  const userId = toSafeUserId(formData.get("userId"));
  const roleRaw = String(formData.get("role") ?? "");

  if (!userId) {
    redirect("/admin/users?toast=invalid_input");
  }

  if (roleRaw !== "user" && roleRaw !== "admin") {
    redirect("/admin/users?toast=invalid_input");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: roleRaw },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?toast=role_updated");
}

export async function deleteUserAction(formData: FormData) {
  const userId = toSafeUserId(formData.get("userId"));

  if (!userId) {
    redirect("/admin/users?toast=invalid_input");
  }

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?toast=deleted");
}
