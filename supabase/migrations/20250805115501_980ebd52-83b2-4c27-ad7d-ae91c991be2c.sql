-- Create profiles table for user CV data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  github TEXT,
  location TEXT,
  personal_summary TEXT,
  tone TEXT DEFAULT 'Professional and warm',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_profile UNIQUE(user_id)
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT, -- e.g., 'Programming', 'Data Analysis', 'Design'
  proficiency_level INTEGER DEFAULT 3, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create work experience table
CREATE TABLE public.work_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  responsibilities TEXT[], -- Array of responsibility strings
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  start_year TEXT,
  end_year TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date TEXT,
  expiry_date TEXT,
  credential_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create languages table
CREATE TABLE public.languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  language_name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'Native', -- Native, Fluent, Intermediate, Basic
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for skills
CREATE POLICY "Users can view their own skills" 
ON public.skills 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own skills" 
ON public.skills 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" 
ON public.skills 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" 
ON public.skills 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for work experience
CREATE POLICY "Users can view their own work experience" 
ON public.work_experience 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work experience" 
ON public.work_experience 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work experience" 
ON public.work_experience 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work experience" 
ON public.work_experience 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for education
CREATE POLICY "Users can view their own education" 
ON public.education 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own education" 
ON public.education 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education" 
ON public.education 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education" 
ON public.education 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for certifications
CREATE POLICY "Users can view their own certifications" 
ON public.certifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own certifications" 
ON public.certifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own certifications" 
ON public.certifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own certifications" 
ON public.certifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for languages
CREATE POLICY "Users can view their own languages" 
ON public.languages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own languages" 
ON public.languages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own languages" 
ON public.languages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own languages" 
ON public.languages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_experience_updated_at
  BEFORE UPDATE ON public.work_experience
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();