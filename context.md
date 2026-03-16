FreelanceOS — Contesto Progetto per OpenClaw

🎯 Cos'è FreelanceOS
FreelanceOS è un SaaS per freelancer che sostituisce 3-4 tool separati con un unico cockpit. Il freelancer oggi paga €30–50/mese su tool diversi (Toggl, FreshBooks, Calendly, ecc.). FreelanceOS li sostituisce tutti a €19/mese.

Problema che risolve:
*   Entrate irregolari → non sa quante tasse mettere da parte
*   Time tracking su Excel → fattura manuale = ore perse
*   Booking call frammentato → nessun follow-up automatico
*   Nessuna visione della profittabilità per progetto

👤 Target Utente
Freelancer digitali (designer, developer, copywriter, consulenti) che:
*   Lavorano con 2–10 clienti attivi contemporaneamente
*   Fatturano a ore o a progetto
*   Odiano la burocrazia e l'amministrazione
*   Usano già Stripe o PayPal per ricevere pagamenti
*   Sono disposti a pagare €15–20/mese per risparmiare 5+ ore/mese

💡 SaaS da cui prendere ispirazione
*   Design & UX
    *   Linear.app → UI minimalista, dark mode, velocità percepita, shortcuts da tastiera
    *   Vercel Dashboard → layout pulito, dati tecnici resi semplici, typography chiara
    *   Superhuman → onboarding premium, ogni azione deve sembrare veloce
    *   Craft.do → uso dello spazio bianco, gerarchia visiva
*   Feature
    *   Ispirazione
        *   Toggl Track (toggl.com/track) → timer, report ore, breakdown per progetto
        *   FreshBooks (freshbooks.com) → fatturazione, invoice PDF, time-to-invoice
        *   Bonsai (hellobonsai.com) → tutto-in-uno per freelancer, proposta + contratto + fattura
        *   AND.CO (and.co) → dashboard freelance, expense tracking, tax estimation
        *   Moxie (joinmoxie.com) → CRM freelance, pipeline clienti, scheduling
        *   Calendly (calendly.com) → booking page, availability, reminder automatici


Pricing Competitivo
| Competitor         | Prezzo       | Problema                                  |
| ------------------ | ----------- | ----------------------------------------- |
| FreshBooks Starter | $13/mese    | Solo contabilità, no time tracking        |
| Toggl Track        | $9/mese     | Solo time tracking, no fatture             |
| Calendly Standard  | $10/mese    | Solo booking, niente altro                  |
| Bonsai             | $24/mese    | Buono ma UX datata                         |
| FreelanceOS        | €19/mese    | Tutto in uno, UX moderna                    |


💶 Modello di Business e Pricing
*   Piani
    *   FREE (per sempre)
        *   2 progetti attivi
        *   10 fatture/mese
        *   Time tracking illimitato
        *   No PDF personalizzati
    *   PRO — €19/mese (o €15/mese se annuale)
        *   Progetti illimitati
        *   Fatture illimitate
        *   PDF branded con logo
        *   Booking page
*   Extra Features (futuro)
    *   Stima tasse avanzata
    *   Export CSV/Excel
    *   Supporto prioritario
*   Implementazione Stripe
    *   Crea 2 prodotti su Stripe: PRO mensile (€19) e PRO annuale (€180)
    *   Usa Stripe Checkout per il pagamento
    *   Webhook per aggiornare lo stato abbonamento su Supabase
    *   Tabella subscriptions collegata a user_id


🏗️ Architettura Tecnica
*   Stack
    *   Frontend: Next.js 14 (App Router) + TypeScript
    *   Styling: Tailwind CSS + shadcn/ui components
    *   Database: Supabase (PostgreSQL)
    *   Auth: Supabase Auth (email + Google OAuth)
    *   Pagamenti: Stripe (abbonamenti ricorrenti)
    *   PDF: jsPDF o react-pdf per generazione fatture
    *   Email: Resend per email transazionali e reminder
    *   Deploy: Vercel
*   Variabili d'Ambiente necessarie
    *   NEXT_PUBLIC_SUPABASE_URL=
    *   NEXT_PUBLIC_SUPABASE_ANON_KEY=
    *   SUPABASE_SERVICE_ROLE_KEY=
    *   STRIPE_SECRET_KEY=
    *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    *   NEXT_PUBLIC_SITE_URL=
    *   RESEND_API_KEY=


