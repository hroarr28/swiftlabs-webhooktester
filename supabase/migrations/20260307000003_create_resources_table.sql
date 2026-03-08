-- Resources Table
-- Generic CRUD resource pattern - adapt for your use case

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.resources enable row level security;

-- Policies
create policy "Users can view own resources"
  on public.resources
  for select
  using (auth.uid() = user_id);

create policy "Users can create own resources"
  on public.resources
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resources"
  on public.resources
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own resources"
  on public.resources
  for delete
  using (auth.uid() = user_id);

-- Indexes
create index resources_user_id_idx on public.resources(user_id);
create index resources_status_idx on public.resources(status);
create index resources_created_at_idx on public.resources(created_at desc);

-- Updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_resources_updated_at
  before update on public.resources
  for each row
  execute function update_updated_at_column();
