import { z } from 'zod';

// Shared password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password harus minimal 8 karakter')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password harus mengandung huruf besar, huruf kecil, dan angka'
  );

// Shared email validation
export const emailSchema = z
  .string()
  .email('Format email tidak valid');

// Register Form
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nama minimal 3 karakter')
      .max(100, 'Nama maksimal 100 karakter'),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'Anda harus setuju dengan Syarat dan Ketentuan',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Password tidak cocok',
    path: ['passwordConfirm'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Login Form
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password tidak boleh kosong'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Forgot Password Form
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset Password Form
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token tidak valid'),
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Password tidak cocok',
    path: ['passwordConfirm'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Confirm Password Form (for user-initiated password confirmation)
export const confirmPasswordSchema = z.object({
  password: z.string().min(1, 'Password tidak boleh kosong'),
});

export type ConfirmPasswordInput = z.infer<typeof confirmPasswordSchema>;

// Update Profile Form
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: emailSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Update Password Form
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password saat ini tidak boleh kosong'),
    newPassword: passwordSchema,
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: 'Password baru tidak cocok',
    path: ['newPasswordConfirm'],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

// Delete Profile Form
export const deleteProfileSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password tidak boleh kosong'),
});

export type DeleteProfileInput = z.infer<typeof deleteProfileSchema>;

// Action State for server action responses
export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export const initialActionState: ActionState = {
  success: false,
  message: '',
  errors: {},
};
