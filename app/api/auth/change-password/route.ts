import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { oldPassword, newPassword, captchaToken } = await request.json();

    console.log("Received payload:", {
      oldPassword: oldPassword ? "***" : undefined,
      newPassword: newPassword ? "***" : undefined,
      captchaToken: captchaToken ? `${captchaToken.substring(0, 20)}...` : "MISSING",
    });

    if (!oldPassword || !newPassword || !captchaToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current user from the auth header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    console.log("Attempting password change with valid token");

    // Update password using the REST API directly
    const updateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ password: newPassword }),
      }
    );

    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
      console.error("Password update error:", updateData);
      return NextResponse.json(
        { error: updateData.message || "Failed to update password" },
        { status: 400 }
      );
    }

    console.log("Password updated successfully");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in change-password route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
