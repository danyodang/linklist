/*
  # Storage Setup for File Uploads

  1. Storage
    - Create 'files' bucket for public file storage
    - Enable public access
    - Add policies for authenticated users to upload files

  2. Security
    - Allow authenticated users to upload files
    - Allow public access to read files
*/

-- Create public bucket for file storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'files'
  AND auth.role() = 'authenticated'
);

-- Allow public access to read files
CREATE POLICY "Public access to files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'files');