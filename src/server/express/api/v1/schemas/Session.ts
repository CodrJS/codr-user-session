import type { OpenAPIV3_1 } from "openapi-types";

const UserSchema: OpenAPIV3_1.SchemaObject = {
  title: "Session Entity Schema",
  allOf: [{ $ref: "#/components/schemas/BaseEntitySchema" }],
  required: ["status", "os", "browser", "ipAddress", "userId"],
  properties: {
    status: {
      type: "string",
      default: "INITIATING",
      examples: ["INITIATING", "ESTABLISHED", "CLOSED"],
    },
    os: {
      type: "string",
    },
    browser: {
      type: "string",
    },
    ipAddress: {
      type: "string",
    },
    userId: {
      type: "string",
    },
  },
};

export default UserSchema;
