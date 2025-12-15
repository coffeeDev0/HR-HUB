# Étape 1 : Build du frontend
FROM node:18 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur Nginx pour servir le build
FROM nginx:stable-alpine

# On copie le build React dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# On remplace la config Nginx pour écouter sur le port 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

