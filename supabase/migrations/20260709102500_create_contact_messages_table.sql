-- Migration: Create contact_messages table and enable RLS
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    phone text,
    subject text not null,
    message text not null,
    status text default 'unread' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe replay)
DROP POLICY IF EXISTS "Allow public insert access to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin all access to contact_messages" ON public.contact_messages;

-- Create Policies
CREATE POLICY "Allow public insert access to contact_messages"
ON public.contact_messages FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow admin all access to contact_messages"
ON public.contact_messages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
