(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (v) => { const d = document.createElement("div"); d.textContent = v == null ? "" : String(v); return d.innerHTML; };
  const empty = (v) => v == null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length);

  function notice(msg) { const n = $("notice"); n.textContent = msg; n.hidden = false; }

  if (!window.db || !window.db.ok) {
    notice("Le site n'est pas encore connecté à la base de données. Renseignez js/config.js (voir README).");
    return;
  }
  const sb = window.db.client;

  // ---------- Profil ----------
  function renderProfile(p) {
    document.title = (p.name || "Portfolio") + " · " + (p.title || "");
    $("logo").textContent = p.name || "Portfolio";
    $("footer-name").textContent = p.name || "";
    $("year").textContent = new Date().getFullYear();
    $("p-title").textContent = p.title || "";
    $("p-name").textContent = p.name || "";
    $("p-tagline").textContent = p.tagline || "";
    $("p-available").textContent = p.available || "";
    $("p-available").hidden = empty(p.available);
    $("p-bio").innerHTML = (p.bio || []).map(t => `<p>${esc(t)}</p>`).join("");
    $("p-initials").textContent = (p.name || "P").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
    if (!empty(p.photo_url)) {
      const img = $("p-photo");
      img.src = p.photo_url; img.alt = "Photo de " + (p.name || ""); img.hidden = false;
      img.onerror = () => { img.hidden = true; };
    }
    if (!empty(p.cv_url)) { const cv = $("cv-link"); cv.href = p.cv_url; cv.hidden = false; cv.setAttribute("download", ""); }

    const cards = [];
    if (!empty(p.email)) cards.push(["Email", p.email, "mailto:" + p.email]);
    if (!empty(p.phone)) cards.push(["Téléphone", p.phone, "tel:" + p.phone.replace(/\s/g, "")]);
    if (!empty(p.linkedin)) cards.push(["LinkedIn", "Voir mon profil", p.linkedin]);
    if (!empty(p.github)) cards.push(["GitHub", "Voir mes dépôts", p.github]);
    if (!empty(p.location)) cards.push(["Localisation", p.location, null]);
    $("contact-cards").innerHTML = cards.map(([k, v, href]) => href
      ? `<a class="contact-card" href="${esc(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}><span>${esc(k)}</span><strong>${esc(v)}</strong></a>`
      : `<div class="contact-card"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("");
  }

  // ---------- Contenus ----------
  function renderExperiences(list) {
    $("experience-list").innerHTML = list.map(e => `
      <li>
        <div class="tl-kind">${esc(e.kind)}</div>
        <div class="tl-title">${esc(e.title)}</div>
        ${empty(e.org) ? "" : `<div class="tl-org">${esc(e.org)}</div>`}
        ${empty(e.period) ? "" : `<div class="tl-period">${esc(e.period)}</div>`}
        ${empty(e.description) ? "" : `<p>${esc(e.description)}</p>`}
      </li>`).join("");
  }
  function renderSkills(list) {
    $("skills-list").innerHTML = list.map(g => `
      <div class="skill-group"><h3>${esc(g.group_name)}</h3>
        <ul>${(g.items || []).map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
  }
  let projects = [];
  function renderProjects(list) {
    projects = list;
    $("project-list").innerHTML = list.map((pr, i) => `
      <button class="project-card" data-index="${i}" type="button">
        <div class="thumb">${empty(pr.image_url) ? "" : `<img src="${esc(pr.image_url)}" alt="Aperçu : ${esc(pr.title)}" loading="lazy">`}</div>
        <div class="project-body">
          ${pr.featured ? '<span class="badge">À la une</span>' : ""}
          <div class="project-meta">${esc([pr.category, pr.year].filter(x => !empty(x)).join(" · "))}</div>
          <h3>${esc(pr.title)}</h3>
          <p>${esc(pr.summary)}</p>
          <div class="tags">${(pr.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </div></button>`).join("");
  }
  function renderApps(list) {
    const box = $("apps-list");
    const section = box.closest("section");
    if (!list.length) { section.hidden = true; return; }
    box.innerHTML = list.map(a => `
      <article class="app-card">
        <div class="app-icon">${empty(a.image_url) ? esc((a.name || "A")[0]) : `<img src="${esc(a.image_url)}" alt="">`}</div>
        <h3>${esc(a.name)}</h3>
        <p>${esc(a.description)}</p>
        <div class="app-meta">${esc([a.platform, a.version && "version " + a.version, a.size_label].filter(x => !empty(x)).join(" · "))}</div>
        ${empty(a.download_url) ? "" : `<a class="btn btn-primary" href="${esc(a.download_url)}" download>Télécharger</a>`}
      </article>`).join("");
  }

  // ---------- Fenêtre détail projet ----------
  const modal = $("modal"), content = $("modal-content");
  const ul = (items) => empty(items) ? "" : `<ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  function openProject(i) {
    const pr = projects[i]; if (!pr) return;
    content.innerHTML = `
      <div class="project-meta">${esc([pr.category, pr.year].filter(x => !empty(x)).join(" · "))}</div>
      <h3 id="modal-title">${esc(pr.title)}</h3>
      ${empty(pr.context) ? "" : `<p>${esc(pr.context)}</p>`}
      ${empty(pr.problems) ? "" : `<h4>Problèmes identifiés</h4>${ul(pr.problems)}`}
      ${empty(pr.solutions) ? "" : `<h4>Solutions proposées</h4>${ul(pr.solutions)}`}
      ${empty(pr.laws) ? "" : `<h4>Justification UX</h4>${ul(pr.laws)}`}
      ${empty(pr.gallery) ? "" : `<h4>Captures et simulations</h4><div class="gallery">${pr.gallery.map(g => `<figure><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><figcaption>${esc(g.caption)}</figcaption></figure>`).join("")}</div>`}
      ${empty(pr.links) ? "" : `<div class="modal-links">${pr.links.map(l => `<a class="btn btn-primary" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</div>`}`;
    modal.hidden = false; document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }
  $("project-list").addEventListener("click", (e) => { const c = e.target.closest(".project-card"); if (c) openProject(Number(c.dataset.index)); });
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".modal-close")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  // ---------- Mode privé : page d'accès ----------
  function showGate(profile, session) {
    const main = document.querySelector("main");
    const name = profile.name || "Portfolio";
    const links = [];
    if (!empty(profile.linkedin)) links.push(`<a class="btn btn-ghost" href="${esc(profile.linkedin)}" target="_blank" rel="noopener">Me suivre sur LinkedIn</a>`);
    if (!empty(profile.github)) links.push(`<a class="btn btn-ghost" href="${esc(profile.github)}" target="_blank" rel="noopener">Me suivre sur GitHub</a>`);

    const photo = empty(profile.photo_url) ? "" : `<img class="gate-photo" src="${esc(profile.photo_url)}" alt="Photo de ${esc(name)}" onerror="this.remove()">`;
    const head = `
      <section class="gate">
        ${photo}
        <p class="eyebrow">${esc(profile.title || "")}</p>
        <h1>${esc(name)}</h1>
        <p class="lead">Ce portfolio est privé. Pour le consulter :</p>
        <ol class="gate-steps">
          <li>Suivez-moi sur ${links.length ? "les réseaux ci-dessous" : "mes réseaux"}.</li>
          <li>Connectez-vous avec votre adresse email.</li>
          <li>Envoyez votre demande d'accès. Je la valide, et le portfolio s'ouvre.</li>
        </ol>
        ${links.length ? `<div class="gate-links">${links.join("")}</div>` : ""}
        <div id="gate-body" class="gate-body"></div>
      </section>`;
    main.innerHTML = head;
    const body = $("gate-body");

    if (!session) {
      body.innerHTML = `
        <form id="gate-form" class="gate-form">
          <label for="gate-email">Votre adresse email</label>
          <div class="gate-row">
            <input id="gate-email" type="email" required placeholder="vous@exemple.com">
            <button class="btn btn-primary" type="submit">Recevoir mon lien de connexion</button>
          </div>
          <p id="gate-msg" class="gate-msg" hidden></p>
        </form>`;
      $("gate-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = $("gate-email").value.trim();
        const msg = $("gate-msg");
        const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href.split("#")[0] } });
        msg.hidden = false;
        msg.textContent = error ? "Erreur : " + error.message : "Lien envoyé. Ouvrez votre email et cliquez sur le lien.";
      });
      return;
    }

    // Connecté : vérifier la demande
    (async () => {
      const { data: req } = await sb.from("access_requests").select("status").eq("email", session.user.email).maybeSingle();
      if (!req) {
        body.innerHTML = `
          <p class="gate-msg">Connecté en tant que <strong>${esc(session.user.email)}</strong>.</p>
          <button id="send-request" class="btn btn-primary" type="button">Envoyer ma demande d'accès</button>
          <p id="gate-msg" class="gate-msg" hidden></p>`;
        $("send-request").addEventListener("click", async () => {
          const { error } = await sb.from("access_requests").insert({ email: session.user.email });
          const msg = $("gate-msg"); msg.hidden = false;
          msg.textContent = error ? "Erreur : " + error.message : "Demande envoyée. Vous serez prévenu après validation.";
        });
      } else if (req.status === "pending") {
        body.innerHTML = `<p class="gate-msg">Votre demande est en attente de validation.</p>`;
      } else {
        body.innerHTML = `<p class="gate-msg">Votre demande n'a pas été retenue. Pour toute question, contactez-moi directement.</p>`;
      }
    })();
  }

  // ---------- Démarrage ----------
  async function start() {
    const { data: pRow, error: pErr } = await sb.from("profile").select("*").eq("id", 1).maybeSingle();
    if (pErr) { notice("Erreur de chargement : " + pErr.message); return; }
    const profile = pRow || {};
    renderProfile(profile);

    const isPublic = (profile.visibility || "public") === "public";
    let allowed = isPublic;
    let session = null;

    if (!isPublic) {
      const s = await sb.auth.getSession();
      session = s.data.session;
      if (session) {
        const { data: ok } = await sb.from("allowed_viewers").select("email").eq("email", session.user.email).maybeSingle();
        allowed = !!ok || session.user.email === window.db.config.ADMIN_EMAIL;
      }
    }

    if (!allowed) { showGate(profile, session); return; }

    const [exps, skills, projs, apps] = await Promise.all([
      sb.from("experiences").select("*").order("position"),
      sb.from("skill_groups").select("*").order("position"),
      sb.from("projects").select("*").eq("published", true).order("position"),
      sb.from("apps").select("*").eq("published", true).order("position")
    ]);
    renderExperiences(exps.data || []);
    renderSkills(skills.data || []);
    renderProjects(projs.data || []);
    renderApps(apps.data || []);
  }

  start().catch(err => notice("Impossible de charger le contenu : " + err.message));
})();
