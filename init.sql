-- Création des bases de données pour les microservices
CREATE DATABASE employer_db;
CREATE DATABASE conge_db;
CREATE DATABASE tache_db;

-- J'ai vu dans ton yaml que le service authentification utilise une autre DB et un autre user
-- On les crée aussi pour éviter que ce service ne plante
CREATE USER hrh_user WITH PASSWORD 'hrh-password';
CREATE DATABASE authentification_db OWNER hrh_user;
GRANT ALL PRIVILEGES ON DATABASE authentification_db TO hrh_user;

-- Donne tous les droits à l'utilisateur principal 'prosper' sur les nouvelles bases (optionnel car il est superuser)
GRANT ALL PRIVILEGES ON DATABASE employer_db TO prosper;
GRANT ALL PRIVILEGES ON DATABASE conge_db TO prosper;
GRANT ALL PRIVILEGES ON DATABASE tache_db TO prosper;