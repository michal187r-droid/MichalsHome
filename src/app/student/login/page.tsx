import Image from "next/image";
import { supabaseConfigured } from "@/lib/supabase/config";
import StudentLoginForm from "./StudentLoginForm";

export default function StudentLoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-card">
        <Image src="/logo-nav.png" alt="הבית של מיכל" width={480} height={350} className="admin-logo" />
        <h1>האזור האישי שלי</h1>
        <p className="admin-hint">נכנסים עם המייל והסיסמה שקיבלתם ממיכל.</p>
        {supabaseConfigured ? <StudentLoginForm /> : <p>הכניסה לא זמינה כרגע.</p>}
      </div>
    </div>
  );
}
