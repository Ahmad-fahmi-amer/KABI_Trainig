export const userResponses = {
  UserSuccess: {
    description: "Successful operation.",

    content: {
      "application/json": {
        schema: {
          allOf: [
            {
              $ref: "#/components/schemas/SuccessEnvelope",
            },
            {
              type: "object",

              properties: {
                data: {
                  $ref: "#/components/schemas/User",
                },
              },

              required: ["data"],
            },
          ],
        },
      },
    },
  },

  UsersSuccess: {
    description: "Successful operation.",

    content: {
      "application/json": {
        schema: {
          allOf: [
            {
              $ref: "#/components/schemas/SuccessEnvelope",
            },
            {
              type: "object",

              properties: {
                data: {
                  type: "array",

                  items: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },

              required: ["data"],
            },
          ],
        },
      },
    },
  },

  NoContent: {
    description: "Operation completed successfully.",
  },
};
