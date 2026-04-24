'use server';

import { redirect } from 'next/navigation';
import { hash, compare } from 'bcryptjs';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  createSession,
  destroySession,
  requireCurrentUser,
  markPasswordConfirmed,
} from '@/lib/auth/session';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  updatePasswordSchema,
  deleteProfileSchema,
  type ActionState,
  type RegisterInput,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type UpdateProfileInput,
  type UpdatePasswordInput,
  type DeleteProfileInput,
} from '@/lib/validation/auth-profile';
import { generateRandomString } from '@/lib/utils/crypto';

/**
 * Register a new user
 */
export async function registerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data: RegisterInput = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      passwordConfirm: formData.get('passwordConfirm') as string,
      agreeTerms: formData.get('agreeTerms') === 'on',
    };

    // Validate input
    registerSchema.parse(data);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'Email sudah terdaftar',
        errors: { email: ['Email sudah digunakan'] },
      };
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'user',
      },
    });

    // Create session
    await createSession(user.id, user.email, user.name, user.role);

    return {
      success: true,
      message: 'Pendaftaran berhasil!',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Data tidak valid',
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error('[registerAction]', error);
    return {
      success: false,
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    };
  }
}

/**
 * Login user
 */
export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data: LoginInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Validate input
    loginSchema.parse(data);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Email atau password salah',
      };
    }

    // Verify password
    const passwordMatch = await compare(data.password, user.password || '');

    if (!passwordMatch) {
      return {
        success: false,
        message: 'Email atau password salah',
      };
    }

    // Create session
    await createSession(user.id, user.email, user.name, user.role);

    return {
      success: true,
      message: 'Login berhasil!',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Data tidak valid',
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error('[loginAction]', error);
    return {
      success: false,
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    };
  }
}

/**
 * Logout user
 */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/login');
}

/**
 * Request password reset
 */
export async function requestPasswordResetAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data: ForgotPasswordInput = {
      email: formData.get('email') as string,
    };

    // Validate input
    forgotPasswordSchema.parse(data);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      // Return success for security (don't reveal if email exists)
      return {
        success: true,
        message:
          'Jika email terdaftar, link reset password akan dikirim ke email Anda.',
      };
    }

    // Generate reset token
    const resetToken = await generateRandomString();
    const hashedToken = await hash(resetToken, 10);

    // Store hashed token in database (1 hour expiry)
    await prisma.passwordResetToken.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        token: hashedToken,
        createdAt: new Date(),
      },
      update: {
        token: hashedToken,
        createdAt: new Date(),
      },
    });

    // TODO: Send email with reset link
    // const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${user.email}`;
    // await sendPasswordResetEmail(user.email, resetLink);

    return {
      success: true,
      message:
        'Jika email terdaftar, link reset password akan dikirim ke email Anda.',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Data tidak valid',
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error('[requestPasswordResetAction]', error);
    return {
      success: false,
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data: ResetPasswordInput = {
      token: formData.get('token') as string,
      password: formData.get('password') as string,
      passwordConfirm: formData.get('passwordConfirm') as string,
    };

    // Validate input
    resetPasswordSchema.parse(data);

    const email = formData.get('email') as string;
    if (!email) {
      return {
        success: false,
        message: 'Email tidak valid',
      };
    }

    // Find reset token
    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { email },
    });

    if (!resetTokenRecord) {
      return {
        success: false,
        message: 'Link reset password tidak valid atau sudah kadaluarsa',
      };
    }

    // Check token expiry (1 hour)
    const tokenAge = Date.now() - resetTokenRecord.createdAt.getTime();
    if (tokenAge > 60 * 60 * 1000) {
      return {
        success: false,
        message: 'Link reset password sudah kadaluarsa',
      };
    }

    // Verify token
    const tokenMatch = await compare(data.token, resetTokenRecord.token);
    if (!tokenMatch) {
      return {
        success: false,
        message: 'Link reset password tidak valid',
      };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Pengguna tidak ditemukan',
      };
    }

    // Hash new password
    const hashedPassword = await hash(data.password, 12);

    // Update password and delete token
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { email },
      }),
    ]);

    return {
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru.',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Data tidak valid',
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error('[resetPasswordAction]', error);
    return {
      success: false,
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireCurrentUser();

    const data: UpdateProfileInput = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };

    // Validate input
    updateProfileSchema.parse(data);

    // Check if new email already exists (if different)
    if (data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: 'Email sudah digunakan',
          errors: { email: ['Email sudah terdaftar'] },
        };
      }
    }

    // Update user
    await prisma.user.update({
      where: { id: parseInt(user.id) },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return {
      success: true,
      message: 'Profil berhasil diperbarui',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Data tidak valid',
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error('[updateProfileAction]', error);
    return {
      success: false,
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    };
  }
}

/**
 * Update user password
 */
export async function updatePasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireCurrentUser();

    const data: UpdatePasswordInput = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      newPasswordConfirm: formData.get('newPasswordConfirm') as string,
    };

    // Validate input
    updatePasswordSchema.parse(data);

    // Fetch full user with password from database
    const fullUser = await prisma.user.findUnique({
      where: { id: parseInt(user.id) },
    });

    if (!fullUser) {
      return {
        success: false,
        message: 'Pengguna tidak ditemukan',
      };
    }

    // Verify current password
    const passwordMatch = await compare(data.currentPassword, fullUser.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: 'Password saat ini tidak sesuai',
      };
    }

    // Hash new password
    const hashedPassword = await hash(data.newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: fullUser.id },
      data: { password: hashedPassword },
    });

    // Mark password as confirmed
    await markPasswordConfirmed();

    return {
      success: true,
      message: 'Password berhasil diperbarui',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Data tidak valid',
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error('[updatePasswordAction]', error);
    return {
      success: false,
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    };
  }
}

/**
 * Delete user account
 */
export async function deleteProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await requireCurrentUser();

    const data: DeleteProfileInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Validate input
    deleteProfileSchema.parse(data);

    // Verify email matches
    if (data.email !== user.email) {
      return {
        success: false,
        message: 'Email tidak sesuai',
      };
    }

    // Fetch full user with password from database
    const fullUser = await prisma.user.findUnique({
      where: { id: parseInt(user.id) },
    });

    if (!fullUser) {
      return {
        success: false,
        message: 'Pengguna tidak ditemukan',
      };
    }

    // Verify password
    const passwordMatch = await compare(data.password, fullUser.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: 'Password tidak sesuai',
      };
    }

    // Delete user
    await prisma.user.delete({
      where: { id: fullUser.id },
    });

    // Destroy session
    await destroySession();

    return {
      success: true,
      message: 'Akun berhasil dihapus',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: 'Data tidak valid',
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    console.error('[deleteProfileAction]', error);
    return {
      success: false,
      message: 'Terjadi kesalahan. Silakan coba lagi.',
    };
  }
}
