import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return Response.redirect(new URL('/account', request.url));
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  return Response.json(await supabase.auth.getSession());
}