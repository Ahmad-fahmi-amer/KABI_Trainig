export const commonResponses = {
  ValidationError: {
    description: "Validation failed.",

    content: {
      "application/json": {
        schema: {
          allOf: [
            {
              $ref: "#/components/schemas/ErrorEnvelope",
            },
            {
              type: "object",

              properties: {
                errors: {
                  type: "array",

                  items: {
                    $ref: "#/components/schemas/ValidationErrorItem",
                  },
                },
              },

              required: ["errors"],
            },
          ],
        },
      },
    },
  },

  Forbidden: {
    description: "Access denied.",

    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorEnvelope",
        },
        example: {
          success: false,
          message: "user was deleted",
        },
      },
    },
  },

  Unauthorized: {
    description: "Authentication failed.",

    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorEnvelope",
        },
        example: {
          success: false,
          message: "Unauthorized Error",
        },
      },
    },
  },

  NotFound: {
    description: "Requested resource was not found.",

    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorEnvelope",
        },
        example: {
          success: false,
          message: "user not found",
        },
      },
    },
  },

  Conflict: {
    description: "Resource already exists.",

    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorEnvelope",
        },
        example: {
          success: false,
          message: "Resource already exists.",
        },
      },
    },
  },

  InternalServerError: {
    description: "Internal server error.",

    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorEnvelope",
        },
        example: {
          success: false,
          message: "internal server error",
        },
      },
    },
  },
};
