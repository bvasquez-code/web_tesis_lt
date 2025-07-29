# Etapa 1: build con Node.js
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalamos dependencias
RUN npm ci

# Copiamos el resto del código
COPY . .

# Construimos en modo producción (configuración por defecto en angular.json)
RUN npm run build

# Etapa 2: servidor estático con Nginx
FROM nginx:stable-alpine

# Eliminamos la configuración default de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestro archivo de configuración de Nginx
COPY default.conf /etc/nginx/conf.d/

# Copiamos los archivos generados por Angular al directorio público de Nginx
COPY --from=builder /app/dist/web_ccadmin /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Arranque de Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]