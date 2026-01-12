import { Document } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserMethods {
    comparePassword(cadidatePassword: string): Promise<boolean>
}

export interface IUserDocument extends IUser, IUserMethods, Document {}