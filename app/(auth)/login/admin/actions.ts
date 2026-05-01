"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function loginAdmin(username: string, password: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("admin")
            .select("*")
            .eq("username", username)
            .single();

        if (error || !data) {
            return { error: "Incorrect username or password." };
        }

        const isValid = await bcrypt.compare(password, data.password);
        if (!isValid) {
            return { error: "Incorrect username or password." };
        }

        const token = await new SignJWT({ adminId: data.id })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("10h")
            .sign(secret);

        const cookieStore = await cookies();
        cookieStore.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 10 * 60 * 60, // 10 hours
            path: "/",
            sameSite: "lax",
        });

        return { success: true };
    } catch (err) {
        console.error("Login error:", err);
        return { error: "An unexpected error occurred." };
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
}
