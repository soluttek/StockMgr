import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateSecurePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

async function main() {
  const email = "admin@stockmgr.com";
  const password = generateSecurePassword(16);

  console.log(`Setting up user: ${email}`);
  
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }

  console.log("User created successfully!");
  console.log("----------------------------------------");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log("----------------------------------------");
  console.log("User ID:", data.user?.id);
  
  process.exit(0);
}

main();