🗄️ Schema Database (Supabase)

```sql
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
```


📱 Struttura Pagine e Navigazione
*   / → Landing page (pubblica)
*   /login → Login / Registrazione
*   /onboarding → Setup iniziale (nome, tariffa oraria default, valuta)
*   /dashboard → Home: overview mese corrente
*   /dashboard/timer → Time tracker attivo
*   /dashboard/projects → Lista progetti + crea nuovo
*   /dashboard/projects/[id] → Dettaglio progetto (ore, fatture, entrate)
*   /dashboard/finance → Entrate, tasse stimate, breakdown mensile
*   /dashboard/invoices → Lista fatture
*   /dashboard/invoices/new → Crea fattura
*   /dashboard/invoices/[id] → Dettaglio fattura + preview PDF
*   /dashboard/booking → Pagina booking pubblica setup
*   /dashboard/settings → Profilo, dati fiscali, abbonamento

🎨 Design System
*   Colori (dark mode first)
    *   --background: #0a0a0a
    *   --surface: #111111
    *   --surface-2: #1a1a1a
    *   --border: #2a2a2a
    *   --text-primary: #fafafa
    *   --text-secondary: #888888
    *   --accent: #6366f1 /* indigo - colore principale */
    *   --accent-green: #22c55e /* entrate / positivo */
    *   --accent-red: #ef4444 /* spese / negativo */
    *   --accent-yellow: #eab308 /* pending / attenzione */
*   Tipografia
    *   Font: Geist (default Next.js) o Inter
    *   Heading: font-semibold, tracking-tight
    *   Body: font-normal, text-sm per dati, text-base per contenuto
*   Componenti chiave da costruire
    *   <StatCard> — card con numero grande + label + trend percentuale
    *   <TimerWidget> — timer con play/stop, progetto selector, ore correnti
    *   <ProjectBadge> — pill colorata con nome progetto
    *   <InvoiceRow> — riga tabella fattura con status badge
    *   <TaxMeter> — progress bar "tasse accantonate vs stimate"

📊 Dashboard — Cosa mostrare
*   Overview (mese corrente)
    *   💰 Entrate totali mese
    *   ⏱️ Ore lavorate mese
    *   📄 Fatture in attesa di pagamento
    *   🏦 Importo da accantonare per tasse (entrate × tax_rate%)
*   Widget Timer (sempre visibile)
    *   Progetto attivo corrente
    *   Ore:minuti:secondi del timer
    *   Bottone START / STOP
    *   Note veloci
*   Grafico entrate (ultimi 6 mesi)
    *   Bar chart semplice con recharts
    *   Linea tasse stimate sovrapposta


🧠 Come usare questo file
Ogni volta che inizi una nuova sessione di lavoro sul progetto FreelanceOS, leggi questo file prima di fare qualsiasi cosa.

Quando implementi una feature:
*   Controlla la sezione Ordine di Sviluppo per capire cosa fare
*   Rispetta il Design System per colori e componenti
*   Usa lo Schema Database come riferimento per le query
*   Guarda i SaaS di ispirazione per capire come deve funzionare la UX
*   Segui le Regole importanti senza eccezioni

Quando hai dubbi su una feature, pensa: "Come lo farebbe Bonsai o Linear?"


🎯 Cos'è FreelanceOS
FreelanceOS è un SaaS per freelancer che sostituisce 3-4 tool separati con un unico cockpit. Il freelancer oggi paga €30–50/mese su tool diversi (Toggl, FreshBooks, Calendly, ecc.). FreelanceOS li sostituisce tutti a €19/mese.

Problema che risolve:
*   Entrate irregolari → non sa quante tasse mettere da parte
*   Time tracking su Excel → fattura manuale = ore perse
*   Booking call frammentato → nessun follow-up automatico
*   Nessuna visione della profittabilità per progetto

👤 Target Utente
Freelancer digitali (designer, developer, copywriter, consulenti) che:
*   Lavorano con 2–10 clienti attivi contemporaneamente
*   Fatturano a ore o a progetto
*   Odiano la burocrazia e l'amministrazione
*   Usano già Stripe o PayPal per ricevere pagamenti
*   Sono disposti a pagare €15–20/mese per risparmiare 5+ ore/mese

