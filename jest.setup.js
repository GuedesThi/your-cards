import "@testing-library/jest-dom";
import dotenv from "dotenv";

// O parâmetro quiet desativa os logs informativos do dotenv no terminal
dotenv.config({ path: ".env.local", quiet: true });

process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "mock-key";