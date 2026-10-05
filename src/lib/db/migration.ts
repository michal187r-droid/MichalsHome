// Database setup for stage 2 (tables, access rules). Safe to run more than once.
// Applied from /admin/setup on a preview deployment.
export const stage2Migration = `-- Stage 2: editable content, contact-form leads, questions & answers.
-- Every statement is safe to re-run.

-- Who may manage the site.
create table if not exists public.admins (
  email text primary key
);
insert into public.admins (email) values ('michal187r@gmail.com') on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.admins enable row level security;
drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated using (email = lower(auth.jwt() ->> 'email'));

-- Site text, one JSON document per section (hero, about, categories, ...).
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
drop policy if exists "anyone reads content" on public.site_content;
create policy "anyone reads content" on public.site_content
  for select to anon, authenticated using (true);
drop policy if exists "admin writes content" on public.site_content;
create policy "admin writes content" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Contact-form submissions.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 3 and 40),
  email text check (email is null or char_length(email) <= 200),
  service text check (service is null or char_length(service) <= 60),
  message text check (message is null or char_length(message) <= 4000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notes text check (notes is null or char_length(notes) <= 4000)
);
alter table public.leads enable row level security;
drop policy if exists "anyone submits a lead" on public.leads;
create policy "anyone submits a lead" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and notes is null);
drop policy if exists "admin manages leads" on public.leads;
create policy "admin manages leads" on public.leads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Questions from visitors; Michal answers and decides what to publish.
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  topic text check (topic is null or char_length(topic) <= 60),
  question text not null check (char_length(question) between 5 and 2000),
  asker_name text check (asker_name is null or char_length(asker_name) <= 120),
  asker_contact text check (asker_contact is null or char_length(asker_contact) <= 200),
  answer text check (answer is null or char_length(answer) <= 6000),
  published boolean not null default false,
  answered_at timestamptz
);
alter table public.questions enable row level security;
drop policy if exists "anyone submits a question" on public.questions;
create policy "anyone submits a question" on public.questions
  for insert to anon, authenticated
  with check (published = false and answer is null and answered_at is null);
drop policy if exists "admin manages questions" on public.questions;
create policy "admin manages questions" on public.questions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public view of answered questions: no asker name or contact details.
create or replace view public.published_questions as
  select id, topic, question, answer, answered_at
  from public.questions
  where published = true and answer is not null;
revoke all on public.published_questions from anon, authenticated;
grant select on public.published_questions to anon, authenticated;

-- Visitors only insert; they never read leads or unpublished questions back.
grant insert on public.leads, public.questions to anon;
`;
