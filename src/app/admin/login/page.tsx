import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (supabaseConfigured && (await getAdmin())) redirect("/admin");

  return (
    <div className="admin-login">
      <div className="admin-card">
        <Image src="/logo-nav.png" alt="הבית של מיכל" width={480} height={350} className="admin-logo" />
        <h1>כניסה לניהול האתר</h1>
        {supabaseConfigured ? <LoginForm /> : <p>מסד הנתונים לא מחובר בסביבה הזו.</p>}
      </div>
    </div>
  );
}
