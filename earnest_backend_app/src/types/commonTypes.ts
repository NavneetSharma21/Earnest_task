import { ModelName } from "../constants/tableConstants";
import { Request, Response } from "express";

interface BaseModel {
  create: (model: ModelName, data: any) => Promise<any>;
  findOne: (model: ModelName, where: any) => Promise<any>;
  update: (model: ModelName, where: any, data: any) => Promise<any>
  findAll : (model: ModelName, where: any ) => Promise<any>
  delete : (model: ModelName, where: any ) => Promise<any>
}

interface CommonHelpers {
  prepareResponse: (status: number, message: string, data?: any) => Promise<any>;
}

interface JWTLibrary {
  generateToken: (payload: object, isRefresh?: boolean) => Promise<string>;
  verifyToken: (token: string, isRefresh?: boolean) => Promise<any>;
}

interface ICommonHelpers {
  prepareResponse(
    status: number,
    message: string,
    data?: any
  ): Promise<any>;

  handleServiceResponse(
    req: Request,
    res: Response,
    serviceResponse: any
  ): Promise<void>;

  handleCookieResponse(
    res: Response,
    serviceResponse: any
  ): Promise<void>;
}

interface IUserService {
  signup(data: any ): Promise<any>;

  login(data: {
    email: string;
    password: string;
  }): Promise<any>;

  refreshToken(cookies: {
    refreshToken?: string;
  }): Promise<any>;

  logout(
    cookies: { refreshToken?: string },
    reqUser: { userId: number }
  ): Promise<any>;
}

interface ITaskService {
  createTask(data: any, userId: number): Promise<any>;

  getTasks(query: any, userId: number): Promise<any>;

  getTaskById(id: number, userId: number): Promise<any>;

  updateTask(id: number, data: any, userId: number): Promise<any>;

  deleteTask(id: number, userId: number): Promise<any>;

  toggleTask(id: number, userId: number): Promise<any>;
}

export { ICommonHelpers, IUserService, BaseModel, CommonHelpers, JWTLibrary, ITaskService };