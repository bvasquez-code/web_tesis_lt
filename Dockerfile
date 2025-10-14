# --------- Build (Node) ---------
FROM node:18-alpine AS builder
WORKDIR /app

# Dependencias primero para cachear mejor
COPY package*.json ./
RUN npm ci

# Código fuente y build
COPY . .
# Si usas Angular >=16 con builder nuevo, "npm run build" ya saca prod
RUN npm run build

# --------- Run (Nginx) ----------
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Limpia default y copia tu conf
RUN rm /etc/nginx/conf.d/default.conf
# Usa el nombre que REALMENTE tienes en el repo:
COPY default.conf /etc/nginx/conf.d/

# Copia artefactos Angular (ajusta ruta según tu versión/proyecto)
# Angular 15 clásico:
COPY --from=builder /app/dist/web_ccadmin ./
# Angular 17+ (builder nuevo) suele generar /dist/web_ccadmin/browser
# COPY --from=builder /app/dist/web_ccadmin/browser ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]