export const authResponses = {
  LoginSuccess: {
    description: "User logged in successfully.",

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
                  type: "object",

                  properties: {
                    accessToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },

                    refreshToken: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },

                    user: {
                      $ref: "#/components/schemas/User",
                    },
                  },

                  required: ["accessToken", "refreshToken", "user"],
                },
              },

              required: ["data"],
            },
          ],
        },
      },
    },
  },
  RegisterSuccess: {
    description: "registerd successfully",

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
                  type: "object",

                  properties: {
                    user: {
                      $ref: "#/components/schemas/User",
                    },
                  },

                  required: ["user"],
                },
              },

              required: ["data"],
            },
          ],
        },
      },
    },
  },
};
