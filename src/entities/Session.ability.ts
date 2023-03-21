import { Types, IUser } from "@codrjs/models";
import { SessionDocument } from "./Session";

const permissions: Types.Permissions<SessionDocument, "Session"> = {
  "codr:system": (_user, { can }) => {
    can("manage", "Session");
  },
  "codr:admin": (_user, { can }) => {
    can("manage", "Session");
  },
  "codr:researcher": (user, { can }) => {
    // can create, read, and update all sessions user owns
    can("edit", "Session", { userId: user._id });
  },
  "codr:annotator": (user, { can }) => {
    // can create, read, and update all sessions user owns
    can("edit", "Session", { userId: user._id });
  },
};

const SessionAbility = (user: IUser) => Types.DefineAbility(user, permissions);
export default SessionAbility;
