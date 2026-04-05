import { Router  } from "express";
import { userAuth } from "../auth/routes";
import { taskRoute } from "../task/routes";

const allRoutes = Router();

// user authentication module routes
allRoutes.use("/auth", userAuth);
// user task module routes
allRoutes.use("/", taskRoute);

export { allRoutes };