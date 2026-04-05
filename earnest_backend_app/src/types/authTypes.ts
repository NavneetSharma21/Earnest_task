
import { Request } from "express";

interface AuthUser {
  userId: number;
  email?: string;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  cnfPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RefreshTokenCookies {
  refreshToken?: string;
}

interface ReqUser {
  userId: number;
}

interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export { SignupData, LoginData, RefreshTokenCookies, ReqUser, AuthRequest, AuthUser, JwtPayload };