💡 SaaS da cui prendere ispirazione
*   Design & UX
    *   Linear.app → UI minimalista, dark mode, velocità percepita, shortcuts da tastiera
    *   Vercel Dashboard → layout pulito, dati tecnici resi semplici, typography chiara
    *   Superhuman → onboarding premium, ogni azione deve sembrare veloce
    *   Craft.do → uso dello spazio bianco, gerarchia visiva
*   Feature
    *   Ispirazione
        *   Toggl Track (toggl.com/track) → timer, report ore, breakdown per progetto
        *   FreshBooks (freshbooks.com) → fatturazione, invoice PDF, time-to-invoice
        *   Bonsai (hellobonsai.com) → tutto-in-uno per freelancer, proposta + contratto + fattura
        *   AND.CO (and.co) → dashboard freelance, expense tracking, tax estimation
        *   Moxie (joinmoxie.com) → CRM freelance, pipeline clienti, scheduling
        *   Calendly (calendly.com) → booking page, availability, reminder automatici



Pricing Competitivo
| Competitor         | Prezzo       | Problema                                  |
| ------------------ | ----------- | ----------------------------------------- |
| FreshBooks Starter | $13/mese    | Solo contabilità, no time tracking        |
| Toggl Track        | $9/mese     | Solo time tracking, no fatture             |
| Calendly Standard  | $10/mese    | Solo booking, niente altro                  |
| Bonsai             | $24/mese    | Buono ma UX datata                         |
| FreelanceOS        | €19/mese    | Tutto in uno, UX moderna                    |


🏗️ Architettura Tecnica
*   Stack
    *   Frontend: Next.js 14 (App Router) + TypeScript
    *   Styling: Tailwind CSS + shadcn/ui components
    *   Database: Supabase (PostgreSQL)
    *   Auth: Supabase Auth (email + Google OAuth)
    *   Pagamenti: Stripe (abbonamenti ricorrenti)
    *   PDF: jsPDF o react-pdf per generazione fatture
    *   Email: Resend per email transazionali e reminder
    *   Deploy: Vercel
*   Variabili d'Ambiente necessarie
    *   NEXT_PUBLIC_SUPABASE_URL=
    *   NEXT_PUBLIC_SUPABASE_ANON_KEY=
    *   SUPABASE_SERVICE_ROLE_KEY=
    *   STRIPE_SECRET_KEY=
    *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    *   NEXT_PUBLIC_SITE_URL=
    *   RESEND_API_KEY=


🗄️ Schema Database (Supabase)

```sql
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
```


📱 Struttura Pagine e Navigazione
*   / → Landing page (pubblica)
*   /login → Login / Registrazione
*   /onboarding → Setup iniziale (nome, tariffa oraria default, valuta)
*   /dashboard → Home: overview mese corrente
*   /dashboard/timer → Time tracker attivo
*   /dashboard/projects → Lista progetti + crea nuovo
*   /dashboard/projects/[id] → Dettaglio progetto (ore, fatture, entrate)
*   /dashboard/finance → Entrate, tasse stimate, breakdown mensile
*   /dashboard/invoices → Lista fatture
*   /dashboard/invoices/new → Crea fattura
*   /dashboard/invoices/[id] → Dettaglio fattura + preview PDF
*   /dashboard/booking → Pagina booking pubblica setup
*   /dashboard/settings → Profilo, dati fiscali, abbonamento

🎨 Design System
*   Colori (dark mode first)
    *   --background: #0a0a0a
    *   --surface: #111111
    *   --surface-2: #1a1a1a
    *   --border: #2a2a2a
    *   --text-primary: #fafafa
    *   --text-secondary: #888888
    *   --accent: #6366f1 /* indigo - colore principale */
    *   --accent-green: #22c55e /* entrate / positivo */
    *   --accent-red: #ef4444 /* spese / negativo */
    *   --accent-yellow: #eab308 /* pending / attenzione */
*   Tipografia
    *   Font: Geist (default Next.js) o Inter
    *   Heading: font-semibold, tracking-tight
    *   Body: font-normal, text-sm per dati, text-base per contenuto
*   Componenti chiave da costruire
    *   <StatCard> — card con numero grande + label + trend percentuale
    *   <TimerWidget> — timer con play/stop, progetto selector, ore correnti
    *   <ProjectBadge> — pill colorata con nome progetto
    *   <InvoiceRow> — riga tabella fattura con status badge
    *   <TaxMeter> — progress bar "tasse accantonate vs stimate"

