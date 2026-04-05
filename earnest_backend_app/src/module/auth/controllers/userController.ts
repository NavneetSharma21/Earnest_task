import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../types/authTypes";
import { IUserService, ICommonHelpers } from "../../../types/commonTypes";

class userController {
  userService: IUserService;
  commonHelpers: ICommonHelpers;

  constructor({
    userService,
    commonHelpers
  }: {
    userService: IUserService;
    commonHelpers: ICommonHelpers;
  }) {
    this.userService = userService;
    this.commonHelpers = commonHelpers;
  }

  // user signup controller
  async signup(req: Request, res: Response, next: NextFunction) {
    const returnData = await this.userService.signup(req.body);
    await this.commonHelpers.handleServiceResponse(req, res, returnData);
  }

  // user login controller
  async login(req: Request, res: Response, next: NextFunction) {
    const returnData = await this.userService.login(req.body);

    await this.commonHelpers.handleCookieResponse(res, returnData);
    await this.commonHelpers.handleServiceResponse(req, res, returnData);
  }

  // refresh token
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const returnData = await this.userService.refreshToken((req as any).cookies);

    await this.commonHelpers.handleCookieResponse(res, returnData);
    await this.commonHelpers.handleServiceResponse(req, res, returnData);
  }

  // get profile
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
      const cookies = (req as any).cookies;
      const reqUser = { userId: req.user!.userId };
      const returnData = await this.userService.logout(cookies, reqUser);

    await this.commonHelpers.handleServiceResponse(req, res, returnData);
  }
}

export default userController;