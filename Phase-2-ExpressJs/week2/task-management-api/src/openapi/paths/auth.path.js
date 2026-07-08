export const authPaths = {
  "/auth/login": {
    post: {
      tags: ["Authentication"],

      summary: "Login",

      description: "Authenticate user and return JWT tokens.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },
          },
        },
      },

      responses: {
        200: {
          $ref: "#/components/responses/LoginSuccess",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },
  "auth/register": {
    post: {
      tags: ["Authentication"],

      summary: "Register",

      description: "Register a new User and return user information",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterRequest",
            },
          },
        },
      },

      responses: {
        201: {
          $ref: "#/components/responses/RegisterSuccess",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        409: {
          $ref: "#/components/responses/Conflict",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },
};
