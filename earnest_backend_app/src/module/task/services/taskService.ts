import { StatusCodes } from "http-status-codes";
import { BaseModel, ICommonHelpers } from "../../../types/commonTypes";

class TaskService {
    commonHelpers: ICommonHelpers;
    tableConstants: any;
    baseModel: BaseModel;

  constructor({
    commonHelpers,
    tableConstants,
    baseModel,
  }: {
    commonHelpers: ICommonHelpers;
    tableConstants: any;
    baseModel: BaseModel;
  }) {
    this.commonHelpers = commonHelpers;
    this.tableConstants = tableConstants;
    this.baseModel = baseModel;
  }

  // Create Task
  async createTask(data: any, userId: number) {
    try {
        const isExistTask = await this.baseModel.findOne(this.tableConstants.TASK, { title: data.title, userId });
        if(isExistTask) return this.commonHelpers.prepareResponse(StatusCodes.BAD_REQUEST, "TITLE_ALREADY_EXIST");

        const task = await this.baseModel.create(this.tableConstants.TASK, { title: data.title, userId });
        return this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", task);
        
    } catch (error) {
        throw error;
    }
  }

  // Get Tasks (pagination + filter + search)
  async getTasks(query: any, userId: number) {
    try {
        let { pageNo, limit = 6, status, search } = query;
        pageNo = pageNo ? parseInt(pageNo) : 1 ;
        const skip = (pageNo - 1) * limit;

        let where: any = { userId };
        
        // filter by status
        if (status) where.completed = status === "completed" ? true : false;

        // search by title
        if (search) where.title = { contains: search };

        const tasks = await this.baseModel.findAll(this.tableConstants.TASK, {
            where,
            skip: Number(skip),
            take: Number(limit),
            orderBy: { createdAt: "desc" },
        });

        return this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", tasks );
    } catch (error) {
        throw error;
    }
  }

  // Get Single Task
  async getTaskById(id: number, userId: number) {
    try {
        const task = await this.baseModel.findOne(this.tableConstants.TASK, { id });

        if (!task || task.userId !== userId) return this.commonHelpers.prepareResponse( StatusCodes.NOT_FOUND, "TASK_NOT_FOUND" );
        
        return this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", task );

    } catch (error) {
        throw error;
    }
  }

  // Update Task
  async updateTask(id: number, data: any, userId: number) {
    try {
        const task = await this.baseModel.findOne(this.tableConstants.TASK, { id });

        if (!task || task.userId !== userId) return this.commonHelpers.prepareResponse( StatusCodes.NOT_FOUND, "TASK_NOT_FOUND");

        const isExistTask = await this.baseModel.findOne(this.tableConstants.TASK, { title : data.title, userId });
        if (isExistTask && isExistTask.id != id ) return this.commonHelpers.prepareResponse( StatusCodes.NOT_FOUND, "TITLE_ALREADY_EXIST");

        const updated = await this.baseModel.update(this.tableConstants.TASK, { id }, data);

        return this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", updated);

    } catch (error) {
        throw error
    }
  }

  // Delete Task
  async deleteTask(id: number, userId: number) {
     try {
        const task = await this.baseModel.findOne(this.tableConstants.TASK, { id });

        if (!task || task.userId !== userId) return this.commonHelpers.prepareResponse( StatusCodes.NOT_FOUND, "TASK_NOT_FOUND");

        await this.baseModel.delete(this.tableConstants.TASK, { id });

        return this.commonHelpers.prepareResponse(StatusCodes.OK,"SUCCESS");

    } catch (error) {
        throw error
    }
  }    

  // Toggle Task
  async toggleTask(id: number, userId: number) {
     try {
        const task = await this.baseModel.findOne(this.tableConstants.TASK, { id });

        if (!task || task.userId !== userId) return this.commonHelpers.prepareResponse( StatusCodes.NOT_FOUND, "TASK_NOT_FOUND");

        const updated = await this.baseModel.update(
          this.tableConstants.TASK,
          { id },
          { completed: !task.completed }
        );

        return this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", updated );

    } catch (error) {
      throw error
    }
  }    
}

export default TaskService;