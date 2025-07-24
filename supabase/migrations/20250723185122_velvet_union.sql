/*
  # Fix Authentication and RLS Policies

  1. Create admin user in auth.users table
  2. Update RLS policies to work with proper Supabase authentication
  3. Ensure proper user_id handling for all tables
*/

-- Create the admin user if it doesn't exist
DO $$
BEGIN
  -- Insert admin user into auth.users if not exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'nabil4457@gmail.com'
  ) THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      'nabil4457@gmail.com',
      crypt('Mdnabil@1998', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      false,
      'authenticated'
    );
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view photos" ON photos;
DROP POLICY IF EXISTS "Users can insert their own photos" ON photos;
DROP POLICY IF EXISTS "Users can update their own photos" ON photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON photos;

DROP POLICY IF EXISTS "Anyone can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can update their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON blog_posts;

-- Create new RLS policies for photos
CREATE POLICY "Anyone can view photos"
  ON photos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert photos"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON photos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON photos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new RLS policies for blog_posts
CREATE POLICY "Anyone can view blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update existing records to have the correct user_id
UPDATE photos SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL OR user_id != '00000000-0000-0000-0000-000000000000';
UPDATE blog_posts SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL OR user_id != '00000000-0000-0000-0000-000000000000';
UPDATE projects SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL OR user_id != '00000000-0000-0000-0000-000000000000';
UPDATE experiences SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL OR user_id != '00000000-0000-0000-0000-000000000000';
UPDATE education SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL OR user_id != '00000000-0000-0000-0000-000000000000';
UPDATE certifications SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL OR user_id != '00000000-0000-0000-0000-000000000000';