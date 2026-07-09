import swaggerJsdoc from "swagger-jsdoc";

import { bearerSecurityScheme } from "./components/security/bearer.security.js";

import { authPaths } from "./paths/auth.path.js";
import { commonResponses } from "./components/responses/common.response.js";
import { authResponses } from "./components/responses/auth.response.js";
import { commonSchemas } from "./components/schemas/common.schemas.js";
import { validationSchemas } from "./components/schemas/validationError.schemas.js";
import { authSchemas } from "./components/schemas/auth.schemas.js";
import { userSchemas } from "./components/schemas/user.schemas.js";
import { userParameters } from "./components/parameters/user.parameters.js";
import { userResponses } from "./components/responses/user.response.js";
import { usersPaths } from "./paths/users.paths.js";

export const openApiDocument = swaggerJsdoc({
  definition: {
    openapi: "3.1.0",

    info: {
      title: "Task Management REST API",
      version: "1.0.0",
      description: "Production Ready REST API",
    },

    servers: [
      {
        url: "/api/v1",
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: bearerSecurityScheme,
      },

      parameters: {
        ...userParameters,
      },

      schemas: {
        ...commonSchemas,
        ...validationSchemas,
        ...authSchemas,
        ...userSchemas,
      },
      responses: {
        ...commonResponses,
        ...authResponses,
        ...userResponses,
      },
    },

    paths: {
      ...authPaths,
      ...usersPaths,
    },
  },

  apis: [],
});
