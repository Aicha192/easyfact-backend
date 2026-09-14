# EasyFact — Backend

Backend de l'application **EasyFact**, une solution web de facturation électronique destinée à faciliter la gestion des clients, produits, services et factures pour les entreprises.

Le backend fournit une API REST développée avec **NestJS**, avec **Prisma** pour l'accès aux données et **MySQL/MariaDB** comme système de gestion de base de données.

## 🚀 Technologies utilisées

* **NestJS** — Framework backend Node.js
* **TypeScript** — Langage principal
* **Prisma** — ORM
* **MySQL / MariaDB** — Base de données
* **REST API** — Communication avec le frontend
* **Railway** — Déploiement du backend

## 📁 Structure du projet

```text
backend/
├── src/
│   ├── ...
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── .env
├── .gitignore
├── package.json
├── prisma.config.ts
└── README.md
```

> Les fichiers contenant des informations sensibles, notamment `.env`, ne sont pas versionnés dans Git.

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Aicha192/easyfact-backend.git
cd easyfact-backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL="votre_url_de_base_de_donnees"
```

Les valeurs réelles des variables d'environnement doivent rester privées et ne doivent jamais être publiées sur GitHub.

### 4. Générer Prisma Client

```bash
npx prisma generate
```

### 5. Préparer la base de données

Selon l'environnement de développement :

```bash
npx prisma migrate dev
```

## ▶️ Lancer le projet

### Développement

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

## 🔌 API

Le backend expose une API REST utilisée par le frontend EasyFact.

Les différentes fonctionnalités de l'application sont progressivement organisées autour de ressources telles que :

* Clients
* Produits et services
* Factures
* Utilisateurs
* Authentification
* Gestion des données de facturation

L'API est conçue pour être consommée par le frontend React de l'application.

## 🗄️ Base de données

EasyFact utilise **Prisma** comme couche d'accès aux données.

Le schéma de la base de données est défini dans :

```text
prisma/schema.prisma
```

Pour consulter Prisma Studio :

```bash
npx prisma studio
```

## 🌍 Déploiement

Le backend EasyFact est déployé sur **Railway**.

Le frontend est déployé séparément sur **Vercel**.

```text
Frontend
React + Vite
     │
     ▼
  Vercel
     │
     │ HTTP / REST API
     ▼
Backend
NestJS
     │
     ▼
 Railway
     │
     ▼
MySQL / MariaDB
```

## 🔐 Sécurité

Le projet applique plusieurs bonnes pratiques de sécurité :

* Les variables d'environnement et secrets ne sont pas versionnés.
* Aucun secret sensible n'est stocké directement dans le code source.
* Les fichiers `.env` sont exclus du dépôt Git.
* Les informations sensibles doivent être configurées dans l'environnement de déploiement.
* Le code backend est préparé pour fonctionner dans un environnement de production.

## 🎯 Objectif du projet

EasyFact est développé comme un projet de **facturation électronique** avec l'objectif de dépasser progressivement le cadre d'un simple projet académique pour évoluer vers une solution professionnelle présentable aux entreprises.

L'objectif est notamment de permettre à une entreprise de :

* gérer ses clients ;
* gérer ses produits et services ;
* créer et gérer ses factures ;
* suivre les statuts des factures ;
* consulter ses données de facturation ;
* centraliser ses opérations dans une interface simple et moderne.

## 🔗 Projets associés

**Frontend EasyFact :**

https://github.com/Aicha192/easyfact

**Backend EasyFact :**

https://github.com/Aicha192/easyfact-backend

## 👩‍💻 Développement

EasyFact est développé avec une architecture séparant le frontend et le backend afin de faciliter la maintenance, le déploiement et l'évolution future de l'application.

---

**EasyFact — Simplifier la facturation, une facture à la fois.**
