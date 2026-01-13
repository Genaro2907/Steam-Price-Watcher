import { IUserDocument } from "@/interfaces/user.interface";
import { UserModel } from "@/models/user.model";

export class UserRepository {
    async findById(id: string): Promise<IUserDocument | null> {
        return await UserModel.findById(id)
            .select('-passwordHash')
            .lean();
    }
}

export const userRepository = new UserRepository();