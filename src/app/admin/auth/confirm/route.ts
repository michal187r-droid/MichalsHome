import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { serverClient } from "@/lib/supabase/server";

// Landing spot for the password-reset email: turns the link into a login
// session, then sends Michal to choose a new password.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const supabase = await serverClient();

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: (params.get("type") as EmailOtpType) ?? "recovery" })
      : { error: new Error("missing code") };

  const target = error ? "/admin/reset?expired=1" : "/admin/reset";
  return NextResponse.redirect(new URL(target, request.url));
}
