"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

function isValidUsername(username: string) {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username);
}

export async function loginAdmin(username: string, password: string) {
  let shouldRedirect = false;
  try {
    if (!username || !password) {
      return { error: "Invalid username or password." };
    }

    if (!isValidUsername(username)) {
      return { error: "Invalid username or password." };
    }

    if (password.length > 100) {
      return { error: "Invalid username or password." };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("admin")
      .select(
        "adminid, username, password, failed_attempts, lockout_until, lockout_count",
      )
      .eq("username", username)
      .maybeSingle();

    if (error || !data) {
      return { error: "Incorrect username or password." };
    }

    const now = new Date();

    if (data.lockout_until) {
      const lockUntil = new Date(data.lockout_until);

      if (lockUntil > now) {
        const secondsLeft = Math.ceil(
          (lockUntil.getTime() - now.getTime()) / 1000,
        );

        return {
          error: "Account locked.",
          lockSeconds: secondsLeft,
        };
      }
    }

    const isValid = await bcrypt.compare(password, data.password);

    if (!isValid) {
      const newAttempts = Number(data.failed_attempts ?? 0) + 1;

      if (newAttempts >= 3) {
        const newLockCount = Number(data.lockout_count ?? 0) + 1;
        const lockSeconds = 30 * newLockCount;

        const lockUntilDate = new Date(Date.now() + lockSeconds * 1000);

        await supabase
          .from("admin")
          .update({
            failed_attempts: 0,
            lockout_until: lockUntilDate.toISOString(),
            lockout_count: newLockCount,
          })
          .eq("adminid", data.adminid);

        return {
          error: "Too many attempts.",
          lockSeconds,
        };
      }

      await supabase
        .from("admin")
        .update({
          failed_attempts: newAttempts,
        })
        .eq("adminid", data.adminid);

      return { error: "Incorrect username or password." };
    }

    await supabase
      .from("admin")
      .update({
        failed_attempts: 0,
        lockout_until: null,
        lockout_count: 0,
      })
      .eq("adminid", data.adminid);

    const token = await new SignJWT({ adminId: data.adminid })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10h")
      .sign(secret);

    const cookieStore = await cookies(); 

    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 10,
      path: "/",
      sameSite: "lax",
    });
  } catch (err: any) {
    console.error("REAL ERROR:", err);
    return { error: err?.message || "Unexpected error" };
  }

  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();

  cookieStore.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });

  redirect("/login/admin");
}
