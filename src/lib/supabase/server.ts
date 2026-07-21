// ─── Supabase Server Client ───────────────────────────────────────────────────
// When Supabase credentials are ready, replace this with:
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
//
// export const createClient = async () => {
//   const cookieStore = await cookies()
//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => cookieStore.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             cookieStore.set(name, value, options)
//           )
//         },
//       },
//     }
//   )
// }

// Mock server client
export const createClient = async () => ({
  auth: {
    getUser: async () => ({
      data: {
        user: {
          id: 'mock-user-id',
          email: 'admin@temtech.studio',
        },
      },
      error: null,
    }),
  },
})
