# Etapa de construcción
FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-slim

WORKDIR /app

# Instala 'serve' para servir la app compilada
RUN npm install -g serve

# Copia solo la carpeta 'dist' desde la etapa anterior
COPY --from=build /app/dist /app/dist

EXPOSE 3000

# Servir contenido estático desde /app/dist en el puerto 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
