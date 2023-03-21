import { subject } from "@casl/ability";
import {
  Session,
  ISession,
  Utility,
  Error,
  Response,
  IUser,
} from "@codrjs/models";
import MongoSession, { SessionDocument } from "@/entities/Session";
import SessionAbility from "@/entities/Session.ability";

export class SessionUtility extends Utility {
  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    try {
      return (await MongoSession.findById(id)) as T;
    } catch (err) {
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching session.",
        details: {
          sessionId: id,
          error: err,
        },
      });
    }
  }

  async get(token: IUser, id: string) {
    // get desired session document
    const session = await this._getDocument<SessionDocument>(id);

    // if session and read the document, send it, else throw error
    if (SessionAbility(token).can("read", subject("Session", session))) {
      return new Response({
        message: "OK",
        details: {
          session: new Session(session),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this session.",
      });
    }
  }

  async create(token: IUser, obj: ISession) {
    // if session can create sessions
    if (SessionAbility(token).can("create", "Session")) {
      try {
        // create session
        const session = await MongoSession.create(obj);
        return new Response({
          message: "OK",
          details: {
            session: new Session(session),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to create a session.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from creating sessions.",
      });
    }
  }

  async update(token: IUser, id: string, obj: Partial<ISession>) {
    // get desired session document
    const session = await this._getDocument<SessionDocument>(id);

    // check permissions
    if (SessionAbility(token).can("update", subject("Session", session))) {
      try {
        // update session.
        const session = (await MongoSession.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as SessionDocument;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            session: new Session(session),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to update a session.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from updating this session.",
      });
    }
  }

  /**
   * @todo Hard or soft delete sessions?
   */
  async delete(token: IUser, id: string) {
    throw new Error({
      status: 500,
      message: "Method not implemented.",
    });

    // expected return???
    return new Response({
      message: "OK",
      details: {
        session: undefined,
      },
    });
  }
}
