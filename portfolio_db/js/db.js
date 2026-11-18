// Connexion à Supabase, partagée par le site et la page admin.
window.db = (function () {
  const cfg = window.APP_CONFIG || {};
  const configured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("VOTRE-PROJET") &&
                     cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes("VOTRE_CLE");
  if (!configured || !window.supabase) return { ok: false };
  const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  return { ok: true, client, config: cfg };
})();
