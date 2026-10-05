import { notFound } from "next/navigation";
import { setupAllowed } from "./actions";
import SetupForms from "./SetupForms";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (!(await setupAllowed())) notFound();
  return (
    <div className="admin-login">
      <div className="admin-card">
        <h1>הקמת עמוד הניהול</h1>
        <SetupForms />
      </div>
    </div>
  );
}
