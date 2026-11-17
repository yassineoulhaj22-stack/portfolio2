(function () {
  const original = JSON.parse(JSON.stringify(window.PORTFOLIO));
  let S = JSON.parse(JSON.stringify(window.PORTFOLIO));
  const $ = (id) => document.getElementById(id);

  function esc(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  }
  // Champs : data-path="chemin.vers.champ", data-type = text | list (une ligne = un élément) | csv | pairs | bool
  function input(path, value, opts = {}) {
    const label = opts.label, type = opts.type || "text", help = opts.help || "", full = opts.full ? " full" : "";
    if (type === "bool") {
      return `<div class="field check${full}"><input type="checkbox" data-path="${esc(path)}" data-type="bool" ${value ? "checked" : ""} id="c-${esc(path)}"><label for="c-${esc(path)}">${esc(label)}</label></div>`;
    }
    const v = type === "list" ? (value || []).join("\n") : type === "csv" ? (value || []).join(", ") : type === "pairs" ? (value || []).map(p => [p.src || p.label, p.caption || p.url].join(" | ")).join("\n") : (value == null ? "" : value);
    const area = opts.area || type === "list" || type === "pairs";
    const control = area
      ? `<textarea data-path="${esc(path)}" data-type="${type}" rows="${opts.rows || 3}">${esc(v)}</textarea>`
      : `<input type="text" data-path="${esc(path)}" data-type="${type}" value="${esc(v)}">`;
    return `<div class="field${full}"><label>${esc(label)}</label>${control}${help ? `<small>${esc(help)}</small>` : ""}</div>`;
  }
  function tools(section, idx, count) {
    return `<div class="item-tools">
      <button type="button" class="adm-btn adm-btn-small" data-move="${section}" data-idx="${idx}" data-dir="-1" ${idx === 0 ? "disabled" : ""} aria-label="Monter">▲</button>
      <button type="button" class="adm-btn adm-btn-small" data-move="${section}" data-idx="${idx}" data-dir="1" ${idx === count - 1 ? "disabled" : ""} aria-label="Descendre">▼</button>
      <button type="button" class="adm-btn adm-btn-small adm-btn-danger" data-del="${section}" data-idx="${idx}">Supprimer</button>
    </div>`;
  }

  function renderProfil() {
    const p = S.profile;
    $("profil-form").innerHTML = [
      input("profile.name", p.name, { label: "Nom complet" }),
      input("profile.title", p.title, { label: "Titre" }),
      input("profile.tagline", p.tagline, { label: "Phrase d'accroche", full: true }),
      input("profile.bio", p.bio, { label: "Présentation (un paragraphe par ligne)", type: "list", full: true, rows: 4 }),
      input("profile.available", p.available, { label: "Disponibilité", help: "Ex. : Disponible pour un stage" }),
      input("profile.photo", p.photo, { label: "Photo (chemin)", help: "Ex. : assets/photo.jpg. Laissez vide pour afficher les initiales." }),
      input("profile.cv", p.cv, { label: "CV (chemin du PDF)", help: "Ex. : assets/cv.pdf" }),
      input("profile.email", p.email, { label: "Email" }),
      input("profile.phone", p.phone, { label: "Téléphone" }),
      input("profile.location", p.location, { label: "Localisation" }),
      input("profile.linkedin", p.linkedin, { label: "Lien LinkedIn" }),
      input("profile.github", p.github, { label: "Lien GitHub" }),
    ].join("");
  }

  function renderExperiences() {
    const list = S.experiences || [];
    $("experiences-form").innerHTML = list.length ? list.map((e, i) => `
      <div class="item">
        <div class="item-head"><span class="item-title">${esc(e.title || "Nouvel élément")}</span>${tools("experiences", i, list.length)}</div>
        <div class="grid-2">
          ${input(`experiences.${i}.kind`, e.kind, { label: "Type", help: "Ex. : Formation, Expérience, Stage" })}
          ${input(`experiences.${i}.period`, e.period, { label: "Période", help: "Ex. : 2026 – 2027" })}
          ${input(`experiences.${i}.title`, e.title, { label: "Intitulé" })}
          ${input(`experiences.${i}.org`, e.org, { label: "Établissement ou entreprise" })}
          ${input(`experiences.${i}.description`, e.description, { label: "Description", type: "text", area: true, full: true, rows: 3 })}
        </div>
      </div>`).join("") : `<p class="empty">Aucun élément. Cliquez sur « + Ajouter ».</p>`;
  }

  function renderSkills() {
    const list = S.skills || [];
    $("skills-form").innerHTML = list.length ? list.map((g, i) => `
      <div class="item">
        <div class="item-head"><span class="item-title">${esc(g.group || "Nouveau groupe")}</span>${tools("skills", i, list.length)}</div>
        <div class="grid-2">
          ${input(`skills.${i}.group`, g.group, { label: "Nom du groupe", help: "Ex. : Design, Outils, Méthodes" })}
          ${input(`skills.${i}.items`, g.items, { label: "Compétences", type: "csv", help: "Séparées par des virgules" })}
        </div>
      </div>`).join("") : `<p class="empty">Aucun groupe. Cliquez sur « + Ajouter un groupe ».</p>`;
  }

  function renderProjects() {
    const list = S.projects || [];
    $("projects-form").innerHTML = list.length ? list.map((pr, i) => `
      <div class="item">
        <div class="item-head"><span class="item-title">${esc(pr.title || "Nouveau projet")}</span>${tools("projects", i, list.length)}</div>
        <div class="grid-2">
          ${input(`projects.${i}.title`, pr.title, { label: "Titre du projet" })}
          ${input(`projects.${i}.category`, pr.category, { label: "Catégorie", help: "Ex. : Audit et refonte, Prototype" })}
          ${input(`projects.${i}.year`, pr.year, { label: "Année" })}
          ${input(`projects.${i}.featured`, pr.featured, { label: "Mettre à la une (badge)", type: "bool" })}
          ${input(`projects.${i}.summary`, pr.summary, { label: "Résumé (carte)", area: true, rows: 2, full: true })}
          ${input(`projects.${i}.tags`, pr.tags, { label: "Étiquettes", type: "csv", help: "Séparées par des virgules", full: true })}
          ${input(`projects.${i}.image`, pr.image, { label: "Image de couverture (chemin)", help: "Ex. : assets/projects/mon-projet.png", full: true })}
          ${input(`projects.${i}.context`, pr.context, { label: "Contexte", area: true, rows: 3, full: true })}
          ${input(`projects.${i}.problems`, pr.problems, { label: "Problèmes identifiés", type: "list", help: "Une ligne = un élément", full: true, rows: 4 })}
          ${input(`projects.${i}.solutions`, pr.solutions, { label: "Solutions proposées", type: "list", help: "Une ligne = un élément", full: true, rows: 4 })}
          ${input(`projects.${i}.laws`, pr.laws, { label: "Justification UX (lois)", type: "list", help: "Une ligne = un élément", full: true, rows: 4 })}
          ${input(`projects.${i}.gallery`, pr.gallery, { label: "Captures et simulations", type: "pairs", help: "Une ligne par image : chemin | légende", full: true, rows: 4 })}
          ${input(`projects.${i}.links`, pr.links, { label: "Liens", type: "pairs", help: "Une ligne par lien : libellé | https://…", full: true, rows: 2 })}
        </div>
      </div>`).join("") : `<p class="empty">Aucun projet. Cliquez sur « + Ajouter un projet ».</p>`;
  }

  function renderAll() { renderProfil(); renderExperiences(); renderSkills(); renderProjects(); }

  // Conversion des champs texte vers les bons types
  function parse(type, raw) {
    if (type === "bool") return raw;
    if (type === "list") return raw.split("\n").map(s => s.trim()).filter(Boolean);
    if (type === "csv") return raw.split(",").map(s => s.trim()).filter(Boolean);
    if (type === "pairs") return raw.split("\n").map(s => s.trim()).filter(Boolean).map(line => {
      const idx = line.indexOf("|");
      return idx === -1 ? [line, ""] : [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    });
    return raw;
  }
  function setPath(obj, path, value) {
    const keys = path.split(".");
    let cur = obj;
    keys.slice(0, -1).forEach(k => { cur = cur[k]; });
    cur[keys[keys.length - 1]] = value;
  }

  // Galerie = {src, caption} ; liens = {label, url}
  function fixPairs(path, pairs) {
    const isLinks = path.split(".").pop() === "links";
    return pairs.map(([a, b]) => isLinks ? { label: a, url: b } : { src: a, caption: b });
  }

  document.addEventListener("input", (e) => {
    const el = e.target;
    if (!el.dataset.path) return;
    const type = el.dataset.type;
    let value = type === "bool" ? el.checked : parse(type, el.value);
    if (type === "pairs") value = fixPairs(el.dataset.path, value);
    setPath(S, el.dataset.path, value);
    // Mettre à jour le titre de la carte sans perdre le focus
    if (/\.(title|group)$/.test(el.dataset.path)) {
      const head = el.closest(".item") && el.closest(".item").querySelector(".item-title");
      if (head) head.textContent = el.value.trim() || "Sans titre";
    }
  });

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      const sec = add.dataset.add;
      if (sec === "experiences") S.experiences.push({ kind: "Formation", title: "", org: "", period: "", description: "" });
      if (sec === "skills") S.skills.push({ group: "", items: [] });
      if (sec === "projects") S.projects.push({ title: "", category: "", year: "", featured: false, summary: "", tags: [], image: "", context: "", problems: [], solutions: [], laws: [], gallery: [], links: [] });
      renderAll();
      toast("Élément ajouté");
      return;
    }
    const del = e.target.closest("[data-del]");
    if (del) {
      const sec = del.dataset.del, i = Number(del.dataset.idx);
      const label = (S[sec][i] && (S[sec][i].title || S[sec][i].group)) || "cet élément";
      if (confirm("Supprimer « " + label + " » ?")) {
        S[sec].splice(i, 1); renderAll(); toast("Élément supprimé");
      }
      return;
    }
    const mv = e.target.closest("[data-move]");
    if (mv) {
      const sec = mv.dataset.move, i = Number(mv.dataset.idx), d = Number(mv.dataset.dir), j = i + d;
      if (j >= 0 && j < S[sec].length) {
        [S[sec][i], S[sec][j]] = [S[sec][j], S[sec][i]];
        renderAll();
      }
    }
  });

  $("btn-export").addEventListener("click", () => {
    const text = "/*\n  CONTENU DU SITE : généré par admin.html\n  Remplacez js/data.js sur GitHub par ce fichier.\n*/\nwindow.PORTFOLIO = " + JSON.stringify(S, null, 2) + ";\n";
    const blob = new Blob([text], { type: "text/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "data.js";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("data.js téléchargé");
  });

  $("btn-reset").addEventListener("click", () => {
    if (confirm("Annuler toutes les modifications non téléchargées ?")) {
      S = JSON.parse(JSON.stringify(original)); renderAll(); toast("Modifications annulées");
    }
  });

  renderAll();
})();
