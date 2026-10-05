"use server";

import { publicClient } from "@/lib/supabase/public";

export type FormState = { ok: boolean; error?: string } | null;

const text = (data: FormData, key: string, max: number) =>
  String(data.get(key) ?? "").trim().slice(0, max);

/** Contact form → leads table. */
export async function submitLead(_prev: FormState, data: FormData): Promise<FormState> {
  // Bots fill every field, including this hidden one.
  if (text(data, "website", 200)) return { ok: true };

  const name = text(data, "name", 120);
  const phone = text(data, "phone", 40);
  if (!name || phone.replace(/\D/g, "").length < 9) {
    return { ok: false, error: "נא למלא שם ומספר טלפון תקין." };
  }

  const supabase = publicClient();
  if (!supabase) return { ok: false, error: "השליחה לא זמינה כרגע. אפשר לפנות בוואטסאפ." };

  const { error } = await supabase.from("leads").insert({
    name,
    phone,
    email: text(data, "email", 200) || null,
    service: text(data, "service", 60) || null,
    message: text(data, "message", 4000) || null,
  });
  if (error) return { ok: false, error: "משהו השתבש בשליחה. אפשר לנסות שוב או לפנות בוואטסאפ." };
  return { ok: true };
}

/** Questions & answers form → questions table (unpublished until Michal answers). */
export async function submitQuestion(_prev: FormState, data: FormData): Promise<FormState> {
  if (text(data, "website", 200)) return { ok: true };

  const question = text(data, "question", 2000);
  if (question.length < 5) return { ok: false, error: "נא לכתוב את השאלה." };

  const supabase = publicClient();
  if (!supabase) return { ok: false, error: "השליחה לא זמינה כרגע. אפשר לשאול בוואטסאפ." };

  const { error } = await supabase.from("questions").insert({
    question,
    topic: text(data, "topic", 60) || null,
    asker_name: text(data, "name", 120) || null,
    asker_contact: text(data, "contact", 200) || null,
  });
  if (error) return { ok: false, error: "משהו השתבש בשליחה. אפשר לנסות שוב." };
  return { ok: true };
}
