import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export default async function AdminLeads({ 
  searchParams 
}: { 
  searchParams: Promise<{ secret?: string, error?: string }> 
}) {
  const params = await searchParams;
  
  // 1. URL SECURITY CHECK (First Layer)
  if (params.secret !== process.env.ADMIN_PASSWORD) {
    redirect('/'); 
  }

  // 2. CHECK SESSION COOKIE (Second Layer)
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  // Since you said you log in manually every time, we set a session cookie.
  const isLoggedIn = session && session.value === 'active';

  // 3. SERVER ACTIONS (Executes securely on the server)
  async function handleLogin(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const password = formData.get('password');
    const secret = formData.get('secret');

    // Make sure variables exist
    if (!process.env.ADMIN_USER_ID || !process.env.ADMIN_USER_PASSWORD) {
      redirect(`/admin/leads?secret=${secret}&error=server`);
    }

    if (id === process.env.ADMIN_USER_ID && password === process.env.ADMIN_USER_PASSWORD) {
      // Login Success: Set ephemeral session cookie (expires when browser closes)
      (await cookies()).set('admin_session', 'active', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/admin/leads' // Restrict cookie only to the admin path
      });
      // Redirect to clear any error query params
      redirect(`/admin/leads?secret=${secret}`); 
    } else {
      // Login Failed
      redirect(`/admin/leads?secret=${secret}&error=1`);
    }
  }

  async function handleLogout(formData: FormData) {
    'use server';
    const secret = formData.get('secret');
    (await cookies()).delete('admin_session');
    redirect(`/admin/leads?secret=${secret}`);
  }

  // 4. RENDER LOGIN FORM (If not logged in)
  if (!isLoggedIn) {
    return (
      <div className="p-8 bg-black min-h-screen text-white flex items-center justify-center font-sans tracking-tight">
        <form action={handleLogin} className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800/80 w-full max-w-md flex flex-col gap-6 shadow-2xl shadow-teal-900/10">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin <span className="text-teal-400">Login</span></h1>
            <p className="text-zinc-500 text-sm mt-1">Please enter your credentials to continue</p>
          </div>
          
          {params.error === '1' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center animate-in fade-in zoom-in duration-300">
              Invalid User ID or Password.
            </div>
          )}
          {params.error === 'server' && (
            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm p-3 rounded-lg text-center">
              Server auth variables missing. Check .env.local!
            </div>
          )}

          <input type="hidden" name="secret" value={params.secret} />
          
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 text-sm font-medium">User ID</label>
            <input 
              type="text" 
              name="id" 
              required 
              autoComplete="username"
              className="bg-black/50 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-600" 
              placeholder="Enter User ID"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 text-sm font-medium">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              autoComplete="current-password"
              className="bg-black/50 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-zinc-600" 
              placeholder="Enter Password"
            />
          </div>

          <button type="submit" className="mt-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-teal-900/20 active:scale-[0.98]">
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  // 5. RENDER COMMAND CENTER (If securely logged in)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

  return (
    <div className="p-4 sm:p-8 bg-black min-h-screen text-white font-sans">
      <div className="flex sm:flex-row flex-col gap-4 sm:items-center justify-between mb-8 pb-6 border-b border-zinc-800/60 break-words">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Lead Command <span className="text-teal-400">Center</span></h1>
          <p className="text-zinc-500 text-sm mt-1">Manage and respond to all incoming inquiries.</p>
        </div>
        <form action={handleLogout}>
          <input type="hidden" name="secret" value={params.secret} />
          <button type="submit" className="text-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-5 py-2.5 rounded-lg transition-colors border border-zinc-800 flex items-center justify-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md shadow-2xl">
        <table className="w-full border-collapse text-sm text-left">
          <thead className="bg-zinc-900/80 border-b border-zinc-800/80 w-full">
            <tr>
              <th className="p-5 font-medium text-zinc-400 whitespace-nowrap">Date</th>
              <th className="p-5 font-medium text-zinc-400 whitespace-nowrap">Name</th>
              <th className="p-5 font-medium text-zinc-400 whitespace-nowrap">Industry</th>
              <th className="p-5 font-medium text-zinc-400 whitespace-nowrap">UTM Source</th>
              <th className="p-5 font-medium text-zinc-400 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {leads?.map((lead) => (
              <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors group">
                <td className="p-5 text-zinc-400 whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </td>
                <td className="p-5 font-semibold text-zinc-200">{lead.name}</td>
                <td className="p-5 text-zinc-400">{lead.industry}</td>
                <td className="p-5">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20 whitespace-nowrap">
                    {lead.utm_source || 'direct'}
                  </span>
                </td>
                <td className="p-5 whitespace-nowrap">
                  <a 
                    href={lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, '')}` : '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`px-4 py-2 rounded-lg font-medium transition-all inline-flex items-center gap-2 ${
                      lead.phone 
                        ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20 active:scale-[0.98]' 
                        : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-500 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    Chat
                  </a>
                </td>
              </tr>
            ))}
            {(!leads || leads.length === 0) && (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="inline-flex flex-col items-center justify-center text-zinc-500">
                    <p className="text-lg font-medium text-zinc-400">No leads found yet</p>
                    <p className="text-sm mt-1">When someone submits the form, they'll appear here.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
