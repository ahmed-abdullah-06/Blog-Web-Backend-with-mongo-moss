import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DevBlog API",
    version: "1.0.0",
    description:
      "API documentation for the DevBlog blogging platform, including authentication and post management endpoints.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, "..", "routes", "*.js").replace(/\\/g, "/"),
    path.join(__dirname, "..", "controllers", "*.js").replace(/\\/g, "/"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );

  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export { setupSwagger, swaggerSpec };
