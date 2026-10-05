// Database setup (tables, access rules). Every statement is safe to re-run.
// Applied in order from /admin/setup on a preview deployment.
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

export const stage3Migration = `-- Stage 3: student area – students, tasks, completion by the student.

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  login_email text not null,
  created_at timestamptz not null default now()
);
alter table public.students enable row level security;
drop policy if exists "admin manages students" on public.students;
create policy "admin manages students" on public.students
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "student reads self" on public.students;
create policy "student reads self" on public.students
  for select to authenticated using (user_id = auth.uid());

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  created_at timestamptz not null default now(),
  title text not null check (char_length(title) between 1 and 200),
  instructions text check (instructions is null or char_length(instructions) <= 6000),
  due_date date,
  answer_requested boolean not null default false,
  status text not null default 'open' check (status in ('open', 'done')),
  answer text check (answer is null or char_length(answer) <= 10000),
  done_at timestamptz,
  seen_by_admin boolean not null default true,
  feedback text check (feedback is null or char_length(feedback) <= 4000)
);
create index if not exists tasks_student_idx on public.tasks (student_id);
alter table public.tasks enable row level security;
drop policy if exists "admin manages tasks" on public.tasks;
create policy "admin manages tasks" on public.tasks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "student reads own tasks" on public.tasks;
create policy "student reads own tasks" on public.tasks
  for select to authenticated using (
    exists (select 1 from public.students s where s.id = tasks.student_id and s.user_id = auth.uid())
  );

-- Students never update rows directly; this function only touches the
-- answer/status of their own task and flags it for Michal.
create or replace function public.complete_task(p_task uuid, p_answer text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tasks t
     set status = 'done',
         answer = nullif(left(coalesce(p_answer, ''), 10000), ''),
         done_at = now(),
         seen_by_admin = false
   where t.id = p_task
     and exists (select 1 from public.students s where s.id = t.student_id and s.user_id = auth.uid());
  return found;
end;
$$;
revoke all on function public.complete_task(uuid, text) from public, anon;
grant execute on function public.complete_task(uuid, text) to authenticated;
`;

export const migrations = [stage2Migration, stage3Migration];
