# DevBlog backend

Express and Sequelize API for DevBlog.

## Run locally

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` and configure PostgreSQL first. Swagger UI is available at `http://localhost:5000/api/docs`.

## Full stack with Docker

From this directory, run `docker compose up --build`. It starts PostgreSQL and this API on port 5000.
