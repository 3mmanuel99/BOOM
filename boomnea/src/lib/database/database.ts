import dotenv from "dotenv";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

// dotenv configuration
dotenv.config({
    path: "../database/.env",
    override: true, // Overrides any environment variables that have already been set on the machine with values from the .env file.
    quiet: true 
});

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
);
export const queries = supabase;