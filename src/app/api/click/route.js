import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const url = new URL(req.url);
  const clickedLink = atob(url.searchParams.get('url'));
  const pageUri = url.searchParams.get('page');

  // Get page id from uri
  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('uri', pageUri)
    .single();

  if (page) {
    await supabase
      .from('events')
      .insert([{
        type: 'click',
        page_id: page.id,
        uri: clickedLink
      }]);
  }

  return Response.json(true);
}