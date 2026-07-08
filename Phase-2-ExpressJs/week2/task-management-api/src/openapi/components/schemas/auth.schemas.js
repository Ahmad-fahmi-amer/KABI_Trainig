export const authSchemas = {
  LoginRequest: {
    type: "object",

    properties: {
      email: {
        type: "string",
        format: "email",
        example: "ahmad@example.com",
      },

      password: {
        type: "string",
        format: "password",
        example: "Password123",
      },
    },

    required: ["email", "password"],
  },
  RegisterRequest: {
    type: "object",

    properties: {
      name: {
        type: "string",
        format: "text",
        example: "omar",
      },

      email: {
        type: "string",
        format: "email",
        example: "omar@example.com",
      },

      password: {
        type: "string",
        format: "password",
        example: "Password123",
      },
    },

    required: ["name", "email", "password"],
  },
};
