import { queries } from "../database/database.ts";
import { IDGenerators } from "../utility/idGeneration.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface UserInterface {
    userID: string,
    username: string,
    password: string,
    createdAt: Date
}

export class User {
    static async registerUser(properties: Partial<UserInterface>): Promise<number> {
        const {data} = await queries
            .from("User")
            .select("Username")
            .eq("Username", properties.username);
        
        if (data?.[0] !== undefined) {
            return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;
        } else {
            const salt: string  = await bcrypt.genSalt(10);
            const hash: string  = await bcrypt.hash(properties.password, salt)
            const userIDGen: string = IDGenerators.userIdGeneration();
            const date = new Date();


            const {error} = await queries
                .from("User")
                .insert({
                    UserID: userIDGen,
                    Username: properties.username,
                    Password: hash,
                    CreatedAt: date
                });
            if (!error) {
                return HTTP_STATUS_CODES.HTTP_CREATED;
            } else {
                throw new Error(`${error}`)
            }
        }
    }

    static async loginUser(properties: Partial<UserInterface>) {
        const {data} = await queries
            .from("User")
            .select(`Username, Password`)
            .eq("Username", properties.username);
        
        if (!data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;
        } else {
            const passwordMatch = await bcrypt.compare(properties.password, data?.[0]["Password"])

            if (!passwordMatch) {
                return HTTP_STATUS_CODES.HTTP_UNAUTHORISED;
            }

            const token = jwt.sign({
                username: properties.username,
            }, 'secret')

            return token;     
        }
    }
    // fetches only one user in specific
    static async getUser(properties: Partial<UserInterface>): Promise<object | undefined>
    {
        const {data} = await queries
            .from("User")
            .select("UserID, Username, CreatedAt")
            .eq("Username", properties.username)

        if (data?.[0]) {
            const userInfo = {
                userId: data?.[0].UserID,
                username: data?.[0].Username,
                createdAt: data?.[0].CreatedAt
            };
            return userInfo;
        } else {
            return undefined;
        }
    }
    // note to self: implement updating user (username OR password) and deleting them (needs password auth obviously)
    static async updateUser(properties: Partial<UserInterface>) {
        const {data} = await queries
            .from("User")
            .select("Username, Password")
            .eq("Username", properties.username)
        if (!data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;
        } else {
            // ... the magic stuff happens here
        }
    }
    static async deleteUser(properties: Partial<UserInterface>) {
        const {data} = await queries
            .from("User")
            .select("Username, Password")
            .eq("Username", properties.username);
    
        if (!data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;
        } else {
            const password = bcrypt.compare(properties.password, data?.[0]["Password"]);

            if (!password) {
                return HTTP_STATUS_CODES.HTTP_UNAUTHORISED;
            }

            const {error} = await queries
                .from("User")
                .delete()
                .eq("Username", properties.username)
            if (error) {
                throw new Error(`${error}`);
            } else {
                return HTTP_STATUS_CODES.HTTP_OK;
            }
        }
    }

}