-- Supabase / PostgreSQL schema for the MICI patient follow-up prototype.
-- Run this file in Supabase SQL Editor, then paste the Project URL and anon key
-- into config.js. The dashboard never asks for Supabase credentials.

create extension if not exists pgcrypto;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  code text not null unique,
  diagnosis text not null check (diagnosis in ('Crohn', 'RCH')),
  current_treatment text not null,
  created_at timestamptz not null default now()
);

alter table public.patients add column if not exists first_name text not null default '';
alter table public.patients add column if not exists last_name text not null default '';
alter table public.patients add column if not exists phone text not null default '';

create table if not exists public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  treatment_taken boolean not null default false,
  stools integer not null check (stools between 0 and 30),
  blood boolean not null default false,
  pain integer not null check (pain between 0 and 10),
  fever boolean not null default false,
  fatigue integer not null check (fatigue between 0 and 10),
  side_effects text not null default '',
  general_state text not null check (general_state in ('good', 'medium', 'bad')),
  score integer not null default 0 check (score between 0 and 15),
  submitted_at timestamptz not null default now()
);

create table if not exists public.treatments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  label text not null,
  start_date date not null,
  end_date date,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.medical_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  type text not null,
  title text not null,
  details text not null default '',
  event_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  direction text not null check (direction in ('doctor_to_patient', 'patient_to_doctor')),
  content text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists daily_reports_patient_date_idx
  on public.daily_reports (patient_id, submitted_at desc);

create index if not exists messages_patient_date_idx
  on public.messages (patient_id, created_at desc);

alter table public.patients enable row level security;
alter table public.daily_reports enable row level security;
alter table public.treatments enable row level security;
alter table public.medical_events enable row level security;
alter table public.messages enable row level security;

-- Prototype policies only. For production medical data, replace these with
-- authenticated doctor/patient roles, least-privilege access, audit logs, and
-- server-side authorization.
drop policy if exists prototype_read_patients on public.patients;
create policy prototype_read_patients
  on public.patients for select
  to anon
  using (true);

drop policy if exists prototype_insert_patients on public.patients;
create policy prototype_insert_patients
  on public.patients for insert
  to anon
  with check (true);

drop policy if exists prototype_read_reports on public.daily_reports;
create policy prototype_read_reports
  on public.daily_reports for select
  to anon
  using (true);

drop policy if exists prototype_insert_reports on public.daily_reports;
create policy prototype_insert_reports
  on public.daily_reports for insert
  to anon
  with check (true);

drop policy if exists prototype_read_treatments on public.treatments;
create policy prototype_read_treatments
  on public.treatments for select
  to anon
  using (true);

drop policy if exists prototype_insert_treatments on public.treatments;
create policy prototype_insert_treatments
  on public.treatments for insert
  to anon
  with check (true);

drop policy if exists prototype_read_events on public.medical_events;
create policy prototype_read_events
  on public.medical_events for select
  to anon
  using (true);

drop policy if exists prototype_insert_events on public.medical_events;
create policy prototype_insert_events
  on public.medical_events for insert
  to anon
  with check (true);

drop policy if exists prototype_read_messages on public.messages;
create policy prototype_read_messages
  on public.messages for select
  to anon
  using (true);

drop policy if exists prototype_insert_messages on public.messages;
create policy prototype_insert_messages
  on public.messages for insert
  to anon
  with check (true);

-- Minimal remote seed so the app has data immediately after connecting.
insert into public.patients (id, first_name, last_name, phone, code, diagnosis, current_treatment, created_at) values
  ('11111111-1111-1111-1111-111111111111', 'Youssef', 'Benali', '+212 600 100 204', 'PAT-2048', 'Crohn', 'Biothérapie anti-TNF', now() - interval '48 days'),
  ('22222222-2222-2222-2222-222222222222', 'Meryem', 'El Fassi', '+212 600 100 319', 'PAT-3190', 'RCH', 'Mésalazine + CTC décroissance', now() - interval '42 days'),
  ('33333333-3333-3333-3333-333333333333', 'Karim', 'Alaoui', '+212 600 100 772', 'PAT-7721', 'Crohn', 'Ustékinumab', now() - interval '30 days')
on conflict (id) do nothing;

update public.patients set first_name = 'Youssef', last_name = 'Benali', phone = '+212 600 100 204'
where id = '11111111-1111-1111-1111-111111111111';

update public.patients set first_name = 'Meryem', last_name = 'El Fassi', phone = '+212 600 100 319'
where id = '22222222-2222-2222-2222-222222222222';

update public.patients set first_name = 'Karim', last_name = 'Alaoui', phone = '+212 600 100 772'
where id = '33333333-3333-3333-3333-333333333333';

insert into public.daily_reports (
  patient_id, treatment_taken, stools, blood, pain, fever, fatigue, side_effects, general_state, score, submitted_at
) values
  ('11111111-1111-1111-1111-111111111111', true, 3, false, 2, false, 3, '', 'good', 1, now() - interval '2 days'),
  ('11111111-1111-1111-1111-111111111111', true, 2, false, 1, false, 2, '', 'good', 0, now() - interval '1 day'),
  ('22222222-2222-2222-2222-222222222222', true, 6, false, 5, false, 6, 'nausées légères', 'medium', 7, now() - interval '2 days'),
  ('22222222-2222-2222-2222-222222222222', false, 8, true, 6, false, 7, '', 'medium', 10, now() - interval '1 day'),
  ('33333333-3333-3333-3333-333333333333', false, 10, true, 8, true, 9, 'céphalées et nausées', 'bad', 15, now() - interval '8 hours')
on conflict do nothing;

insert into public.treatments (patient_id, label, start_date, notes) values
  ('11111111-1111-1111-1111-111111111111', 'Anti-TNF 40 mg toutes les 2 semaines', current_date - 120, 'Bonne tolérance.'),
  ('22222222-2222-2222-2222-222222222222', 'Mésalazine 4 g/j', current_date - 90, 'CTC ajouté lors de la dernière poussée.'),
  ('33333333-3333-3333-3333-333333333333', 'Ustékinumab 90 mg', current_date - 65, 'Réévaluation si symptômes persistants.')
on conflict do nothing;

insert into public.medical_events (patient_id, type, title, details, event_date) values
  ('11111111-1111-1111-1111-111111111111', 'Consultation', 'Contrôle trimestriel', 'Score bas, poursuite du traitement.', now() - interval '18 days'),
  ('22222222-2222-2222-2222-222222222222', 'Alerte', 'Augmentation du transit', 'Surveillance renforcée pendant 72 h.', now() - interval '2 days'),
  ('33333333-3333-3333-3333-333333333333', 'Alerte rouge', 'Sang, fièvre et douleur', 'Contact recommandé et bilan biologique à discuter.', now() - interval '8 hours')
on conflict do nothing;

insert into public.messages (patient_id, direction, content, created_at) values
  ('33333333-3333-3333-3333-333333333333', 'doctor_to_patient', 'Merci de contacter le cabinet aujourd’hui pour organiser une évaluation.', now() - interval '7 hours'),
  ('22222222-2222-2222-2222-222222222222', 'doctor_to_patient', 'Continuez le questionnaire quotidien, nous surveillons l’évolution.', now() - interval '1 day')
on conflict do nothing;
