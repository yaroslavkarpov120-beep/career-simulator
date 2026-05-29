-- Career Simulator schema (run in Supabase SQL editor when configured)

create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  input_json jsonb not null,
  result_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists simulations_user_id_idx on public.simulations (user_id);
create index if not exists simulations_created_at_idx on public.simulations (created_at desc);

alter table public.simulations enable row level security;

create policy "Users read own simulations"
  on public.simulations for select
  using (auth.uid() = user_id);

create policy "Users insert own simulations"
  on public.simulations for insert
  with check (auth.uid() = user_id);

create table if not exists public.b2b_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  school text not null,
  created_at timestamptz not null default now()
);

alter table public.b2b_waitlist enable row level security;

create policy "Anyone can insert waitlist"
  on public.b2b_waitlist for insert
  with check (true);
