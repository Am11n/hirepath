-- Create profiles table
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  full_name text,
  company text,
  primary key (id)
);

alter table profiles enable row level security;

-- Profile policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create job_applications table
create table job_applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  company_name text not null,
  position text not null,
  status text not null default 'draft',
  applied_date date,
  interview_date date,
  offer_date date,
  rejected_date date,
  notes text,
  url text
);

alter table job_applications enable row level security;

-- Job applications policies
create policy "Users can view their own job applications."
  on job_applications for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own job applications."
  on job_applications for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own job applications."
  on job_applications for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own job applications."
  on job_applications for delete
  using ( auth.uid() = user_id );

-- Create activities table
create table activities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  job_application_id uuid references job_applications not null,
  title text not null,
  description text,
  due_date date,
  completed boolean default false,
  type text not null
);

alter table activities enable row level security;

-- Activities policies
create policy "Users can view their own activities."
  on activities for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own activities."
  on activities for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own activities."
  on activities for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own activities."
  on activities for delete
  using ( auth.uid() = user_id );

-- Create documents table
create table documents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users not null,
  job_application_id uuid references job_applications,
  name text not null,
  file_path text not null,
  file_type text,
  file_size integer
);

alter table documents enable row level security;

-- Documents policies
create policy "Users can view their own documents."
  on documents for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own documents."
  on documents for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own documents."
  on documents for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own documents."
  on documents for delete
  using ( auth.uid() = user_id );