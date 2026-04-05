import { Response } from "express";
import { AuthRequest } from "../../../types/authTypes";
import { ITaskService, ICommonHelpers } from "../../../types/commonTypes";

class TaskController {
  taskService: ITaskService;
  commonHelpers: ICommonHelpers;

  constructor({
    taskService,
    commonHelpers
  }: {
    taskService: ITaskService;
    commonHelpers: ICommonHelpers;
  }) {
    this.taskService = taskService;
    this.commonHelpers = commonHelpers;
  }

  createTask = async (req: AuthRequest, res: Response) => {    
    const returnData = await this.taskService.createTask(req.body, req.user!.userId);
    return this.commonHelpers.handleServiceResponse(req, res, returnData);
  };

  getTasks = async (req: AuthRequest, res: Response) => {
    const returnData = await this.taskService.getTasks(req.query, req.user!.userId);
    return this.commonHelpers.handleServiceResponse(req, res, returnData);
  };

  getTaskById = async (req: AuthRequest, res: Response) => {
    const returnData = await this.taskService.getTaskById(Number(req.params.id), req.user!.userId );
    return this.commonHelpers.handleServiceResponse(req, res, returnData);
  };

  updateTask = async (req: AuthRequest, res: Response) => {
    const returnData = await this.taskService.updateTask(Number(req.params.id), req.body, req.user!.userId);
    return this.commonHelpers.handleServiceResponse(req, res, returnData);
  };

  deleteTask = async (req: AuthRequest, res: Response) => {
    const returnData = await this.taskService.deleteTask(Number(req.params.id), req.user!.userId);
    return this.commonHelpers.handleServiceResponse(req, res, returnData);
  };

  toggleTask = async (req: AuthRequest, res: Response) => {
    const returnData = await this.taskService.toggleTask(Number(req.params.id), req.user!.userId);
    return this.commonHelpers.handleServiceResponse(req, res, returnData);
  };
}

export default TaskController;