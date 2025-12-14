# HR-HUB

## ✅ Prérequis

### Système

- **OS** : Linux, macOS ou Windows (WSL2)
- **RAM** : Minimum 8 GB (recommandé 16 GB)
- **Disque** : 20 GB libres minimum

### Outils requis

Puisque le frontend est lancé localement et le backend via Docker, vous avez besoin de :

- **Docker** (version 20.10+) & **Docker Compose**
- **Git**
- **Java 17+** & **Maven** (pour compiler les microservices)
- **Node.js** (v16+) & **npm** (pour lancer le frontend)

### Installation des outils (Si non installés)

#### Sur Ubuntu/Debian (Docker uniquement)

```bash
# Installer Docker
curl -fsSL [https://get.docker.com](https://get.docker.com) -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Installer Docker Compose
sudo curl -L "[https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname](https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname) -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier les installations
docker --version
docker compose --version
```

## 🚀 Installation et Démarrage

### Récupération du projet

```bash
git clone https://github.com/TP-INF4057-SOFTWARE-ARCHITECTURE-2026/INF4057-TP-SoftwareArchitecture-Groupe-6.git
cd HR-HUB
```

### Démarrage du Backend

Compilation de tous les services Java puis lancements des conteneurs

```bash
# Etape A : Génération des exécutables (.jar)
# Se place dans le dossier bank_config_service (depuis la racine du projet)
cd bank_config_service

# Exécuter la commande suivant
mvn clean install -U -DskipTests

# Reproduire l'étape précédente pour les dossiers bank-gateway-service, bank-registry-service, conge-service, employer-service et tache-service

# Etape B : Création et démarrage des services en arrière-plan
docker compose up --build -d
```

### Démarrage du Frontend

```bash
# Se placer dans le dossier frontend (depuis la racine du projet)
cd frontend

# Installation des dépendances
npm install

# Lancement du serveur de développement
npm start
```

## 🧪 Test de l'architecture

1. Ouvrez un navigateur web (si ce n'est pas déjà fait).

2. Accédez à l'application via l'adresse : <http://localhost:3000>

3. Manuel d'utilisation : Pour tester les scénarios métiers et interagir correctement avec l'application, veuillez consulter le manuel d'utilisation fourni dans ce dépôt.

## 🛑 Arrêt

- **Frontend** : Faire Ctrl + C dans le terminal du frontend.

- **Backend** : Exécuter docker compose down dans le terminal du projet.
