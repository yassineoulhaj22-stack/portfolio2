(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (!window.db || !window.db.ok) {
    $("banner").textContent = "La connexion à la base n'est pas configurée. Renseignez js/config.js (voir README).";
    $("banner").hidden = false;
    $("login").hidden = true;
    return;
  }
  const sb = window.db.client;
  const ADMIN = window.db.config.ADMIN_EMAIL;

  function toast(msg, bad) {
    const t = $("toast"); t.textContent = msg; t.hidden = false; t.style.background = bad ? "#b91c1c" : "#0f172a";
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  }
  function fail(error) { toast("Erreur : " + (error.message || error), true); }

  // ----- Champs -----
  // t : text | area | lines (une ligne = un élément) | csv | pairs1 (src | légende) | pairs2 (libellé | url) | bool | num
  function field(k, label, value, t, opts = {}) {
    const full = opts.full ? " full" : "";
    if (t === "bool") return `<div class="field check${full}"><input type="checkbox" data-k="${k}" data-t="bool" ${value ? "checked" : ""}><label>${esc(label)}</label></div>`;
    let v = value;
    if (t === "lines") v = (value || []).join("\n");
    if (t === "csv") v = (value || []).join(", ");
    if (t === "pairs1") v = (value || []).map(p => `${p.src || ""} | ${p.caption || ""}`).join("\n");
    if (t === "pairs2") v = (value || []).map(p => `${p.label || ""} | ${p.url || ""}`).join("\n");
    const area = t === "area" || t === "lines" || t === "pairs1" || t === "pairs2";
    const control = area
      ? `<textarea data-k="${k}" data-t="${t}" rows="${opts.rows || 3}">${esc(v == null ? "" : v)}</textarea>`
      : `<input type="${t === "num" ? "number" : "text"}" data-k="${k}" data-t="${t}" value="${esc(v)}">`;
    return `<div class="field${full}"><label>${esc(label)}</label>${control}${opts.help ? `<small>${esc(opts.help)}</small>` : ""}</div>`;
  }
  function read(scope) {
    const out = {};
    scope.querySelectorAll("[data-k]").forEach(el => {
      const k = el.dataset.k, t = el.dataset.t; let val;
      if (t === "bool") val = el.checked;
      else if (t === "num") val = el.value === "" ? 0 : Number(el.value);
      else if (t === "lines") val = el.value.split("\n").map(s => s.trim()).filter(Boolean);
      else if (t === "csv") val = el.value.split(",").map(s => s.trim()).filter(Boolean);
      else if (t === "pairs1") val = el.value.split("\n").map(s => s.trim()).filter(Boolean).map(l => { const i = l.indexOf("|"); return i < 0 ? { src: l, caption: "" } : { src: l.slice(0, i).trim(), caption: l.slice(i + 1).trim() }; });
      else if (t === "pairs2") val = el.value.split("\n").map(s => s.trim()).filter(Boolean).map(l => { const i = l.indexOf("|"); return i < 0 ? { label: l, url: "" } : { label: l.slice(0, i).trim(), url: l.slice(i + 1).trim() }; });
      else val = el.value.trim();
      out[k] = val;
    });
    return out;
  }
  function uploadField(target, label, accept) {
    accept = accept || "image/*,application/pdf";
    return `<div class="field full"><label>${esc(label)}</label>
      <div class="upload"><input type="file" accept="${esc(accept)}" data-upload="${target}"><small>Le fichier est envoyé dans le stockage et son adresse est remplie automatiquement.</small></div></div>`;
  }

  // ----- Connexion -----
  async function showEditor(session) {
    const ok = session && session.user && session.user.email === ADMIN;
    $("login").hidden = !!ok;
    $("editor").hidden = !ok;
    $("top-actions").hidden = !ok;
    if (session && !ok) { await sb.auth.signOut(); $("login-error").textContent = "Ce compte n'est pas autorisé."; $("login-error").hidden = false; }
    if (ok) loadAll();
  }
  $("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("login-error").hidden = true;
    const { data, error } = await sb.auth.signInWithPassword({ email: $("email").value.trim(), password: $("password").value });
    if (error) { $("login-error").textContent = "Email ou mot de passe incorrect."; $("login-error").hidden = false; return; }
    showEditor(data.session);
  });
  $("btn-logout").addEventListener("click", async () => { await sb.auth.signOut(); location.reload(); });

  // ----- Chargement -----
  async function loadAll() {
    const [p, e, s, pr, ap] = await Promise.all([
      sb.from("profile").select("*").eq("id", 1).maybeSingle(),
      sb.from("experiences").select("*").order("position"),
      sb.from("skill_groups").select("*").order("position"),
      sb.from("projects").select("*").order("position"),
      sb.from("apps").select("*").order("position")
    ]);
    const err = [p, e, s, pr, ap].find(r => r.error);
    if (err) return fail(err.error);
    renderProfile(p.data || {});
    renderExperiences(e.data || []);
    renderSkills(s.data || []);
    renderProjects(pr.data || []);
    renderApps(ap.data || []);
    renderVisibility(p.data || {});
    loadAccess();
  }

  // ----- Profil -----
  function renderProfile(p) {
    $("profile-form").innerHTML = [
      field("name", "Nom complet", p.name),
      field("title", "Titre", p.title),
      field("tagline", "Phrase d'accroche", p.tagline, "text", { full: true }),
      field("bio", "Présentation (un paragraphe par ligne)", p.bio, "lines", { full: true, rows: 4 }),
      field("available", "Disponibilité", p.available, "text", { help: "Ex. : Disponible pour un stage" }),
      field("email", "Email", p.email),
      field("phone", "Téléphone", p.phone),
      field("location", "Localisation", p.location),
      field("linkedin", "Lien LinkedIn", p.linkedin),
      field("github", "Lien GitHub", p.github),
      field("photo_url", "Adresse de la photo", p.photo_url, "text", { full: true }),
      uploadField("profile:photo_url", "Photo de profil"),
      field("cv_url", "Adresse du CV (PDF)", p.cv_url, "text", { full: true }),
      uploadField("profile:cv_url", "Fichier du CV (PDF)")
    ].join("");
  }
  $("save-profile").addEventListener("click", async () => {
    const row = read($("profile-form"));
    row.id = 1;
    const { error } = await sb.from("profile").upsert(row);
    error ? fail(error) : toast("Profil enregistré");
  });

  // ----- Listes génériques -----
  function itemCard(table, row, title, body) {
    const id = row.id || "";
    return `<div class="item" data-table="${table}" data-id="${id}">
      <div class="item-head"><span class="item-title">${esc(title || "Nouvel élément")}</span>
        <div class="item-tools">
          ${table === "projects" || table === "apps" ? `<label class="toggle"><input type="checkbox" data-k="published" data-t="bool" ${row.published === false ? "" : "checked"}>Publié</label>` : ""}
          <button class="adm-btn adm-btn-small adm-btn-ok" type="button" data-save>Enregistrer</button>
          <button class="adm-btn adm-btn-small adm-btn-danger" type="button" data-del>Supprimer</button>
        </div></div>
      <div class="grid-2">${body}</div></div>`;
  }
  function renderExperiences(list) {
    $("experiences-list").innerHTML = list.length ? list.map(r => itemCard("experiences", r, r.title,
      field("kind", "Type", r.kind, "text", { help: "Formation, Certification, Stage…" }) +
      field("period", "Période", r.period) +
      field("title", "Intitulé", r.title) +
      field("org", "Établissement", r.org) +
      field("description", "Description", r.description, "area", { full: true, rows: 2 }) +
      field("position", "Ordre (petit = en premier)", r.position ?? 0, "num"))).join("") : `<p class="empty">Aucun élément.</p>`;
  }
  function renderSkills(list) {
    $("skills-list").innerHTML = list.length ? list.map(r => itemCard("skill_groups", r, r.group_name,
      field("group_name", "Nom du groupe", r.group_name) +
      field("items", "Compétences (séparées par des virgules)", r.items, "csv", { full: true }) +
      field("position", "Ordre", r.position ?? 0, "num"))).join("") : `<p class="empty">Aucun groupe.</p>`;
  }
  function renderProjects(list) {
    $("projects-list").innerHTML = list.length ? list.map(r => {
      const card = itemCard("projects", r, r.title,
        field("title", "Titre du projet", r.title) +
        field("category", "Catégorie", r.category) +
        field("year", "Année", r.year) +
        field("position", "Ordre", r.position ?? 0, "num") +
        field("featured", "À la une", r.featured, "bool") +
        field("summary", "Résumé (carte)", r.summary, "area", { full: true, rows: 2 }) +
        field("tags", "Étiquettes (séparées par des virgules)", r.tags, "csv", { full: true }) +
        field("image_url", "Image de couverture (adresse)", r.image_url, "text", { full: true }) +
        uploadField("projects:image_url", "Téléverser la couverture") +
        field("context", "Contexte", r.context, "area", { full: true, rows: 3 }) +
        field("problems", "Problèmes (une ligne = un élément)", r.problems, "lines", { full: true, rows: 4 }) +
        field("solutions", "Solutions (une ligne = un élément)", r.solutions, "lines", { full: true, rows: 4 }) +
        field("laws", "Justification UX (une ligne = un élément)", r.laws, "lines", { full: true, rows: 4 }) +
        field("gallery", "Captures (une ligne : adresse | légende)", r.gallery, "pairs1", { full: true, rows: 4 }) +
        field("links", "Liens (une ligne : libellé | https://…)", r.links, "pairs2", { full: true, rows: 2 }));
      return card;
    }).join("") : `<p class="empty">Aucun projet.</p>`;
  }

  function renderApps(list) {
    $("apps-list").innerHTML = list.length ? list.map(r => itemCard("apps", r, r.name,
      field("name", "Nom de l'application", r.name) +
      field("platform", "Plateforme", r.platform || "Android", "text", { help: "Ex. : Android" }) +
      field("version", "Version", r.version) +
      field("size_label", "Taille (affichage)", r.size_label, "text", { help: "Ex. : 25 Mo" }) +
      field("description", "Description", r.description, "area", { full: true, rows: 2 }) +
      field("download_url", "Lien de téléchargement (APK)", r.download_url, "text", { full: true, help: "Adresse du fichier .apk (sur Supabase ou GitHub Releases)" }) +
      uploadField("apps:download_url", "Téléverser le fichier APK (50 Mo max ici)", ".apk,application/vnd.android.package-archive") +
      field("image_url", "Icône (adresse, facultatif)", r.image_url, "text", { full: true }) +
      field("position", "Ordre", r.position ?? 0, "num"))).join("") : `<p class="empty">Aucune application pour l'instant.</p>`;
  }

  // ----- Visibilité et accès -----
  function renderVisibility(p) {
    const v = p.visibility || "public";
    document.querySelectorAll('input[name="visibility"]').forEach(r => { r.checked = r.value === v; });
  }
  $("save-visibility").addEventListener("click", async () => {
    const chosen = document.querySelector('input[name="visibility"]:checked');
    if (!chosen) return toast("Choisissez Public ou Privé", true);
    const { error } = await sb.from("profile").update({ visibility: chosen.value }).eq("id", 1);
    error ? fail(error) : toast(chosen.value === "private" ? "Portfolio privé" : "Portfolio public");
  });

  const badge = (st) => ({ pending: '<span class="badge badge-pending">En attente</span>', accepted: '<span class="badge badge-accepted">Acceptée</span>', refused: '<span class="badge badge-refused">Refusée</span>' })[st] || "";

  async function loadAccess() {
    const [req, view] = await Promise.all([
      sb.from("access_requests").select("*").order("created_at", { ascending: false }),
      sb.from("allowed_viewers").select("*").order("added_at", { ascending: false })
    ]);
    if (req.error) return fail(req.error);
    if (view.error) return fail(view.error);

    $("requests-list").innerHTML = (req.data || []).length ? req.data.map(r => `
      <div class="req" data-email="${esc(r.email)}">
        <div><strong>${esc(r.email)}</strong> ${badge(r.status)}<br><small>${new Date(r.created_at).toLocaleDateString("fr-FR")}</small></div>
        <div class="item-tools">
          <button class="adm-btn adm-btn-small adm-btn-ok" type="button" data-accept="${esc(r.email)}">Accepter</button>
          <button class="adm-btn adm-btn-small adm-btn-danger" type="button" data-refuse="${esc(r.email)}">Refuser</button>
        </div>
      </div>`).join("") : `<p class="empty">Aucune demande.</p>`;

    $("viewers-list").innerHTML = (view.data || []).length ? view.data.map(v => `
      <div class="req">
        <span>${esc(v.email)}</span>
        <button class="adm-btn adm-btn-small adm-btn-danger" type="button" data-revoke="${esc(v.email)}">Retirer l'accès</button>
      </div>`).join("") : `<p class="empty">Personne n'est encore autorisé.</p>`;
  }

  document.addEventListener("click", async (e) => {
    const acc = e.target.closest("[data-accept]");
    const ref = e.target.closest("[data-refuse]");
    const rev = e.target.closest("[data-revoke]");
    if (acc) {
      const email = acc.dataset.accept;
      const a = await sb.from("allowed_viewers").upsert({ email });
      if (a.error) return fail(a.error);
      const b = await sb.from("access_requests").update({ status: "accepted" }).eq("email", email);
      if (b.error) return fail(b.error);
      toast("Accès accordé"); loadAccess();
    }
    if (ref) {
      const { error } = await sb.from("access_requests").update({ status: "refused" }).eq("email", ref.dataset.refuse);
      if (error) return fail(error);
      toast("Demande refusée"); loadAccess();
    }
    if (rev) {
      if (!confirm("Retirer l'accès à cette personne ?")) return;
      const { error } = await sb.from("allowed_viewers").delete().eq("email", rev.dataset.revoke);
      if (error) return fail(error);
      toast("Accès retiré"); loadAccess();
    }
  });

  // ----- Enregistrer, supprimer, ajouter -----
  document.addEventListener("click", async (e) => {
    const saveBtn = e.target.closest("[data-save]");
    const delBtn = e.target.closest("[data-del]");
    const newBtn = e.target.closest("[data-new]");
    if (saveBtn) {
      const card = saveBtn.closest(".item");
      const table = card.dataset.table;
      const row = read(card);
      const id = card.dataset.id;
      const q = id ? sb.from(table).update(row).eq("id", id) : sb.from(table).insert(row).select("id").single();
      const { data, error } = await q;
      if (error) return fail(error);
      if (!id && data) card.dataset.id = data.id;
      toast("Enregistré");
      return;
    }
    if (delBtn) {
      const card = delBtn.closest(".item");
      const table = card.dataset.table, id = card.dataset.id;
      if (!id) { card.remove(); return; }
      if (!confirm("Supprimer cet élément définitivement ?")) return;
      const { error } = await sb.from(table).delete().eq("id", id);
      if (error) return fail(error);
      card.remove(); toast("Supprimé");
      return;
    }
    if (newBtn) {
      const table = newBtn.dataset.new;
      const blank = { experiences: { kind: "Formation", title: "", org: "", period: "", description: "", position: 0 },
                      skill_groups: { group_name: "", items: [], position: 0 },
                      apps: { name: "", platform: "Android", version: "", size_label: "", description: "", download_url: "", image_url: "", published: true, position: 0 },
                      projects: { title: "", category: "", year: "", summary: "", tags: [], featured: false, published: true, image_url: "", context: "", problems: [], solutions: [], laws: [], gallery: [], links: [], position: 0 } }[table];
      const box = table === "experiences" ? $("experiences-list") : table === "skill_groups" ? $("skills-list") : table === "apps" ? $("apps-list") : $("projects-list");
      if (box.querySelector(".empty")) box.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.innerHTML = table === "apps" ? itemCard(table, blank, "", field("name","Nom de l'application","")+field("platform","Plateforme","Android")+field("version","Version","")+field("size_label","Taille (affichage)","")+field("description","Description","","area",{full:true,rows:2})+field("download_url","Lien de téléchargement (APK)","","text",{full:true})+uploadField("apps:download_url","Téléverser le fichier APK (50 Mo max ici)",".apk,application/vnd.android.package-archive")+field("image_url","Icône (adresse, facultatif)","","text",{full:true})+field("position","Ordre",0,"num"))
        : table === "experiences" ? itemCard(table, blank, "", field("kind","Type",blank.kind)+field("period","Période","")+field("title","Intitulé","")+field("org","Établissement","")+field("description","Description","","area",{full:true,rows:2})+field("position","Ordre",0,"num"))
        : table === "skill_groups" ? itemCard(table, blank, "", field("group_name","Nom du groupe","")+field("items","Compétences (séparées par des virgules)",[],"csv",{full:true})+field("position","Ordre",0,"num"))
        : itemCard(table, blank, "", field("title","Titre du projet","")+field("category","Catégorie","")+field("year","Année","")+field("position","Ordre",0,"num")+field("featured","À la une",false,"bool")+field("summary","Résumé (carte)","","area",{full:true,rows:2})+field("tags","Étiquettes (séparées par des virgules)",[],"csv",{full:true})+field("image_url","Image de couverture (adresse)","","text",{full:true})+uploadField("projects:image_url","Téléverser la couverture")+field("context","Contexte","","area",{full:true,rows:3})+field("problems","Problèmes (une ligne = un élément)",[],"lines",{full:true,rows:4})+field("solutions","Solutions (une ligne = un élément)",[],"lines",{full:true,rows:4})+field("laws","Justification UX (une ligne = un élément)",[],"lines",{full:true,rows:4})+field("gallery","Captures (une ligne : adresse | légende)",[],"pairs1",{full:true,rows:4})+field("links","Liens (une ligne : libellé | https://…)",[],"pairs2",{full:true,rows:2}));
      box.prepend(wrap.firstElementChild);
    }
  });

  // ----- Téléversement vers le stockage -----
  document.addEventListener("change", async (e) => {
    const inp = e.target.closest("[data-upload]");
    if (!inp || !inp.files[0]) return;
    const [scope, field] = inp.dataset.upload.split(":");
    if (scope === "apps" && inp.files[0].size > 50 * 1024 * 1024) { toast("Fichier trop lourd (50 Mo max). Utilisez GitHub Releases.", true); return; }
    const file = inp.files[0];
    const safe = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
    const folder = { profile: "profil/", projects: "projets/", apps: "applications/" }[scope] || "fichiers/";
    const path = folder + Date.now() + "-" + safe;
    toast("Envoi en cours…");
    const { error } = await sb.storage.from("portfolio").upload(path, file, { upsert: true });
    if (error) return fail(error);
    const { data } = sb.storage.from("portfolio").getPublicUrl(path);
    // remplir le champ d'adresse correspondant dans le même bloc
    const container = inp.closest(".grid-2") || inp.closest(".item") || document;
    const target = container.querySelector(`[data-k="${field}"]`);
    if (target) target.value = data.publicUrl;
    toast("Fichier envoyé. Pensez à enregistrer.");
  });

  // ----- Démarrage -----
  sb.auth.getSession().then(({ data }) => showEditor(data.session));
})();
