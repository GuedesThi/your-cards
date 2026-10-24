/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { UserProfile } from "../types";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const { user: supabaseUser } = await authService.getUser();
    if (supabaseUser) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        username: supabaseUser.user_metadata?.username || "",
        avatarUrl: supabaseUser.user_metadata?.avatar_url || "",
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserProfile();

    // Inscreve no ouvinte para atualizar o estado caso o usuário entre/saia
    const subscription = authService.onAuthStateChange((session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username || "",
          avatarUrl: session.user.user_metadata?.avatar_url || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  return { user, loading, logout, reloadUser: fetchUserProfile };
}