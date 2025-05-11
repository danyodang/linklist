import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/account');
  }

  return (
    <div>
      <div className="p-4 max-w-xs mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Sign In
        </h1>
        <p className="text-center mb-6 text-gray-500">
          Sign in to your account using one of the methods below
        </p>
        <form action="/auth/sign-in" method="post">
          <button 
            className="bg-white shadow text-center w-full py-4 flex gap-3 items-center justify-center"
            type="submit">
            <span>Sign In with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
}