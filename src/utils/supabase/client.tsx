// This Supabase client has been simplified and moved to AuthContext.tsx
// Keeping this file as a placeholder to prevent import errors
export const supabase = {
  auth: {
    getSession: () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  }
};