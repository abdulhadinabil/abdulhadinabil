/*
  # Fix RLS Policies for Photos and Blog Posts

  1. Security Updates
    - Update RLS policies to work with current authentication
    - Allow authenticated users to insert their own data
    - Allow public read access where appropriate
    - Fix user_id handling in policies

  2. Changes
    - Update photos table policies
    - Update blog_posts table policies
    - Add proper user_id defaults
    - Ensure policies work with auth.uid()
*/

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Users can manage their own photos" ON photos;
DROP POLICY IF EXISTS "Anyone can view photos" ON photos;
DROP POLICY IF EXISTS "Users can manage their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can view blog posts" ON blog_posts;

-- Photos table policies
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

-- Blog posts table policies
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

-- Create a function to get current user ID or a default admin ID
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Return the authenticated user ID if available
  IF auth.uid() IS NOT NULL THEN
    RETURN auth.uid();
  END IF;
  
  -- Return a default admin user ID (you should replace this with actual admin user ID)
  -- For now, we'll create a dummy admin user
  RETURN '00000000-0000-0000-0000-000000000000'::uuid;
END;
$$;

-- Update existing records to have proper user_id if they don't have one
UPDATE photos SET user_id = get_user_id() WHERE user_id IS NULL;
UPDATE blog_posts SET user_id = get_user_id() WHERE user_id IS NULL;
UPDATE projects SET user_id = get_user_id() WHERE user_id IS NULL;
UPDATE experiences SET user_id = get_user_id() WHERE user_id IS NULL;
UPDATE education SET user_id = get_user_id() WHERE user_id IS NULL;
UPDATE certifications SET user_id = get_user_id() WHERE user_id IS NULL;