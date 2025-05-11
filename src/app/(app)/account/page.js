import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import PageButtonsForm from "@/components/forms/PageButtonsForm";
import PageLinksForm from "@/components/forms/PageLinksForm";
import PageSettingsForm from "@/components/forms/PageSettingsForm";
import UsernameForm from "@/components/forms/UsernameForm";
import { redirect } from "next/navigation";
import cloneDeep from 'clone-deep';

export default async function AccountPage({searchParams}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return redirect('/');
  }

  const desiredUsername = searchParams?.desiredUsername;
  
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('owner_id', session.user.id)
    .single();

  if (page) {
    const pageData = cloneDeep(page);
    return (
      <>
        <PageSettingsForm page={pageData} user={session.user} />
        <PageButtonsForm page={pageData} user={session.user} />
        <PageLinksForm page={pageData} user={session.user} />
      </>
    );
  }

  return (
    <div>
      <UsernameForm desiredUsername={desiredUsername} />
    </div>
  );
}