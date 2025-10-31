import { queries } from "../database/database.ts";
import { IDGenerators } from "../utility/idGeneration.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";
import bcrypt from "bcrypt";

export interface UserInterface {
    userID: string,
    username: string,
    password: string,
    createdAt: Date
}

export class User {
    static async registerUser(properties: Partial<UserInterface>): Promise<number> {
        const checkExistingUser = await queries
            .from("User")
            .select("Username")
            .eq("Username", properties.username);
        
        if (checkExistingUser.data?.[0] !== undefined) {
            return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;
        } else {
            const salt: string  = await bcrypt.genSalt(10);
            const hash: string  = await bcrypt.hash(properties.password, salt)
            const userIDGen: string = IDGenerators.userIdGeneration();
            const date = new Date();


            const _userQuery = await queries
                .from("User")
                .insert({
                    UserID: userIDGen,
                    Username: properties.username,
                    Password: hash,
                    CreatedAt: date
                });
            return HTTP_STATUS_CODES.HTTP_CREATED;
        }
    }
    // fetches only one user in specific
    static async getUser(properties: Partial<UserInterface>): Promise<object | undefined>
    {
        const result = await queries
            .from("User")
            .select("UserID, Username, CreatedAt");
        if (result.data?.[0]) {
            const userInfo = {
                userId: properties.userID,
                username: properties.username,
                createdAt: properties.createdAt
            };
        return userInfo;
        } else {
        return undefined;
        }
    }
    static async deleteUser(properties: Partial<UserInterface>) {
        const _result = await queries
        .from("User")
        .delete()
        .eq("Password", properties.password)
    }
}
