export const usersPaths = {
  "/users": {
    get: {
      tags: ["Users"],

      summary: "Get all users",

      description: "Retrieve all users. Accessible only by administrators.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      responses: {
        200: {
          $ref: "#/components/responses/UsersSuccess",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },

    post: {
      tags: ["Users"],

      summary: "Create user",

      description: "Create a new user. Accessible only by administrators.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateUserRequest",
            },
          },
        },
      },

      responses: {
        201: {
          $ref: "#/components/responses/UserSuccess",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
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
  "/users/{id}": {
    get: {
      tags: ["Users"],

      summary: "Get user by ID",

      description: "Retrieve a user by ID. Accessible only by administrators.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: "#/components/parameters/UserId",
        },
      ],

      responses: {
        200: {
          $ref: "#/components/responses/UserSuccess",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },

    patch: {
      tags: ["Users"],

      summary: "Update user",

      description: "Update a user by ID. Accessible only by administrators.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: "#/components/parameters/UserId",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateUserRequest",
            },
          },
        },
      },

      responses: {
        200: {
          $ref: "#/components/responses/UserSuccess",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        409: {
          $ref: "#/components/responses/Conflict",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },

    delete: {
      tags: ["Users"],

      summary: "Delete user",

      description: "Delete a user by ID. Accessible only by administrators.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: "#/components/parameters/UserId",
        },
      ],

      responses: {
        204: {
          $ref: "#/components/responses/NoContent",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },
  "/users/email/{email}": {
    get: {
      tags: ["Users"],

      summary: "Get user by email",

      description:
        "Retrieve a user by email. Accessible only by administrators.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      parameters: [
        {
          $ref: "#/components/parameters/UserEmail",
        },
      ],

      responses: {
        200: {
          $ref: "#/components/responses/UserSuccess",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        403: {
          $ref: "#/components/responses/Forbidden",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },

  "/users/me": {
    get: {
      tags: ["Users"],

      summary: "Get current user",

      description: "Retrieve the authenticated user's profile.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      responses: {
        200: {
          $ref: "#/components/responses/UserSuccess",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },

    patch: {
      tags: ["Users"],

      summary: "Update current user",

      description: "Update the authenticated user's profile.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateUserRequest",
            },
          },
        },
      },

      responses: {
        200: {
          $ref: "#/components/responses/UserSuccess",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        409: {
          $ref: "#/components/responses/Conflict",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },

    delete: {
      tags: ["Users"],

      summary: "Delete current user",

      description: "Delete the authenticated user's account.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      responses: {
        204: {
          $ref: "#/components/responses/NoContent",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },

  "/users/me/password": {
    patch: {
      tags: ["Users"],

      summary: "Change password",

      description: "Change the authenticated user's password.",

      security: [
        {
          BearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ChangePasswordRequest",
            },
          },
        },
      },

      responses: {
        200: {
          $ref: "#/components/responses/UserSuccess",
        },

        400: {
          $ref: "#/components/responses/ValidationError",
        },

        401: {
          $ref: "#/components/responses/Unauthorized",
        },

        404: {
          $ref: "#/components/responses/NotFound",
        },

        500: {
          $ref: "#/components/responses/InternalServerError",
        },
      },
    },
  },
};
