# FENACOJU — validation du premier lot territorial

Date : 7 novembre 2026. Livraison partielle en lecture seule ; accès serveur Google à débloquer.

## Identite et sortie Vercel

L'interface visible utilise le nom FENACOJU et le judo ; aucun logo FECOT n'est reutilise. Le cookie de session est propre a FENACOJU.

Le build local avec `VERCEL=1` a genere `.next/BUILD_ID`. `next.config.mjs` n'impose pas de `distDir` personnalise ; l'erreur de sortie `.next` n'est pas reproduite. Aucun `vercel.json` ni lien `.vercel` local n'est present pour verifier les reglages du projet Vercel. Le remote Git `origin` pointe toujours vers `Rodanyoca/fecot-saas` : ne pas publier ou deployer cette copie comme FENACOJU avant de la relier a son depot/projet propre.

## Périmètre et rapport d’écart

Racines Git indépendantes confirmées par `git rev-parse --show-toplevel` :
- C:/Projets/SNDS-RDC/data/monosport/fenacoju-managment : cible.
- C:/Projets/SNDS-RDC/data/monosport/fecot-managment : référence exclusivement lue.

La cible avait déjà README.md et package-lock.json modifiés, et son application non suivie par Git. Ces travaux ont été conservés. FECOT conserve son seul changement initial dans docs/identifiants-athletes.md. Aucun push, déploiement, build complet ou changement de schéma Sheets.

Réutilisation : TerritoryServerPage → TerritoryPage, tableaux DataTable, recherche, filtres, pagination, fiches en sections, retour liste et panneaux latéraux de la base FECOT. Le FECOT actuel contient aussi des blocs acteurs/affiliations/compétitions plus avancés ; ils ne sont pas encore portés. Les règles taekwondo et ses grades/résultats ne constituent pas un contrat judo.

Différences réelles : LIGUES possède pseudo_ligue/email_ligue ; ENTENTES pseudo_entente/email_entente ; CLUBS id_categorie_club et id_ligue. Les colonnes historiques de création, téléphone et logo ne sont pas exigées. Les alias email/sigle historiques restent utilisables dans l’adaptateur. La ligue du club est déduite de l’entente ; un id_ligue renseigné incohérent provoque une erreur.

Attention : origin pointe encore vers github.com/Rodanyoca/fecot-saas.git. Aucun remote n’a été modifié et aucune opération distante n’a été exécutée. Il faut fournir la destination FENACOJU avant toute future publication. Aucune liaison .vercel trouvée. Le nom du package et plusieurs écrans hors lot restent hérités de FECOT.

## Sources et mapping vérifiés

Territoire : `1bHanWLt_-Kajm09v2FY6bnWHjVQQfM-oP7I0KQzEHlw`.
Référentiel : `1FFdw_48OmQFJFf7swMqvbuwfMTnz8kJdpuIK-SFAxUA`.

| Route | Service / feuille | Clé | Références | Champs principaux exposés |
|---|---|---|---|---|
| /ligues et /ligues?id=01 ; GET /api/ligues | TerritoryServerPage → getTerritorialData → readTables → LIGUES | id_ligue | id_province → PROVINCES | ID texte, nom, province, statut ; fiche : pseudo, email, observations |
| /ententes ; GET /api/ententes | même service → ENTENTES | id_entente | id_ligue → LIGUES ; id_ville → VILLES | ID, code, nom, pseudo, ville, ligue, statut ; email et observations en détail |
| /clubs ; GET /api/clubs | même service → CLUBS | id_club | id_entente → ENTENTES ; id_categorie_club → CATEGORIES_CLUB ; id_sexe → SEXES ; id_ville → VILLES | ID, code, nom, catégorie, sexe, entente, ligue, ville, statut ; date_affiliation et observations en détail |

Les en-têtes complets sont transcrits dans lib/territorial-schema.ts. Résolution par noms, contrôle des en-têtes absents/dupliqués et des clés absentes/dupliquées. Cellule vide conservée, aucune conversion numérique des clés. Statut vide : « Non renseigné ». Deux batchGet groupent le territoire et les quatre référentiels ; index de résolution réutilisés. Cache isolé sous fenacoju-territory et les IDs configurés. La lecture est autorisée uniquement si les deux IDs correspondent aux ressources FENACOJU attendues ; aucun alias FECOT ou classeur de repli.

Aucun appel au registre Licences. Les deux routes existantes affichent uniquement le message demandé. Les autres blocs restent à cartographier après lecture de leurs propres en-têtes : acteurs/grades → affiliations → compétitions FED029/JUD/DISC067 → activités/documents. Les relations devront se résoudre par type + ID. Aucune règle sportive FECOT ne doit être activée sans adaptation.

## Lectures réelles et navigateur

