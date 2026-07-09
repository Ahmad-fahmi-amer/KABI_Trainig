export const userParameters = {
  UserId: {
    name: "id",

    in: "path",

    required: true,

    description: "User ID",

    schema: {
      type: "string",
      format: "uuid",
    },
  },

  UserEmail: {
    name: "email",

    in: "path",

    required: true,

    description: "User email",

    schema: {
      type: "string",
      format: "email",
    },
  },
};
