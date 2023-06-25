import {
  Session,
  ISession,
  Utility,
  Error,
  Response,
  Types,
} from "@codrjs/models";
import { Abilities, Documents } from "@codrjs/mongo";
import Mongo from "./Mongo";

type Document = Documents.SessionDocument;
type JwtPayload = Types.JwtPayload;

export class SessionUtility extends Utility {
  private Session;

  constructor() {
    super();
    this.Session = Mongo.User.Session;
  }

  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    try {
      return (await this.Session.findById(id)) as T;
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

  async get(token: JwtPayload, id: string) {
    // get desired session document
    const session = await this._getDocument<Document>(id);

    // if session and read the document, send it, else throw error
    if (Abilities.SessionAbility(token).can("read", session)) {
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

  async create(token: JwtPayload, obj: Session) {
    // if session can create sessions
    if (Abilities.SessionAbility(token).can("create", obj)) {
      try {
        // create session
        const session = await this.Session.create(obj.toJSON());
        return new Response({
          message: "OK",
          details: { session: new Session(session) },
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

  async update(token: JwtPayload, id: string, obj: Partial<ISession>) {
    // get desired session document
    const session = new Session(await this._getDocument<Document>(id));

    // check permissions
    if (Abilities.SessionAbility(token).can("update", session)) {
      try {
        // update session.
        const updatedSession = (await this.Session.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as Document;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            session: new Session(updatedSession),
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
  async delete(token: JwtPayload, id: string) {
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