- Connecteur Google en lecture seule : métadonnées puis toutes les lignes territoriales dans les bornes réelles ; 26 ligues, IDs 01 à 26 ; ENTENTES : 0 ; CLUBS : 0. PROVINCES : 26, VILLES : 36, CATEGORIES_CLUB : 4, SEXES : 3.
- Fiche 01 : LIGUE DE JUDO DE KINSHASA, province KINSHASA, statut vide. Le libellé source possède des espaces doubles, conservés dans la donnée.
- Service serveur réel : `node scripts/fenacoju-territorial-readonly.mjs` échoue avec Google HTTP 403. Ne pas présenter le raccordement serveur comme validé. Faire accorder la lecture des deux classeurs au compte configuré par GOOGLE_CLIENT_EMAIL, ou vérifier que ses accès/API autorisent ces ressources, puis relancer exactement cette commande. Aucune valeur de secret n’a été affichée.
- Navigateur sur route réelle http://127.0.0.1:3041/ligues : redirection vers /login ; protection préservée. Pas de session FECOT réutilisée, pas d’écriture de connexion tentée. La validation authentifiée de la page normale reste à faire.
- Navigateur isolé : `node scripts/fenacoju-territorial-ui-readonly.mjs` réussi. Les vrais composants utilisent uniquement le relevé du connecteur enregistré dans tests/data/fenacoju-territory.json, hors parcours applicatif. Vérifiés : ID 01, statut vide, recherche KINSHASA, pagination (page suivante commence à 11), ouverture de la fiche 01, retour liste, états vides Ententes et Clubs. Aucune mutation réseau ; aucune erreur JavaScript. Captures dans test-results/fenacoju/{fiche-01,ententes-empty,clubs-empty}.png. Cela ne remplace pas la recette authentifiée du serveur.

## Contrôles exécutés

- `node --experimental-strip-types --test tests/fenacoju-territorial-read.test.ts tests/territorial-domain.test.ts tests/territorial-hierarchy.test.ts tests/territorial-permissions.test.ts` : 11/11 réussis. Un premier échec du test historique venait de sa fixture qui omettait les colonnes devenues facultatives ; la fixture précise désormais ces colonnes.
- `npm run typecheck` : réussi après correction et après les derniers changements (code de sortie 0).
- `npm run lint` : réussi ; le script du dépôt relance TypeScript et ne comporte pas de lint ESLint distinct. Réussi également après les derniers changements (code de sortie 0).
- Les tests de création/modification existants portent sur le domaine FECOT hérité, uniquement en mémoire. Ils ne valident pas encore les formats FENACOJU 0102/0102001, ni une persistance. Aucun test d’écriture en production.
- Revue React : lectures côté serveur, pas de Sheets dans les composants, requêtes regroupées, contexte de mutation à false, interactions et retour liste conservés. Pas de build complet.

## Configuration et limites

.env.example ne contient que les noms des variables, sans secret. GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, AUTH_SECRET et AUTH_TELEMETRY_HMAC_KEY sont présents localement. Les deux variables territoriales FENACOJU sont renseignées avec les ressources demandées. FENACOJU_USERS_SPREADSHEET_ID manque : renseigner dans .env.local l’ID d’une source utilisateurs propre à FENACOJU, avec les feuilles attendues par les protections existantes. Aucun ID de ce bloc n’a été fourni ; ne pas utiliser un des huit classeurs métier comme source utilisateurs sans contrat validé. La variable héritée FECOT_USERS_SPREADSHEET_ID a été désactivée localement et n’est plus acceptée par le service d’authentification. Les mécanismes de session et d’autorisation restent en place. Les anciens scripts administratifs d’authentification restent hors lot et ne doivent pas être lancés contre FECOT.

Les mutations territoriales répondent indisponible et writeRecord refuse toute écriture ; les formulaires sont masqués via canWrite=false. Aucun succès simulé. Prochain travail indépendant : adapter les formulaires au contrat réel, valider les formats/parents/unicité/immutabilité et les relectures de chaînes sur simulation avant toute activation. Les fiches introuvables, le chargement à la demande et la réduction des champs de liste restent à compléter ; la base héritée charge encore le bloc territorial pour les détails.

## Fichiers touchés dans ce lot

lib/territorial-{sources,schema,store,data,view-model,api}.ts ; lib/users/config.ts ; lib/auth/login-error.ts ; components/territorial/server-page.tsx ; components/dashboard/{status-badge,sidebar}.tsx ; components/ligues/ligue-detail.tsx ; components/{ententes/ententes-client,clubs/clubs-client}.tsx ; app/(dashboard)/licences/{page,entourage/page}.tsx ; .env.example et .env.local (ignoré par Git) ; tests/fenacoju-territorial-read.test.ts ; tests/territorial-hierarchy.test.ts ; tests/data/fenacoju-territory.json ; tests/ui/fenacoju-readonly.tsx ; scripts/fenacoju-territorial-{readonly,ui-readonly}.mjs ; ce document. Next dev a généré AGENTS.md et CLAUDE.md ; ils n’ont pas été rédigés manuellement.

Prochaine action exacte : corriger les droits de lecture Google et fournir FENACOJU_USERS_SPREADSHEET_ID ; relancer le contrôle serveur, ouvrir /ligues?id=01 puis /ententes et /clubs avec un compte FENACOJU autorisé. L’URL locale est http://127.0.0.1:3041/ligues. Aucun formulaire n’est requis pour cette première recette de lecture.