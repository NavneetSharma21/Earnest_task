type Data = { [key: string]: any };
type WhereUnique = { [key: string]: any };
import { ModelName } from "../constants/tableConstants";

class baseModel {
    prisma: any;
    commonHelpers: any;

    constructor({
        prisma,
        commonHelpers
    }: {
        prisma: any;
        commonHelpers: any;
    }) {
        this.prisma = prisma;
        this.commonHelpers = commonHelpers;
    }

    // Create a new record
    async create(model: ModelName, data: Data) {
        try {
            return await this.prisma[model].create({ data });
        } catch (error: any) {
            console.error("Create Error:", error.message);
            throw error;
        }
    }

    // Find all records
    async findAll(model: ModelName, options: any = {}) {
        try {
            return await this.prisma[model].findMany(options);
        } catch (error: any) {
            console.error("FindAll Error:", error.message);
            throw error;
        }
    }

    // Find one record by unique key
    async findOne(model: ModelName, where: any) {
        try {
            return await this.prisma[model].findFirst({ where });
        } catch (error: any) {
            console.error("FindOne Error:", error.message);
            throw error;
        }
    }

    // Update record by unique key
    async update(model: ModelName, where: WhereUnique, data: Data) {
        try {
            return await this.prisma[model].update({ where, data });
        } catch (error: any) {
            console.error("Update Error:", error.message);
            throw error;
        }
    }

    // Delete record by unique key
    async delete(model: ModelName, where: WhereUnique) {
        try {
            return await this.prisma[model].delete({ where });
        } catch (error: any) {
            console.error("Delete Error:", error.message);
            throw error;
        }
    }
}

export default baseModel;

