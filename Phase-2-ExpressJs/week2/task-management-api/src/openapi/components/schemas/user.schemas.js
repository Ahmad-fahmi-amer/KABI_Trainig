export const userSchemas = {
  User: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "2ab34d66-97db-4fa8-b52d-f0bb2c5b0ab4",
      },

      name: {
        type: "string",
        example: "Ahmad",
      },

      email: {
        type: "string",
        format: "email",
        example: "ahmad@example.com",
      },

      role: {
        type: "string",
        enum: ["ADMIN", "USER"],
        example: "USER",
      },

      isActive: {
        type: "boolean",
        example: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },

    required: [
      "id",
      "name",
      "email",
      "role",
      "isActive",
      "createdAt",
      "updatedAt",
    ],
  },
};
