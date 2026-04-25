-- Use this if you already executed the first/old database.sql in Supabase.
-- It only adds the new patient fields and policies needed by the updated app.
-- It does not reinsert demo reports, treatments, events, or messages.

alter table public.patients add column if not exists first_name text not null default '';
alter table public.patients add column if not exists last_name text not null default '';
alter table public.patients add column if not exists phone text not null default '';

update public.patients set first_name = 'Youssef', last_name = 'Benali', phone = '+212 600 100 204'
where code = 'PAT-2048' and first_name = '';

update public.patients set first_name = 'Meryem', last_name = 'El Fassi', phone = '+212 600 100 319'
where code = 'PAT-3190' and first_name = '';

update public.patients set first_name = 'Karim', last_name = 'Alaoui', phone = '+212 600 100 772'
where code = 'PAT-7721' and first_name = '';

drop policy if exists prototype_insert_patients on public.patients;
create policy prototype_insert_patients
  on public.patients for insert
  to anon
  with check (true);

drop policy if exists prototype_insert_treatments on public.treatments;
create policy prototype_insert_treatments
  on public.treatments for insert
  to anon
  with check (true);

drop policy if exists prototype_insert_events on public.medical_events;
create policy prototype_insert_events
  on public.medical_events for insert
  to anon
  with check (true);
