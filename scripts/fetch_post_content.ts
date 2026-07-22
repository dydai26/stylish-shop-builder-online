import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://inivoiunisrgdinrcquu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('content')
    .eq('slug', 'how-to-use-deep-conditioning-hair-mask')
    .single();

  if (error) {
    console.error(error);
  } else {
    console.log(data.content.slice(0, 2000));
  }
}
run();
