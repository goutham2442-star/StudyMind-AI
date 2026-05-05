-- StudyMind AI Database Schema

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  university text,
  department text,
  year_of_study int check (year_of_study between 1 and 6),
  avatar_url text,
  total_papers int default 0,
  total_questions int default 0,
  study_streak int default 0,
  last_active date,
  created_at timestamptz default now()
);

-- Papers table
create table public.papers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  subject text not null,
  exam_year int,
  file_url text not null,
  file_path text not null,
  extracted_text text,
  summary text,
  key_topics jsonb default '[]',
  exam_questions jsonb default '[]',
  page_count int default 0,
  is_public boolean default true,
  view_count int default 0,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Chat Sessions table
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  paper_id uuid references public.papers(id) on delete cascade not null,
  title text,
  message_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Saved Questions table
create table public.saved_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  paper_id uuid references public.papers(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.papers enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.saved_questions enable row level security;

-- Policies

-- Profiles: Users can view and update only their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Papers: Users can read public papers or their own papers, can only insert/update/delete their own
create policy "Users can view public or own papers" on public.papers for select 
  using (is_public = true or auth.uid() = user_id);
create policy "Users can insert own papers" on public.papers for insert with check (auth.uid() = user_id);
create policy "Users can update own papers" on public.papers for update using (auth.uid() = user_id);
create policy "Users can delete own papers" on public.papers for delete using (auth.uid() = user_id);

-- Chat Sessions: Users can view/manage only their own sessions
create policy "Users can manage own chat sessions" on public.chat_sessions for all 
  using (auth.uid() = user_id);

-- Messages: Users can view/insert messages for their own sessions
create policy "Users can manage messages in own sessions" on public.messages for all 
  using (exists (select 1 from public.chat_sessions where id = session_id and user_id = auth.uid()));

-- Saved Questions: Users can manage only their own saved questions
create policy "Users can manage own saved questions" on public.saved_questions for all 
  using (auth.uid() = user_id);

-- Indexes
create index idx_papers_user_id on public.papers(user_id);
create index idx_papers_subject on public.papers(subject);
create index idx_messages_session_id on public.messages(session_id);
create index idx_chat_sessions_paper_user on public.chat_sessions(paper_id, user_id);

-- Functions & Triggers

-- Automatically update updated_at on chat_sessions
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_update_chat_sessions_updated_at
before update on public.chat_sessions
for each row execute function update_updated_at_column();

-- Automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
