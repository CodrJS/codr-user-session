import { Types as CodrTypes, Session, User } from "@codrjs/models";
import jwt from "jsonwebtoken";
import { SessionUtility } from "@/utils/SessionUtility";
import { Types } from "mongoose";
import Mongo from "@/utils/Mongo";
import { Documents } from "@codrjs/mongo";
import Config from "@codrjs/config";

const generateSession = (
  userId: Types.ObjectId,
  createdBy: Types.ObjectId
): Session => {
  return new Session({
    userId,
    os: "Test OS",
    browser: "Test Browser",
    ipAddress: "0.0.0.0",
    createdBy,
  });
};

const generateUserJwt = (user: User) => {
  return jwt.decode(
    jwt.sign(user.toJSON(), Config.jwt.secret, {
      issuer: Config.jwt.issuer,
      algorithm: <jwt.Algorithm>Config.jwt.algorithm,
      subject: user._id.toString(),
      expiresIn: "1h",
      jwtid: new Types.ObjectId().toString(),
    })
  ) as CodrTypes.JwtPayload;
};

// const testSystemSession = new Session({
//   _id: new Types.ObjectId(0),
//   userId: testSystemUser._id as Types.ObjectId,
//   status: "ESTABLISHED",
//   os: "",
//   browser: "",
//   ipAddress: "",
// }).toJSON();

// const testAdminSession = new Session({
//   _id: new Types.ObjectId(1),
//   userId: testAdminUser._id as Types.ObjectId,
//   status: "ESTABLISHED",
//   os: "",
//   browser: "",
//   ipAddress: "",
// }).toJSON();

// const testResearchSession = new Session({
//   _id: new Types.ObjectId(2),
//   userId: testResearchUser._id as Types.ObjectId,
//   status: "ESTABLISHED",
//   os: "",
//   browser: "",
//   ipAddress: "",
// }).toJSON();

// const testAnnotatorSession = new Session({
//   _id: new Types.ObjectId(3),
//   userId: testAnnotatorUser._id as Types.ObjectId,
//   status: "ESTABLISHED",
//   os: "",
//   browser: "",
//   ipAddress: "",
// }).toJSON();

// const demoNewSession = new Session({
//   _id: new Types.ObjectId(4),
//   userId: new Types.ObjectId(10),
//   status: "INITIATING",
//   os: "",
//   browser: "",
//   ipAddress: "",
// }).toJSON();

