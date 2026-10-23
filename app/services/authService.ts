import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export const authService = {
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAuthStateChange(callback: (session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return data.subscription;
  },

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  },

  async resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },
};