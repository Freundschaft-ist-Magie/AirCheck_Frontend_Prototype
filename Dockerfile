# Build Stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

# Problematische Abhängigkeiten umgehen
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run generate

# Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY /nginx_ssl/fullchain.pem /etc/ssl/certs/certificate.crt
COPY /nginx_ssl/privkey.pem /etc/ssl/private/private.key
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443 80
CMD ["nginx", "-g", "daemon off;"]
