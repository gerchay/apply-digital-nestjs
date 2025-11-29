# Apply Digital – Technical Challenge

Este proyecto implementa una API en **NestJS** que sincroniza productos desde **Contentful**, los almacena en **MongoDB**, expone un catálogo público con paginación y filtros, y ofrece un módulo privado con autenticación **JWT** para generar reportes avanzados.

Incluye:
- Sincronización vía cron job  
- API pública y privada  
- Soft delete  
- Reportes estadísticos  
- Swagger  
- Docker final (API + Mongo)  
- Arquitectura modular  
- Buenas prácticas de NestJS  

---

## 🚀 Tecnologías utilizadas

- Node.js 24 LTS  
- NestJS 10  
- MongoDB 6  
- Mongoose  
- Contentful API  
- JWT + Passport  
- Swagger  
- Docker & Docker Compose  
- Jest  

---

## 📁 Estructura principal del proyecto

src/
auth/
products/
reports/
main.ts
app.module.ts

Dockerfile
docker-compose.yml
.env
.env.docker
README.md

---

# 1. Ejecutar en modo local

## 1.1 Instalar dependencias

```bash
npm install
```

## 1.2 Crear archivo .env

MONGODB_URI=mongodb://localhost:27017/applydigital
CONTENTFUL_SPACE_ID=bbd24zg4yngm
CONTENTFUL_ACCESS_TOKEN=<token>
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_CONTENT_TYPE=product

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=3600

## 1.3 Levantar MongoDB (local con Docker)
```bash
docker run -d --name applydigital_mongo -p 27017:27017 -v mongodata:/data/db mongo:6
npm run start:dev
```

Swagger disponible en:
```bash
http://localhost:3000/api/docs
```

# 2. Ejecutar todo con Docker (API + Mongo)
## 2.1 Crear archivo .env.docker

```bash
MONGODB_URI=mongodb://mongo:27017/applydigital

CONTENTFUL_SPACE_ID=bbd24zg4yngm
CONTENTFUL_ACCESS_TOKEN=<token>
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_CONTENT_TYPE=product

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=3600
```

## 2.2 Ejecutar Docker Compose
```bash
docker compose build
docker compose up -d
```

URLs:
```bash
API: http://localhost:3000
Swagger: http://localhost:3000/api/docs
```



# 3. Funcionalidades principales
- Cron automático que sincroniza productos desde Contentful
- Mapeo y transformación de datos
- Upsert para evitar duplicados
- No revive productos eliminados

