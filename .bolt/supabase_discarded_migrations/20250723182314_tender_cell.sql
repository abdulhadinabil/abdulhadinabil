/*
  # Create Blog and Photo Functions

  1. Functions
    - increment_blog_likes: Increment likes for blog posts
    - increment_photo_likes: Increment likes for photos
    
  2. Blog Comments Table
    - Links comments to blog posts
    
  3. Security
    - RLS policies for all tables
*/

-- Create blog_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  author text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Blog comments policies
CREATE POLICY "Anyone can view blog comments"
  ON blog_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add blog comments"
  ON blog_comments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog comments"
  ON blog_comments
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to increment blog post likes
CREATE OR REPLACE FUNCTION increment_blog_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET likes = COALESCE(likes, 0) + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment photo likes
CREATE OR REPLACE FUNCTION increment_photo_likes(photo_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE photos 
  SET likes = COALESCE(likes, 0) + 1 
  WHERE id = photo_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_blog_likes(uuid) TO public;
GRANT EXECUTE ON FUNCTION increment_photo_likes(uuid) TO public;