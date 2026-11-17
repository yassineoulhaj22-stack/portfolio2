(function () {
  const D = window.PORTFOLIO;
  const $ = (id) => document.getElementById(id);

  function esc(v) {
    const d = document.createElement("div");
    d.textContent = v == null ? "" : String(v);
    return d.innerHTML;
  }
  function isEmpty(v) { return !v || !String(v).trim(); }

  // Profil
  const p = D.profile;
  document.title = p.name + " · " + p.title;
  $("logo").textContent = p.name;
  $("footer-name").textContent = p.name;
  $("year").textContent = new Date().getFullYear();
  $("p-title").textContent = p.title;
  $("p-name").textContent = p.name;
  $("p-tagline").textContent = p.tagline;
  $("p-available").textContent = p.available || "";
  $("p-available").hidden = isEmpty(p.available);
  $("p-bio").innerHTML = (p.bio || []).map(t => `<p>${esc(t)}</p>`).join("");
  $("p-initials").textContent = p.name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const photo = $("p-photo");
  if (!isEmpty(p.photo)) {
    photo.src = p.photo;
    photo.alt = "Photo de " + p.name;
    photo.onerror = () => { photo.remove(); };
  } else { photo.remove(); }

  const cv = $("cv-link");
  if (!isEmpty(p.cv)) { cv.href = p.cv; cv.setAttribute("download", ""); } else { cv.hidden = true; }

  // Contacts
  const cards = [];
  if (!isEmpty(p.email)) cards.push(["Email", p.email, "mailto:" + p.email]);
  if (!isEmpty(p.phone)) cards.push(["Téléphone", p.phone, "tel:" + p.phone.replace(/\s/g, "")]);
  if (!isEmpty(p.linkedin)) cards.push(["LinkedIn", "Voir mon profil", p.linkedin]);
  if (!isEmpty(p.github)) cards.push(["GitHub", "Voir mes dépôts", p.github]);
  if (!isEmpty(p.location)) cards.push(["Localisation", p.location, null]);
  $("contact-cards").innerHTML = cards.map(([k, v, href]) =>
    href
      ? `<a class="contact-card" href="${esc(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}><span>${esc(k)}</span><strong>${esc(v)}</strong></a>`
      : `<div class="contact-card"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`
  ).join("");

  // Parcours
  $("experience-list").innerHTML = (D.experiences || []).map(e => `
    <li>
      <div class="tl-kind">${esc(e.kind)}</div>
      <div class="tl-title">${esc(e.title)}</div>
      <div class="tl-org">${esc(e.org)}</div>
      <div class="tl-period">${esc(e.period)}</div>
      <p>${esc(e.description)}</p>
    </li>`).join("");

  // Compétences
  $("skills-list").innerHTML = (D.skills || []).map(g => `
    <div class="skill-group">
      <h3>${esc(g.group)}</h3>
      <ul>${(g.items || []).map(i => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>`).join("");

  // Projets
  const projects = D.projects || [];
  $("project-list").innerHTML = projects.map((pr, i) => `
    <button class="project-card" data-index="${i}" type="button">
      <div class="thumb"><img src="${esc(pr.image)}" alt="Aperçu : ${esc(pr.title)}" loading="lazy"></div>
      <div class="project-body">
        ${pr.featured ? '<span class="badge">À la une</span>' : ""}
        <div class="project-meta">${esc([pr.category, pr.year].filter(Boolean).join(" · "))}</div>
        <h3>${esc(pr.title)}</h3>
        <p>${esc(pr.summary)}</p>
        <div class="tags">${(pr.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </div>
    </button>`).join("");

  const modal = $("modal");
  const content = $("modal-content");
  function list(items) { return items && items.length ? `<ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""; }
  function openProject(i) {
    const pr = projects[i];
    if (!pr) return;
    content.innerHTML = `
      <div class="project-meta">${esc([pr.category, pr.year].filter(Boolean).join(" · "))}</div>
      <h3 id="modal-title">${esc(pr.title)}</h3>
      ${isEmpty(pr.context) ? "" : `<p>${esc(pr.context)}</p>`}
      ${pr.problems && pr.problems.length ? `<h4>Problèmes identifiés</h4>${list(pr.problems)}` : ""}
      ${pr.solutions && pr.solutions.length ? `<h4>Solutions proposées</h4>${list(pr.solutions)}` : ""}
      ${pr.laws && pr.laws.length ? `<h4>Justification UX</h4>${list(pr.laws)}` : ""}
      ${pr.gallery && pr.gallery.length ? `<h4>Captures et simulations</h4>
        <div class="gallery">${pr.gallery.map(g => `<figure><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><figcaption>${esc(g.caption)}</figcaption></figure>`).join("")}</div>` : ""}
      ${pr.links && pr.links.length ? `<div class="modal-links">${pr.links.map(l => `<a class="btn btn-primary" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</div>` : ""}`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }

  $("project-list").addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (card) openProject(Number(card.dataset.index));
  });
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".modal-close")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
})();
