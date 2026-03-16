-- Progetti clienti
create table projects (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    name text not null,
    client_name text not null,
    hourly_rate decimal(10,2),
    budget decimal(10,2),
    status text default 'active', -- active, completed, paused
    color text default '#6366f1',
    created_at timestamptz default now()
);

-- Sessioni di lavoro (time tracking)
create table time_entries (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    project_id uuid references projects not null,
    start_time timestamptz not null,
    end_time timestamptz,
    duration_minutes integer,
    notes text,
    billable boolean default true,
    created_at timestamptz default now()
);

-- Entrate manuali
create table income_entries (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    project_id uuid references projects,
    amount decimal(10,2) not null,
    description text,
    date date not null,
    category text default 'freelance', -- freelance, other
    created_at timestamptz default now()
);

-- Fatture
create table invoices (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    project_id uuid references projects not null,
    invoice_number text not null,
    amount decimal(10,2) not null,
    status text default 'draft', -- draft, sent, paid, overdue
    due_date date,
    notes text,
    created_at timestamptz default now()
);

-- Impostazioni utente
create table user_settings (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null unique,
    full_name text,
    business_name text,
    vat_number text,
    address text,
    tax_rate decimal(5,2) default 30.00, -- % da accantonare per tasse
    currency text default 'EUR',
    invoice_prefix text default 'INV',
    created_at timestamptz default now()
);

-- RLS Policies (sicurezza - ogni utente vede solo i propri dati)
alter table projects enable row level security;
alter table time_entries enable row level security;
alter table income_entries enable row level security;
alter table invoices enable row level security;
alter table user_settings enable row level security;

create policy "Users see own projects" on projects for all using (auth.uid() = user_id);
create policy "Users see own time entries" on time_entries for all using (auth.uid() = user_id);
create policy "Users see own income" on income_entries for all using (auth.uid() = user_id);
create policy "Users see own invoices" on invoices for all using (auth.uid() = user_id);
create policy "Users see own settings" on user_settings for all using (auth.uid() = user_id);