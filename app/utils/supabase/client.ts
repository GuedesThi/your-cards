import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "As variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY precisam estar configuradas no .env.local"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          cache: "no-store", // Desativa o cache do Next.js para manter os dados sempre atualizados
        });
      },
    },
  });
}