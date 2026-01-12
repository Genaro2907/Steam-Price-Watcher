import { IUserDocument } from "@/interfaces/user.interface";
import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phoneNumber: String,
        passwordHash: {
            type: String,
            select: false
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.passwordHash);
}
export const UserModel = model<IUserDocument> ('User', UserSchema);

