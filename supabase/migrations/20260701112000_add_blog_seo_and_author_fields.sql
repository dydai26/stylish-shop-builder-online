-- Migration to add SEO and Author fields to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS noindex BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS nofollow BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS author_avatar TEXT;
