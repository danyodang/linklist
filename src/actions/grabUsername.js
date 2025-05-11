'use server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function grabUsername(formData) {
  const supabase = createServerActionClient({ cookies });
  const username = formData.get('username');
  
  // Check if username exists
  const { data: existingPage } = await supabase
    .from('pages')
    .select('uri')
    .eq('uri', username)
    .single();

  if (existingPage) {
    return false;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;

  // Create new page
  const { data: page, error } = await supabase
    .from('pages')
    .insert([{
      uri: username,
      owner_id: session.user.id,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating page:', error);
    return false;
  }

  return page;
}