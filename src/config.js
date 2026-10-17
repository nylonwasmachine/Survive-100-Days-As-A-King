
const SUPABASE_URL = "https://syonjcvbrqtctbekxvfr.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_nPxVVaNfB52nAsOvgn2w4g_o3Dt_vfi";

window.sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
