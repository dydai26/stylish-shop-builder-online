const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://inivoiunisrgdinrcquu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixSlug() {
  const { data, error } = await supabase
    .from('products')
    .update({ slug: 'deep-hydrating-shampoo' })
    .eq('id', 1);
  if (error) console.error(error);
  else console.log("Slug fixed successfully!");
}
fixSlug();
