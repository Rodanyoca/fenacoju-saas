# FENACOJU - Federation nationale congolaise de judo

Application Next.js FENACOJU avec le bloc territorial : ligues, ententes et clubs, listes, fiches, formulaires latéraux, recherches, filtres, tris, pagination et logos Drive. Connexion, activation, sessions et droits AUT-SPT sont également disponibles.

## Demarrage

```powershell
npm.cmd install
npm.cmd run dev
```

Ouvrir http://localhost:3000. Si le port est occupe, Next.js indique le port disponible.

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd start
```

## Configuration et périmètre

Renseigner les variables décrites dans [.env.example](.env.example) dans votre environnement ou votre fichier `.env.local`. Les valeurs du modèle sont volontairement vides. Aucun secret ni compte d’un autre dépôt n’est réutilisé.

La connexion exige un classeur utilisateurs FECOT, deux secrets indépendants et les accès Google. Le bloc territorial exige son classeur et le référentiel FECOT ; les logos nécessitent la configuration OAuth Drive. Sans configuration, l’application refuse l’accès et affiche une indisponibilité explicite.

Voir [le rapport et le guide de configuration](docs/structure-territoriale.md) pour les IDs des deux classeurs FECOT vérifiés, le modèle des données, la préparation du classeur utilisateurs et la création du premier administrateur.

Le bloc Acteurs et affiliations n’est pas encore intégré ; ses sections dans les fiches territoriales affichent un état explicite. Les autres modules restent en préparation. Aucun jeu de données métier fictif n’est utilisé dans l’application, aucune équipe ou division n’est ajoutée. Aucun logo officiel FECOT n’a été fourni ; la marque reste textuelle.

## Vérifications

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
npm.cmd run test:ui
node scripts/auth-ui-qa.mjs
```

Les tests UI utilisent Chromium local : `npx.cmd playwright install chromium` si nécessaire. Le test territorial est isolé : il part d’une lecture réelle des 26 ligues FECOT et conserve toutes les écritures de test en mémoire. Les comparaisons supposent le dépôt FEVOCO présent dans le même workspace.
