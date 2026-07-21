// ─── Supabase Client (Browser) ────────────────────────────────────────────────
// When Supabase credentials are ready, replace this with:
// import { createBrowserClient } from '@supabase/ssr'
// export const createClient = () =>
//   createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

// Mock client — replace with real Supabase client when credentials are ready
export const createClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async (_opts: { email: string; password: string }) => ({
      data: { user: null, session: null },
      error: null,
    }),
    signOut: async () => ({ error: null }),
  },
})
