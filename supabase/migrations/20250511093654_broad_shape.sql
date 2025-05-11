/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text)
      - name (text)
      - image (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - pages
      - id (uuid, primary key)
      - uri (text, unique)
      - owner_id (uuid, references users.id)
      - display_name (text)
      - location (text)
      - bio (text)
      - bg_type (text)
      - bg_color (text)
      - bg_image (text)
      - buttons (jsonb)
      - links (jsonb)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - events
      - id (uuid, primary key)
      - type (text)
      - page_id (uuid, references pages.id)
      - uri (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  name text,
  image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uri text UNIQUE NOT NULL,
  owner_id uuid REFERENCES users(id),
  display_name text DEFAULT '',
  location text DEFAULT '',
  bio text DEFAULT '',
  bg_type text DEFAULT 'color',
  bg_color text DEFAULT '#000',
  bg_image text DEFAULT '',
  buttons jsonb DEFAULT '{}',
  links jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  page_id uuid REFERENCES pages(id),
  uri text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own pages"
  ON pages
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can update own pages"
  ON pages
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own pages"
  ON pages
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Anyone can read pages"
  ON pages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create events"
  ON events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read events for their pages"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = events.page_id
      AND pages.owner_id = auth.uid()
    )
  );