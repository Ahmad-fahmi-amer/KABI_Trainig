export const validationSchemas = {
  ValidationError: {
    allOf: [
      {
        $ref: "#/components/schemas/Error",
      },

      {
        type: "object",

        properties: {
          errors: {
            type: "array",

            items: {
              type: "object",

              properties: {
                field: {
                  type: "string",
                },

                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    ],
  },
};
