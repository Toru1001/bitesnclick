import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { error: deleteCustomerError } = await supabase
      .from("customers")
      .delete()
      .eq("customerid", user.id);

    if (deleteCustomerError) {
      return NextResponse.json(
        { error: deleteCustomerError.message },
        { status: 500 },
      );
    }

    const adminClient = createAdminClient(supabaseUrl, supabaseServiceRoleKey);
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
      user.id,
    );

    if (deleteUserError) {
      return NextResponse.json(
        { error: deleteUserError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: "Server error: " + err.message },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        { error: "Server error: unknown error occurred" },
        { status: 500 },
      );
    }
  }
}
