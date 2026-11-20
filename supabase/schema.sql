-- Maktab AI LMS — схема базы данных.
-- Выполните этот файл целиком в Supabase → SQL Editor → New query → Run.

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('teacher', 'student')),
  username text not null unique,
  password_hash text not null,
  full_name text not null,
  class_id uuid,
  avatar text not null default '🤖',
  xp integer not null default 0,
  streak integer not null default 0,
  best_streak integer not null default 0,
  last_active date,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

do $$ begin
  alter table public.users
    add constraint users_class_fk foreign key (class_id)
    references public.classes (id) on delete cascade;
exception when duplicate_object then null;
end $$;

-- Телефоны (необязательные). Добавлены позже: если база уже создана, выполните только эти две строки.
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists parent_phone text;

create index if not exists users_class_idx on public.users (class_id);

create table if not exists public.lesson_progress (
  user_id uuid not null references public.users (id) on delete cascade,
  course_id text not null,
  lesson_id text not null,
  score integer not null,
  max_score integer not null,
  xp integer not null,
  attempts integer not null default 1,
  completed_at timestamptz not null default now(),
  primary key (user_id, course_id, lesson_id)
);

create table if not exists public.achievements (
  user_id uuid not null references public.users (id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- Все обращения к данным идут только с сервера через секретный ключ.
-- RLS включён без политик: из браузера напрямую к таблицам доступа нет.
alter table public.users enable row level security;
alter table public.classes enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.achievements enable row level security;

-- Расписание групп и посещаемость (добавлено позже: если база уже создана, выполните этот блок).
alter table public.classes add column if not exists days smallint[] not null default '{}';
alter table public.classes add column if not exists start_time text;
alter table public.classes add column if not exists duration_min integer not null default 90;
alter table public.classes add column if not exists room text;

create table if not exists public.attendance (
  class_id uuid not null references public.classes (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  date date not null,
  status text not null check (status in ('present', 'late', 'absent')),
  xp integer not null default 0,
  marked_at timestamptz not null default now(),
  primary key (user_id, date)
);
create index if not exists attendance_class_idx on public.attendance (class_id, date);
alter table public.attendance enable row level security;
