"use server";

import { SigninSchema, RegisterSchema } from "@/lib/zod";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const signUpCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name, username, email, password } = validatedFields.data;
  const hashedPassword = hashSync(password, 10);
  try {
    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });
  } catch {
    return {
      message: "Pendaftaran Gagal ! Akun sudah ada.",
    };
  }

  redirect("/login");
};

// Login Credential

export const signInCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validatedFields = SigninSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // ✅ Tangkap error auth dari next-auth
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Email atau password salah." };
        default:
          return { message: "Terjadi kesalahan server." };
      }
    }
    throw error;
  }
};
