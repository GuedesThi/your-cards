import { useState, useEffect } from "react";
import { authService } from "../services/authService";

export function useAuth() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getSession().then((session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const subscription = authService.onAuthStateChange((session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  return { user, loading, logout };
}