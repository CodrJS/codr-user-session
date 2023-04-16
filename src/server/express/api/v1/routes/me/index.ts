import { Error, Response } from "@codrjs/models";
import { Operation } from "@dylanbulmer/openapi/types/Route";
import verifyJWT from "@/server/express/middlewares/verifyJWT";
import { SessionUtility } from "@/utils/SessionUtility";
import { R200, R401, R403 } from "@dylanbulmer/openapi/classes/responses";

export const GET: Operation = [
  /* business middleware not expressible by OpenAPI documentation goes here */
  verifyJWT,
  (req, res) => {
    // const util = new SessionUtility();
    // util
    //   .get(req.user, <string>(req.user._id as unknown))
    //   .then(resp => res.status(200).json(resp))
    //   .catch((err: Error) => res.status(err.status).json(err));
    res.json(
      new Response({
        message: "Endpoint not available.",
      })
    );
  },
];

// 3.0 specification
GET.apiDoc = {
  description: "Get active session from database.",
  tags: ["Self Management"],
  responses: {
    "200": {
      description: R200.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              details: {
                type: "object",
                properties: {
                  session: {
                    $ref: "#/components/schemas/SessionEntitySchema",
                  },
                },
              },
              message: {
                type: "string",
                examples: ["OK"],
              },
            },
          },
        },
      },
    },
    "401": {
      description: R401.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [401],
              },
              message: {
                type: "string",
                examples: ["User is unauthorized."],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
    "403": {
      description: R403.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [403],
              },
              message: {
                type: "string",
                examples: ["User is forbidden from reading this user."],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
};
