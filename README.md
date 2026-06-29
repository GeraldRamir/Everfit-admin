# Everfit Admin

Panel de administración y API para everfit-proyect.

## Arquitectura

- **everfit-admin** (puerto 3001): API pública + panel admin + base de datos
- **everfit-proyect** (puerto 3000): página comercial que consume la API

## Setup

```bash
cd everfit-admin
npm install
npm run db:setup
npm run dev
```

## Login (dev)

- URL: http://localhost:3001/login
- Email: everfitbymich@gmail.com
- Password: everfit2026

## API pública

- GET /api/public/home
- GET /api/public/plans
- GET /api/public/challenges
- GET /api/public/recipes
- GET /api/public/blog
- POST /api/public/contact