describe("Session Utility", () => {
  let Utility: SessionUtility;
  let SystemUser: {
    Payload: CodrTypes.JwtPayload;
  };
  let AdminUser: {
    Payload: CodrTypes.JwtPayload;
  };
  let ResearchUser: {
    Class: Session;
    Payload: CodrTypes.JwtPayload;
  };
  let AnnotatorUser: {
    Class: Session;
    Payload: CodrTypes.JwtPayload;
  };

  beforeAll(async () => {
    // connect to mongo
    await Mongo.connect();

    const MongoUser = Mongo.User.User;
    Utility = new SessionUtility();

    // get user documents
    const sysUser = new User(
      (await MongoUser.findOne({
        email: "system@codrjs.com",
      })) as Documents.UserDocument
    );
    const adminUser = new User(
      (await MongoUser.findOne({
        role: CodrTypes.UserRoleEnum.ADMIN,
      })) as Documents.UserDocument
    );

    SystemUser = {
      Payload: generateUserJwt(sysUser),
    };

    AdminUser = {
      Payload: generateUserJwt(adminUser),
    };

    // AnnotatorUser = {
    //   Class: annotator,
    //   Payload: generateUserJwt(annotator),
    // };
  });

  afterAll(async () => {
    await Mongo.close();
  });

  describe("Create: Session", () => {
    test("System can add session", async () => {
      // run tests
      const data = generateSession(
        new Types.ObjectId(),
        new Types.ObjectId(SystemUser.Payload.sub)
      );
      const response = await Utility.create(SystemUser.Payload, data);
      expect(response.details.session.status).toBe("INITIATING");
    });

    test("Admin can add session", async () => {
      // run tests
      const data = generateSession(
        new Types.ObjectId(),
        new Types.ObjectId(AdminUser.Payload.sub)
      );
      const response = await Utility.create(AdminUser.Payload, data);
      expect(response.details.session.status).toBe("INITIATING");
    });

    // test("Researcher can add session", async () => {
    //   // mock function returns once
    //   MongoSession.findById = jest
    //     .fn()
    //     .mockResolvedValueOnce(testResearchSession);
    //   MongoSession.create = jest.fn().mockResolvedValueOnce(demoNewSession);

    //   // run tests
    //   const session = await Utility.create(testResearchUser, demoNewSession);
    //   expect(session.details.session.status).toBe("INITIATING");
    // });

    // test("Annotator can add session", async () => {
    //   // mock function returns once
    //   MongoSession.findById = jest
    //     .fn()
    //     .mockResolvedValueOnce(testAnnotatorSession);
    //   MongoSession.create = jest.fn().mockResolvedValueOnce(demoNewSession);

    //   // run tests
    //   const session = await Utility.create(testAnnotatorUser, demoNewSession);
    //   expect(session.details.session.status).toBe("INITIATING");
    // });
  });

  // describe("Session Utility: Read", () => {
  //   test("System can read another session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

  //     // run tests
  //     const session = await Utility.get(
  //       testSystemUser,
  //       demoNewSession._id as unknown as string
  //     );
  //     expect(session.details.session.status).toBe("INITIATING");
  //   });

  //   test("Admin can read another session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

  //     // run tests
  //     const session = await Utility.get(
  //       testAdminUser,
  //       demoNewSession._id as unknown as string
  //     );
  //     expect(session.details.session.status).toBe("INITIATING");
  //   });

  //   test("Researcher cannot read another user's session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

  //     // run tests
  //     const session = await Utility.get(
  //       testAdminUser,
  //       demoNewSession._id as unknown as string
  //     );
  //     expect(session.details.session.status).toBe("INITIATING");
  //   });

  //   test("Annotator cannot read another session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

  //     // run tests
  //     expect(
  //       Utility.get(testAnnotatorUser, demoNewSession._id as unknown as string)
  //     ).rejects.toEqual(
  //       new Error({
  //         status: 403,
  //         message: "User is forbidden from reading this session.",
  //       })
  //     );
  //   });
  // });

  // describe("Session Utility: Update", () => {
  //   test("System can update another session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);
  //     MongoSession.findByIdAndUpdate = jest
  //       .fn()
  //       .mockResolvedValueOnce(demoNewSession);

  //     // run tests
  //     const session = await Utility.update(
  //       testSystemUser,
  //       demoNewSession._id as unknown as string,
  //       demoNewSession
  //     );
  //     expect(session.details.session.status).toBe("INITIATING");
  //   });

  //   test("System can update system session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest
  //       .fn()
  //       .mockResolvedValueOnce(testSystemSession);
  //     MongoSession.findByIdAndUpdate = jest
  //       .fn()
  //       .mockResolvedValueOnce(testSystemSession);

  //     // run tests
  //     expect(
  //       Utility.update(
  //         testSystemUser,
  //         testSystemSession._id as unknown as string,
  //         testSystemSession
  //       )
  //     ).resolves.toEqual(
  //       new Response({
  //         message: "OK",
  //         details: { session: new Session(testSystemSession) },
  //       })
  //     );
  //   });

  //   test("Admin can update another session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest.fn().mockResolvedValueOnce(testAdminSession);
  //     MongoSession.findByIdAndUpdate = jest
  //       .fn()
  //       .mockResolvedValueOnce(demoNewSession);

  //     // run tests
  //     const session = await Utility.update(
  //       testAdminUser,
  //       demoNewSession._id as unknown as string,
  //       demoNewSession
  //     );
  //     expect(session.details.session.status).toBe("INITIATING");
  //   });

  //   test("Admin cannot update system session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest
  //       .fn()
  //       .mockResolvedValueOnce(testSystemSession);

  //     // run tests
  //     expect(
  //       Utility.update(
  //         testResearchUser,
  //         testSystemSession._id as unknown as string,
  //         testSystemSession
  //       )
  //     ).rejects.toEqual(
  //       new Error({
  //         status: 403,
  //         message: "User is forbidden from updating this session.",
  //       })
  //     );
  //   });

  //   test("Researcher cannot update sessions", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

  //     // run tests
  //     expect(
  //       Utility.update(
  //         testResearchUser,
  //         demoNewSession._id as unknown as string,
  //         demoNewSession
  //       )
  //     ).rejects.toEqual(
  //       new Error({
  //         status: 403,
  //         message: "User is forbidden from updating this session.",
  //       })
  //     );
  //   });

  //   test("Annotator cannot update another user's sessions", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest.fn().mockResolvedValueOnce(demoNewSession);

  //     // run tests
  //     expect(
  //       Utility.update(
  //         testAnnotatorUser,
  //         demoNewSession._id as unknown as string,
  //         demoNewSession
  //       )
  //     ).rejects.toEqual(
  //       new Error({
  //         status: 403,
  //         message: "User is forbidden from updating this session.",
  //       })
  //     );
  //   });

  //   test("Researcher can update own session", async () => {
  //     // mock function returns once
  //     MongoSession.findById = jest
  //       .fn()
  //       .mockResolvedValueOnce(testResearchSession);
  //     MongoSession.findByIdAndUpdate = jest
  //       .fn()
  //       .mockResolvedValueOnce(testResearchSession);

  //     // run tests
  //     const session = await Utility.update(
  //       testResearchUser,
  //       testResearchSession._id as unknown as string,
  //       testResearchSession
  //     );
  //     expect(session.details.session.status).toBe("ESTABLISHED");
  //   });
  // });

  /**
   * @TODO Add test cases for (soft) deleting a session.
   */
});
