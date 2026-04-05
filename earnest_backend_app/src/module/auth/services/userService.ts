import { StatusCodes } from "http-status-codes";
import { hash, compare } from "bcrypt";
import { SignupData, LoginData, RefreshTokenCookies, ReqUser } from "../../../types/authTypes";
import { BaseModel, CommonHelpers, JWTLibrary } from "../../../types/commonTypes";

class UserService {
  jwtLibrary: JWTLibrary;
  commonHelpers: CommonHelpers;
  tableConstants: any;
  baseModel: BaseModel;

  constructor({
    commonHelpers,
    jwtLibrary,
    tableConstants,
    baseModel,
  }: {
    commonHelpers: CommonHelpers;
    jwtLibrary: JWTLibrary;
    tableConstants: any;
    baseModel: BaseModel;
  }) {
    this.commonHelpers = commonHelpers;
    this.jwtLibrary = jwtLibrary;
    this.tableConstants = tableConstants;
    this.baseModel = baseModel;
  }

  /** Signup user */
  async signup(reqData: SignupData) {
    try {
      const { fullName, email, password, cnfPassword } = reqData;

      const isExistEmail = await this.baseModel.findOne(this.tableConstants.USER, { email });
            
      if (isExistEmail)
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "EMAIL_ALREADY_EXIST");

      if (password !== cnfPassword)
        return await this.commonHelpers.prepareResponse(
          StatusCodes.BAD_REQUEST,
          "PASSWORD_AND_CNF_PASSWORD_SHOULD_BE_SAME"
        );

      const cryptPassword = await hash(password, 10);

      const userObj = { fullName, email, password: cryptPassword };

      await this.baseModel.create(this.tableConstants.USER, userObj);

      return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS");
    } catch (error: any) {
      console.error("Signup Error:", error.message);
      return error;
    }
  }

  /** Login user */
  async login(reqData: LoginData) {
    try {
      const { email, password } = reqData;

      const user = await this.baseModel.findOne(this.tableConstants.USER, { email });
      if (!user)
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "INVALID_USER_CREDENTIALS");

      const isPasswordValid = await compare(password, user.password);
      
      if (!isPasswordValid)
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "INVALID_PASSWORD");

      const accessToken = await this.jwtLibrary.generateToken({ userId: user.id, email: user.email });
      const refreshToken = await this.jwtLibrary.generateToken({ userId: user.id }, true);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      let refreshTokens: any[] = [];
      if (user.refreshTokens) {
        refreshTokens =
          typeof user.refreshTokens === "string" ? JSON.parse(user.refreshTokens) : user.refreshTokens;
      }

      refreshTokens.push({ token: refreshToken, expiresAt, createdAt: new Date() });
      if (refreshTokens.length > 5) refreshTokens.shift();

      await this.baseModel.update(this.tableConstants.USER, { email }, { refreshTokens: JSON.stringify(refreshTokens) });

      return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", {
        userId: user.id,
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
      });

    } catch (error: any) {
      console.error("Login Error:", error.message);
      return error;
    }
  }

  /** Refresh token */
  async refreshToken(reqCookies: RefreshTokenCookies) {
    try {
      const { refreshToken } = reqCookies;
      if (!refreshToken)
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "INVALID_REFRESH_TOKEN");

      const decode = await this.jwtLibrary.verifyToken(refreshToken, true);
      if (!decode?.userId)
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "INVALID_REFRESH_TOKEN");

      const userDetails = await this.baseModel.findOne(this.tableConstants.USER, { id: decode.userId });
      if (!userDetails)
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "USER_NOT_FOUND");

      let refreshTokens: any[] = [];
      if (userDetails.refreshTokens) {
        refreshTokens =
          typeof userDetails.refreshTokens === "string"
            ? JSON.parse(userDetails.refreshTokens)
            : userDetails.refreshTokens;
      }

      const existingToken = refreshTokens.find((t) => t.token === refreshToken);
      if (!existingToken)
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "REFRESH_TOKEN_MISMATCHED");

      if (new Date(existingToken.expiresAt) < new Date())
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "REFRESH_TOKEN_EXPIRED");

      refreshTokens = refreshTokens.filter((t) => t.token !== refreshToken);

      const newAccessToken = await this.jwtLibrary.generateToken({ userId: userDetails.id, email: userDetails.email });
      const newRefreshToken = await this.jwtLibrary.generateToken({ userId: userDetails.id, email: userDetails.email }, true);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      refreshTokens.push({ token: newRefreshToken, expiresAt, createdAt: new Date() });
      if (refreshTokens.length > 5) refreshTokens.shift();

      await this.baseModel.update(this.tableConstants.USER, { id: userDetails.id }, { refreshTokens: JSON.stringify(refreshTokens) });

      return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", {
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error: any) {
      console.error("RefreshToken Error:", error.message);
      return error;
    }
  }

  /** Logout user */
  async logout(reqCookies: RefreshTokenCookies, reqUser: ReqUser) {
    try {
      const { refreshToken } = reqCookies;
      const { userId } = reqUser;

      console.log("refreshToken", refreshToken);
      console.log("userId", userId);

      
      if (!refreshToken)
        return await this.commonHelpers.prepareResponse( StatusCodes.BAD_REQUEST, "REFRESH_TOKEN_NOT_PROVIDED" );

      // Find user
      const user = await this.baseModel.findOne(this.tableConstants.USER, { id: userId });
      if (!user)
        return await this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "USER_NOT_FOUND");

      // Parse refreshTokens array
      let refreshTokens: any[] = [];
      if (user.refreshTokens) {
        refreshTokens =
          typeof user.refreshTokens === "string" ? JSON.parse(user.refreshTokens) : user.refreshTokens;
      }

      // Remove the refresh token that is being logged out
      const filteredTokens = refreshTokens.filter((t) => t.token !== refreshToken);

      await this.baseModel.update(
        this.tableConstants.USER,
        { id: userId },
        { refreshTokens: JSON.stringify(filteredTokens) }
      );

      return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS");
    } catch (error: any) {
      console.error("Logout Error:", error.message);
      return error;
    }
  }
}

export default UserService;