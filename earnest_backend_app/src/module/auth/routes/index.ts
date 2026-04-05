import { Router } from "express";
import { signupValidator } from "../validator/signupValidator";
import { loginValidator } from "../validator/loginValidator";
import { jwtVerify } from "../../../middlewares/jwtVerify";
import container from "../../../dependency";

const { userController } = container.cradle as any;

const userAuth = Router();

// user auth signup api route
userAuth.post("/register", signupValidator, (req, res, next) => {    
    userController.signup(req, res, next)
})

// user auth login api route
userAuth.post("/login", loginValidator, (req, res, next) => {
    userController.login(req, res, next)
})

// user auth generate new token api route
userAuth.post("/refreshToken", (req, res, next) => {
    userController.refreshToken(req, res, next)
})

// user logout api route
userAuth.post("/logout", jwtVerify, (req, res, next)=>{
    userController.logout(req, res, next);
})

export { userAuth };