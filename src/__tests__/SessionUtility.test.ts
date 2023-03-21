import { Error, ISession, IUser, Response, Session } from "@codrjs/models";
import { SessionUtility } from "@/utils/SessionUtility";
import { Types } from "mongoose";
import MongoSession from "@/entities/Session";
const Utility = new SessionUtility();

const testSystemUser: IUser = {
  _id: new Types.ObjectId(0),
  type: "member",
  email: "system",
  role: "codr:system",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testAdminUser: IUser = {
  _id: new Types.ObjectId(1),
  type: "member",
  email: "admin",
  role: "codr:admin",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testResearchUser: IUser = {
  _id: new Types.ObjectId(2),
  type: "member",
  email: "researcher",
  role: "codr:researcher",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testAnnotatorUser: IUser = {
  _id: new Types.ObjectId(3),
  type: "member",
  email: "annotator",
  role: "codr:annotator",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
};

const testSystemSession = new Session({
  _id: new Types.ObjectId(0),
  userId: testSystemUser._id as Types.ObjectId,
  status: "ESTABLISHED",
  accessToken: "",
  refreshToken: "",
  os: "",
  browser: "",
  ipAddress: "",
}).toJSON();

const testAdminSession = new Session({
  _id: new Types.ObjectId(1),
  userId: testAdminUser._id as Types.ObjectId,
  status: "ESTABLISHED",
  accessToken: "",
  refreshToken: "",
  os: "",
  browser: "",
  ipAddress: "",
}).toJSON();

const testResearchSession = new Session({
  _id: new Types.ObjectId(2),
  userId: testResearchUser._id as Types.ObjectId,
  status: "ESTABLISHED",
  accessToken: "",
  refreshToken: "",
  os: "",
  browser: "",
  ipAddress: "",
}).toJSON();

const testAnnotatorSession = new Session({
  _id: new Types.ObjectId(3),
  userId: testAnnotatorUser._id as Types.ObjectId,
  status: "ESTABLISHED",
  accessToken: "",
  refreshToken: "",
  os: "",
  browser: "",
  ipAddress: "",
}).toJSON();

const demoNewSession = new Session({
  _id: new Types.ObjectId(4),
  userId: new Types.ObjectId(10),
  status: "INITIATING",
  accessToken: "",
  refreshToken: "",
  os: "",
  browser: "",
  ipAddress: "",
}).toJSON();

describe("Session Utility: Create", () => {
  test("System can add session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(testSystemSession);
    MongoSession.create = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.create(testSystemUser, demoNewSession);
    expect(session.details.session.status).toBe("INITIATING");
  });

  test("Admin can add session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(testAdminSession);
    MongoSession.create = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.create(testAdminUser, demoNewSession);
    expect(session.details.session.status).toBe("INITIATING");
  });

  test("Researcher can add session", async () => {
    // mock function returns once
    MongoSession.findById = jest
      .fn()
      .mockResolvedValueOnce(testResearchSession);
    MongoSession.create = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.create(testResearchUser, demoNewSession);
    expect(session.details.session.status).toBe("INITIATING");
  });

  test("Annotator can add session", async () => {
    // mock function returns once
    MongoSession.findById = jest
      .fn()
      .mockResolvedValueOnce(testAnnotatorSession);
    MongoSession.create = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.create(testAnnotatorUser, demoNewSession);
    expect(session.details.session.status).toBe("INITIATING");
  });
});

describe("Session Utility: Read", () => {
  test("System can read another session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.get(
      testSystemUser,
      demoNewSession._id as unknown as string
    );
    expect(session.details.session.status).toBe("INITIATING");
  });

  test("Admin can read another session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.get(
      testAdminUser,
      demoNewSession._id as unknown as string
    );
    expect(session.details.session.status).toBe("INITIATING");
  });

  test("Researcher cannot read another user's session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.get(
      testAdminUser,
      demoNewSession._id as unknown as string
    );
    expect(session.details.session.status).toBe("INITIATING");
  });

  test("Annotator cannot read another session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    expect(
      Utility.get(testAnnotatorUser, demoNewSession._id as unknown as string)
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from reading this session.",
      })
    );
  });
});

describe("Session Utility: Update", () => {
  test("System can update another session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);
    MongoSession.findByIdAndUpdate = jest
      .fn()
      .mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.update(
      testSystemUser,
      demoNewSession._id as unknown as string,
      demoNewSession
    );
    expect(session.details.session.status).toBe("INITIATING");
  });

  test("System can update system session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(testSystemSession);
    MongoSession.findByIdAndUpdate = jest
      .fn()
      .mockResolvedValueOnce(testSystemSession);

    // run tests
    expect(
      Utility.update(
        testSystemUser,
        testSystemSession._id as unknown as string,
        testSystemSession
      )
    ).resolves.toEqual(
      new Response({
        message: "OK",
        details: { session: new Session(testSystemSession) },
      })
    );
  });

  test("Admin can update another session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(testAdminSession);
    MongoSession.findByIdAndUpdate = jest
      .fn()
      .mockResolvedValueOnce(demoNewSession);

    // run tests
    const session = await Utility.update(
      testAdminUser,
      demoNewSession._id as unknown as string,
      demoNewSession
    );
    expect(session.details.session.status).toBe("INITIATING");
  });

  test("Admin cannot update system session", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(testSystemSession);

    // run tests
    expect(
      Utility.update(
        testResearchUser,
        testSystemSession._id as unknown as string,
        testSystemSession
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this session.",
      })
    );
  });

  test("Researcher cannot update sessions", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    expect(
      Utility.update(
        testResearchUser,
        demoNewSession._id as unknown as string,
        demoNewSession
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this session.",
      })
    );
  });

  test("Annotator cannot update another user's sessions", async () => {
    // mock function returns once
    MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

    // run tests
    expect(
      Utility.update(
        testAnnotatorUser,
        demoNewSession._id as unknown as string,
        demoNewSession
      )
    ).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from updating this session.",
      })
    );
  });

  test("Researcher can update own session", async () => {
    // mock function returns once
    MongoSession.findById = jest
      .fn()
      .mockResolvedValueOnce(testResearchSession);
    MongoSession.findByIdAndUpdate = jest
      .fn()
      .mockResolvedValueOnce(testResearchSession);

    // run tests
    const session = await Utility.update(
      testResearchUser,
      testResearchSession._id as unknown as string,
      testResearchSession
    );
    expect(session.details.session.status).toBe("ESTABLISHED");
  });
});

/**
 * @TODO Add test cases for (soft) deleting a session.
 */
