-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: site_settings (for About Me & general info)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_name TEXT,
    hero_description TEXT,
    contact_email TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    logo_url TEXT,
    hero_bg_url TEXT,
    hero_image_url TEXT,
    kyouth_logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: education
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT NOT NULL,
    university TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: experience
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: involvements
CREATE TABLE IF NOT EXISTS public.involvements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    bullet_points JSONB, -- Array of strings
    tech_stack JSONB, -- Array of strings (e.g. ['flutter', 'firebase', 'github'])
    image_url TEXT,
    device_type TEXT DEFAULT 'mobile', -- 'mobile' or 'laptop'
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: k_youth
CREATE TABLE IF NOT EXISTS public.k_youth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_title TEXT NOT NULL,
    description TEXT,
    documents JSONB, -- Array of objects: [{ name: 'Memo', url: '...' }]
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: messages (Contact Form)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Setup Row Level Security (RLS)
-- Allow public read access to all content tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.site_settings;
CREATE POLICY "Public profiles are viewable by everyone." ON public.site_settings FOR SELECT USING (true);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public education viewable by everyone." ON public.education;
CREATE POLICY "Public education viewable by everyone." ON public.education FOR SELECT USING (true);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public experience viewable by everyone." ON public.experience;
CREATE POLICY "Public experience viewable by everyone." ON public.experience FOR SELECT USING (true);

ALTER TABLE public.involvements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public involvements viewable by everyone." ON public.involvements;
CREATE POLICY "Public involvements viewable by everyone." ON public.involvements FOR SELECT USING (true);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public projects viewable by everyone." ON public.projects;
CREATE POLICY "Public projects viewable by everyone." ON public.projects FOR SELECT USING (true);

ALTER TABLE public.k_youth ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public k_youth viewable by everyone." ON public.k_youth;
CREATE POLICY "Public k_youth viewable by everyone." ON public.k_youth FOR SELECT USING (true);

-- Messages can be inserted by anyone, but only viewed by admin
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit a message." ON public.messages;
CREATE POLICY "Anyone can submit a message." ON public.messages FOR INSERT WITH CHECK (true);

-- IMPORTANT: You will need to create a storage bucket named 'portfolio-images' 
-- and set it to public.
