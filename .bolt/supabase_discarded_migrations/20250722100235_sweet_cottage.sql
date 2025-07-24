/*
  # Create portfolio website tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `images` (text array)
      - `links` (text array)
      - `category` (text)
      - `tags` (text array)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

    - `photos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `likes` (integer)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

    - `photo_comments`
      - `id` (uuid, primary key)
      - `photo_id` (uuid, references photos)
      - `author` (text)
      - `content` (text)
      - `created_at` (timestamptz)

    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `featured_image` (text)
      - `tags` (text array)
      - `views` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamptz)

    - `experiences`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text)
      - `location` (text)
      - `start_date` (text)
      - `end_date` (text)
      - `description` (text)
      - `current` (boolean)
      - `user_id` (uuid, references auth.users)

    - `education`
      - `id` (uuid, primary key)
      - `degree` (text)
      - `institution` (text)
      - `location` (text)
      - `start_date` (text)
      - `end_date` (text)
      - `description` (text)
      - `user_id` (uuid, references auth.users)

    - `certifications`
      - `id` (uuid, primary key)
      - `title` (text)
      - `issuer` (text)
      - `issue_date` (text)
      - `expiry_date` (text)
      - `credential_id` (text)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow public read access for portfolio content
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  images text[] DEFAULT '{}',
  links text[] DEFAULT '{}',
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos"
  ON photos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own photos"
  ON photos
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Photo comments table
CREATE TABLE IF NOT EXISTS photo_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid REFERENCES photos(id) ON DELETE CASCADE NOT NULL,
  author text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE photo_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photo comments"
  ON photo_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add photo comments"
  ON photo_comments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text,
  tags text[] DEFAULT '{}',
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  start_date text NOT NULL,
  end_date text,
  description text NOT NULL,
  current boolean DEFAULT false,
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view experiences"
  ON experiences
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own experiences"
  ON experiences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  location text NOT NULL,
  start_date text NOT NULL,
  end_date text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view education"
  ON education
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own education"
  ON education
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date text NOT NULL,
  expiry_date text,
  credential_id text,
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certifications"
  ON certifications
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own certifications"
  ON certifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);