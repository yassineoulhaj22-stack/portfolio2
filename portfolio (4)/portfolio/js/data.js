/*
  CONTENU DU SITE
  Ce fichier est généré par admin.html : ouvrez admin.html, modifiez vos informations
  (profil, expériences, compétences, projets), puis cliquez sur « Télécharger data.js »
  et remplacez ce fichier sur GitHub. Vous pouvez aussi le modifier à la main.
*/
window.PORTFOLIO = {
  profile: {
    name: "Yassine Oulhaj",
    title: "Étudiant en design UX/UI",
    tagline: "Je conçois des interfaces claires, centrées sur l'utilisateur.",
    bio: [
      "Étudiant en design UX/UI, je m'intéresse à la façon dont les personnes utilisent les applications, en particulier dans le secteur bancaire et des services.",
      "Mon approche : comprendre le contexte, auditer l'existant avec les heuristiques de Nielsen, justifier chaque choix par une loi de l'UX, puis valider par des tests utilisateurs."
    ],
    photo: "assets/photo.png",
    cv: "assets/cv.pdf",
    email: "yassineoulhaj22@gmail.com",
    phone: "+212 642 69 53 29",
    location: "Maroc",
    linkedin: "https://www.linkedin.com/in/votre-profil",
    github: "https://github.com/yassineoulhaj22-stack",
    available: "Disponible pour un stage ou une alternance"
  },
  experiences: [
    { kind: "Formation", title: "Formation en design UX/UI", org: "CMC Rabat", period: "2026 – 2027", description: "Projets pratiques : audit heuristique, wireframes, prototypage et refonte d'applications." },
    { kind: "Certification", title: "Certification en intelligence artificielle", org: "", period: "Octobre 2026", description: "" },
    { kind: "Formation", title: "Baccalauréat", org: "", period: "2024", description: "" }
  ],
  skills: [
    { group: "Design", items: ["Audit heuristique", "Architecture de l'information", "Wireframing", "Prototypage", "Design system"] },
    { group: "Outils", items: ["Figma", "Canva", "PowerPoint"] },
    { group: "Méthodes", items: ["Lois de l'UX", "Tests utilisateurs", "Accessibilité (WCAG)"] }
  ],
  projects: [
    {
      title: "Refonte UX de l'application Bank-e",
      category: "Audit et refonte",
      year: "2026",
      featured: true,
      summary: "Audit d'une application bancaire mobile et propositions d'amélioration justifiées par les lois UX.",
      tags: ["Audit heuristique", "Lois UX", "Refonte", "Figma"],
      image: "assets/bank-e/accueil_solde.png",
      context: "Bank-e est l'application mobile du Crédit Agricole du Maroc. L'objectif était d'identifier les points de friction et de proposer des améliorations centrées sur l'utilisateur.",
      problems: [
        "Menu « Plus » surchargé : 33 entrées, doublons avec la barre du bas.",
        "Virement favori proposé sans aucun favori enregistré : impasse.",
        "Hiérarchie visuelle : les bannières passent avant le solde.",
        "Actions sensibles (opposition, blocage) au même niveau que les actions anodines."
      ],
      solutions: [
        "Menu regroupé en cinq familles de cinq à six entrées.",
        "« Ajouter un favori » tant qu'aucun favori n'existe.",
        "Solde en premier, une seule bannière fermable.",
        "Confirmation avant le blocage d'une carte."
      ],
      laws: [
        "Loi de Hick : réduire le nombre d'options par niveau.",
        "Chunking (loi de Miller) : regrouper en familles limitées.",
        "Loi de Fitts : cibles plus grandes et mieux placées.",
        "Heuristique 5 de Nielsen : prévenir les erreurs, confirmer les actions irréversibles.",
        "Effet de Von Restorff : l'élément différent capte l'attention."
      ],
      gallery: [
        { src: "assets/bank-e/accueil_solde.png", caption: "Accueil : repères sur les bannières et le solde" },
        { src: "assets/bank-e/cartes.png", caption: "Cartes : opposition et blocage" },
        { src: "assets/bank-e/virements.png", caption: "Virements : favori sans favori" },
        { src: "assets/bank-e/accueil_apres.png", caption: "Simulation : solde en premier" },
        { src: "assets/bank-e/cartes_apres.png", caption: "Simulation : confirmation avant blocage" },
        { src: "assets/bank-e/menu_plus_apres.png", caption: "Simulation : menu regroupé" }
      ],
      links: []
    }
  ]
};
