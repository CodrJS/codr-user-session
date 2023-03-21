import { ISession } from "@codrjs/models";
import { model, Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type SessionDocument = ISession & AccessibleFieldsModel<ISession>;
const SessionSchema = new Schema<ISession>(
  {
    status: {
      type: String,
      enum: ["INITIATING", "ESTABLISHED", "CLOSED"],
      required: true,
      default: "INITIATING",
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    userId: {
      type: SchemaTypes.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "User",
    },
    os: { type: String },
    browser: { type: String },
    ipAddress: { type: String },
    createdAt: String,
    updatedAt: String,
  },
  {
    timestamps: true,
  }
);

// exports Session model.
SessionSchema.plugin(accessibleFieldsPlugin);
SessionSchema.plugin(accessibleRecordsPlugin);
const Session = model<ISession, AccessibleModel<SessionDocument>>(
  "Session",
  SessionSchema
);
export default Session;
