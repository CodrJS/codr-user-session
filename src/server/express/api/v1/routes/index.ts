import { Error } from "@codrjs/models";
import { Operation } from "@dylanbulmer/openapi/types/Route";
import verifyJWT from "@/server/express/middlewares/verifyJWT";
import { SessionUtility } from "@/utils/SessionUtility";
import { R201, R401, R403, R500 } from "@dylanbulmer/openapi/classes/responses";
import { Session } from "@codrjs/models";
import { Types } from "mongoose";

export const POST: Operation = [
  /* business middleware not expressible by OpenAPI documentation goes here */
  verifyJWT,
  (req, res) => {
    const util = new SessionUtility();

    const ua = req.useragent;
    const ip = (
      <string>req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      ""
    )
      .split(",")[0]
      .trim();

    const sess = new Session({
      os: ua?.os,
      browser: ua?.browser,
      ipAddress: ip,
      userId: req.user._id as Types.ObjectId,
    });

    util
      .create(req.user, sess.toJSON())
      .then(resp => res.status(200).json(resp))
      .catch((err: Error) => res.status(err.status || 500).json(err));
  },
];

// 3.0 specification
POST.apiDoc = {
  description: "Create a session in the database.",
  tags: ["Session Management"],
  responses: {
    "201": {
      description: R201.description,
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
                examples: ["User is forbidden from reading this session."],
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
    "500": {
      description: R500.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [500],
              },
              message: {
                type: "string",
                examples: [
                  "An unexpected error occurred when trying to create a session.",
                ],
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
