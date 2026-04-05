import { asClass, asValue, createContainer } from "awilix";
import {tableConstants} from "./constants/tableConstants";
import responseConstants from "./constants/responseConstants";
import jwtLibrary from "./libraries/jwtLibrary";
import commonHelpers from "./helpers/commonHelpers";
import commonConstants from "./constants/commonConstants";
import userController from "./module/auth/controllers/userController";
import userService from "./module/auth/services/userService";
import prisma from "./prismaClient";
import baseModel from "./models/baseModel";
import TaskController from "./module/task/controllers/taskController";
import TaskService from "./module/task/services/taskService";

const container = createContainer();

// common service related modules
container.register({
    tableConstants : asValue(tableConstants),
    responseConstants : asValue(responseConstants),
    commonConstants : asValue(commonConstants),
    commonHelpers : asClass(commonHelpers).singleton(),
    jwtLibrary : asClass(jwtLibrary).singleton(),
    prisma : asValue(prisma),
    baseModel : asClass(baseModel).singleton(),
})

// User module related classes
container.register({
    // auth related classes
    userController : asClass(userController).singleton(),
    userService : asClass(userService).singleton(),

    //task related classes
    taskController : asClass(TaskController).singleton(),
    taskService : asClass(TaskService).singleton(),

})

// dependency container
export default container;