📊 Dashboard — Cosa mostrare
*   Overview (mese corrente)
    *   💰 Entrate totali mese
    *   ⏱️ Ore lavorate mese
    *   📄 Fatture in attesa di pagamento
    *   🏦 Importo da accantonare per tasse (entrate × tax_rate%)
*   Widget Timer (sempre visibile)
    *   Progetto attivo corrente
    *   Ore:minuti:secondi del timer
    *   Bottone START / STOP
    *   Note veloci
*   Grafico entrate (ultimi 6 mesi)
    *   Bar chart semplice con recharts
    *   Linea tasse stimate sovrapposta


💶 Modello di Business e Pricing
*   Piani
    *   FREE (per sempre)
        *   2 progetti attivi
        *   10 fatture/mese
        *   Time tracking illimitato
        *   No PDF personalizzati
    *   PRO — €19/mese (o €15/mese se annuale)
        *   Progetti illimitati
        *   Fatture illimitate
        *   PDF branded con logo
        *   Booking page

🎯 Cos'è FreelanceOS
FreelanceOS è un SaaS per freelancer che sostituisce 3-4 tool separati con un unico cockpit. Il freelancer oggi paga €30–50/mese su tool diversi (Toggl, FreshBooks, Calendly, ecc.). FreelanceOS li sostituisce tutti a €19/mese.

Problema che risolve:
*   Entrate irregolari → non sa quante tasse mettere da parte
*   Time tracking su Excel → fattura manuale = ore perse
*   Booking call frammentato → nessun follow-up automatico
*   Nessuna visione della profittabilità per progetto

👤 Target Utente
Freelancer digitali (designer, developer, copywriter, consulenti) che:
*   Lavorano con 2–10 clienti attivi contemporaneamente
*   Fatturano a ore o a progetto
*   Odiano la burocrazia e l'amministrazione
*   Usano già Stripe o PayPal per ricevere pagamenti
*   Sono disposti a pagare €15–20/mese per risparmiare 5+ ore/mese

💡 SaaS da cui prendere ispirazione
*   Design & UX
    *   Linear.app → UI minimalista, dark mode, velocità percepita, shortcuts da tastiera
    *   Vercel Dashboard → layout pulito, dati tecnici resi semplici, typography chiara
    *   Superhuman → onboarding premium, ogni azione deve sembrare veloce
    *   Craft.do → uso dello spazio bianco, gerarchia visiva
*   Feature
    *   Ispirazione
        *   Toggl Track (toggl.com/track) → timer, report ore, breakdown per progetto
        *   FreshBooks (freshbooks.com) → fatturazione, invoice PDF, time-to-invoice
        *   Bonsai (hellobonsai.com) → tutto-in-uno per freelancer, proposta + contratto + fattura
        *   AND.CO (and.co) → dashboard freelance, expense tracking, tax estimation
        *   Moxie (joinmoxie.com) → CRM freelance, pipeline clienti, scheduling
        *   Calendly (calendly.com) → booking page, availability, reminder automatici



Pricing Competitivo
| Competitor         | Prezzo       | Problema                                  |
| ------------------ | ----------- | ----------------------------------------- |
| FreshBooks Starter | $13/mese    | Solo contabilità, no time tracking        |
| Toggl Track        | $9/mese     | Solo time tracking, no fatture             |
| Calendly Standard  | $10/mese    | Solo booking, niente altro                  |
| Bonsai             | $24/mese    | Buono ma UX datata                         |
| FreelanceOS        | €19/mese    | Tutto in uno, UX moderna                    |


🏗️ Architettura Tecnica
*   Stack
    *   Frontend: Next.js 14 (App Router) + TypeScript
    *   Styling: Tailwind CSS + shadcn/ui components
    *   Database: Supabase (PostgreSQL)
    *   Auth: Supabase Auth (email + Google OAuth)
    *   Pagamenti: Stripe (abbonamenti ricorrenti)
    *   PDF: jsPDF o react-pdf per generazione fatture
    *   Email: Resend per email transazionali e reminder
    *   Deploy: Vercel
*   Variabili d'Ambiente necessarie
    *   NEXT_PUBLIC_SUPABASE_URL=
    *   NEXT_PUBLIC_SUPABASE_ANON_KEY=
    *   SUPABASE_SERVICE_ROLE_KEY=
    *   STRIPE_SECRET_KEY=
    *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    *   NEXT_PUBLIC_SITE_URL=
    *   RESEND_API_KEY=


🗄️ Schema Database (Supabase)

```sql
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
