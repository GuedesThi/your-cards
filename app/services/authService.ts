import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export const authService = {
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return { user: data.user };
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

  async updateProfile(username: string, avatarUrl: string) {
    const { data, error } = await supabase.auth.updateUser({
      data: { username, avatar_url: avatarUrl },
    });
    return { data, error };
  },

  async updateEmail(newEmail: string) {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    return { data, error };
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  },

  async deleteAccount() {
    const { data, error } = await supabase.rpc("delete_user_account");
    if (error) {
      await supabase.auth.signOut();
    }
    return { data, error };
  },
};