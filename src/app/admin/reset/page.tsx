import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";
import NewPasswordForm from "./NewPasswordForm";

export const dynamic = "force-dynamic";

export default async function ResetPage({ searchParams }: PageProps<"/admin/reset">) {
  const { expired } = await searchParams;
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="admin-login">
      <div className="admin-card">
        <h1>בחירת סיסמה חדשה</h1>
        {user && !expired ? (
          <NewPasswordForm />
        ) : (
          <>
            <p>הקישור לא תקף או שפג תוקפו. אפשר לבקש קישור חדש מעמוד הכניסה.</p>
            <Link href="/admin/login" className="admin-link">
              לעמוד הכניסה
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
