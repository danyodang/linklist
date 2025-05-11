import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });

  if (error) {
    return Response.redirect(new URL('/login', request.url));
  }

  return Response.redirect(data.url);
}