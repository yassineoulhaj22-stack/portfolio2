-- =============================================================
-- Données de départ : vos informations actuelles.
-- À exécuter UNE FOIS après schema.sql (SQL Editor → Run).
-- Vous pourrez tout modifier ensuite depuis admin.html.
-- =============================================================

update profile set
  name = 'Yassine Oulhaj',
  title = 'Étudiant en design UX/UI',
  tagline = 'Je conçois des interfaces claires, centrées sur l''utilisateur.',
  bio = array[
    'Étudiant en design UX/UI, je m''intéresse à la façon dont les personnes utilisent les applications, en particulier dans le secteur bancaire et des services.',
    'Mon approche : comprendre le contexte, auditer l''existant avec les heuristiques de Nielsen, justifier chaque choix par une loi de l''UX, puis valider par des tests utilisateurs.'
  ],
  photo_url = 'assets/photo.png',
  cv_url = null,
  email = 'yassineoulhaj22@gmail.com',
  phone = '+212 642 69 53 29',
  location = 'Rabat, Maroc',
  linkedin = 'https://www.linkedin.com/in/votre-profil',
  github = 'https://github.com/yassineoulhaj22-stack',
  available = 'Disponible pour un stage ou une alternance'
where id = 1;

delete from experiences;
insert into experiences (kind, title, org, period, description, position) values
  ('Formation', 'Formation en design UX/UI', 'CMC Rabat', '2026 – 2027', 'Projets pratiques : audit heuristique, wireframes, prototypage et refonte d''applications.', 1),
  ('Certification', 'Certification en intelligence artificielle', '', 'Octobre 2026', '', 2),
  ('Formation', 'Baccalauréat', '', '2024', '', 3);

delete from skill_groups;
insert into skill_groups (group_name, items, position) values
  ('Design', array['Audit heuristique', 'Architecture de l''information', 'Wireframing', 'Prototypage', 'Design system'], 1),
  ('Outils', array['Figma', 'Canva', 'PowerPoint'], 2),
  ('Méthodes', array['Lois de l''UX', 'Tests utilisateurs', 'Accessibilité (WCAG)'], 3);

delete from projects;
insert into projects (title, category, year, featured, published, summary, tags, image_url, context, problems, solutions, laws, gallery, links, position) values (
  'Refonte UX de l''application Bank-e',
  'Audit et refonte',
  '2026',
  true,
  true,
  'Audit d''une application bancaire mobile et propositions d''amélioration justifiées par les lois UX.',
  array['Audit heuristique', 'Lois UX', 'Refonte', 'Figma'],
  'assets/bank-e/accueil_solde.png',
  'Bank-e est l''application mobile du Crédit Agricole du Maroc. L''objectif était d''identifier les points de friction et de proposer des améliorations centrées sur l''utilisateur.',
  array[
    'Menu « Plus » surchargé : 33 entrées, doublons avec la barre du bas.',
    'Virement favori proposé sans aucun favori enregistré : impasse.',
    'Hiérarchie visuelle : les bannières passent avant le solde.',
    'Actions sensibles (opposition, blocage) au même niveau que les actions anodines.'
  ],
  array[
    'Menu regroupé en cinq familles de cinq à six entrées.',
    '« Ajouter un favori » tant qu''aucun favori n''existe.',
    'Solde en premier, une seule bannière fermable.',
    'Confirmation avant le blocage d''une carte.'
  ],
  array[
    'Loi de Hick : réduire le nombre d''options par niveau.',
    'Chunking (loi de Miller) : regrouper en familles limitées.',
    'Loi de Fitts : cibles plus grandes et mieux placées.',
    'Heuristique 5 de Nielsen : prévenir les erreurs, confirmer les actions irréversibles.',
    'Effet de Von Restorff : l''élément différent capte l''attention.'
  ],
  '[
    {"src": "assets/bank-e/accueil_solde.png", "caption": "Accueil : repères sur les bannières et le solde"},
    {"src": "assets/bank-e/cartes.png", "caption": "Cartes : opposition et blocage"},
    {"src": "assets/bank-e/virements.png", "caption": "Virements : favori sans favori"},
    {"src": "assets/bank-e/accueil_apres.png", "caption": "Simulation : solde en premier"},
    {"src": "assets/bank-e/cartes_apres.png", "caption": "Simulation : confirmation avant blocage"},
    {"src": "assets/bank-e/menu_plus_apres.png", "caption": "Simulation : menu regroupé"}
  ]'::jsonb,
  '[]'::jsonb,
  1
);
