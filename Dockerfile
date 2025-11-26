# Imagen base con Node LTS (Active LTS)
FROM node:24-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json/yarn.lock
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar Nest a dist/
RUN npm run build

# Exponer el puerto de Nest
EXPOSE 3000

# Comando de arranque en modo producción
CMD ["npm", "run", "start:dev"]
