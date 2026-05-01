"use server";

import { cookies } from "next/headers";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function loginAdmin(username: string, password: string) {
    try {
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

        const cookieStore = await cookies();
        cookieStore.set("admin_session", data.id.toString(), {
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
