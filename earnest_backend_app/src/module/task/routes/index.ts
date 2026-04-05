import { Router } from "express";
import { addTaskValidator } from "../validator/addTaskValidator";
import { jwtVerify } from "../../../middlewares/jwtVerify";
import container from "../../../dependency";

const { taskController } = container.cradle as any;

const taskRoute = Router();
taskRoute.use(jwtVerify);

// create task
taskRoute.post("/tasks", addTaskValidator, (req, res, next) => {
    taskController.createTask(req, res, next)
})

// get task list with filters
taskRoute.get("/tasks", (req, res, next) => {
    taskController.getTasks(req, res, next)
})

// get task details by the id
taskRoute.get("/tasks/:id", (req, res, next) => {
    taskController.getTaskById(req, res, next)
})

// update the task details by the id
taskRoute.patch("/tasks/:id", (req, res, next) => {
    taskController.updateTask(req, res, next)
})

// delete the task details by the id
taskRoute.delete("/tasks/:id", (req, res, next) => {
    taskController.deleteTask(req, res, next)
})

// toggle the task details by the id
taskRoute.patch("/tasks/:id/toggle", (req, res, next) => {
    taskController.toggleTask(req, res, next)
})

export { taskRoute };