# Stage 1: Build Stage
FROM node:20 AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para la instalación de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Construir la aplicación en modo producción
RUN npm run build

# Stage 2: Serve Stage
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=builder /app/dist/web-ccadmin /usr/share/nginx/html

# Exponer el puerto
EXPOSE 80

# Iniciar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]