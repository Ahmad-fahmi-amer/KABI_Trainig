export const commonSchemas = {
  SuccessEnvelope: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
        example: true,
      },

      message: {
        type: "string",
        example: "Operation completed successfully.",
      },
    },

    required: ["success", "message"],
  },

  ErrorEnvelope: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
        example: false,
      },

      message: {
        type: "string",
      },
    },

    required: ["success", "message"],
  },

  ValidationErrorItem: {
    type: "object",

    properties: {
      field: {
        type: "string",
        example: "email",
      },

      message: {
        type: "string",
        example: "Email is required.",
      },
    },

    required: ["field", "message"],
  },
};
