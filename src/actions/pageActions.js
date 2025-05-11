'use server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function savePageSettings(formData) {
  const supabase = createServerActionClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return false;

  const dataKeys = [
    'displayName','location',
    'bio', 'bgType', 'bgColor', 'bgImage',
  ];

  const dataToUpdate = {};
  for (const key of dataKeys) {
    if (formData.has(key)) {
      // Convert camelCase to snake_case for database columns
      const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      dataToUpdate[dbKey] = formData.get(key);
    }
  }

  const { error: pageError } = await supabase
    .from('pages')
    .update(dataToUpdate)
    .eq('owner_id', session.user.id);

  if (formData.has('avatar')) {
    const { error: userError } = await supabase
      .from('users')
      .update({ image: formData.get('avatar') })
      .eq('id', session.user.id);
    
    if (userError) return false;
  }

  return !pageError;
}

export async function savePageButtons(formData) {
  const supabase = createServerActionClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return false;

  const buttonsValues = {};
  formData.forEach((value, key) => {
    buttonsValues[key] = value;
  });

  const { error } = await supabase
    .from('pages')
    .update({ buttons: buttonsValues })
    .eq('owner_id', session.user.id);

  return !error;
}

export async function savePageLinks(links) {
  const supabase = createServerActionClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return false;

  const { error } = await supabase
    .from('pages')
    .update({ links })
    .eq('owner_id', session.user.id);

  return !error;
}