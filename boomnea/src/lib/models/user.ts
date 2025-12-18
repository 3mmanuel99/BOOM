import { queries } from "../database/database.ts";
import { IDGenerators } from "../utility/idGeneration.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface UserInterface {
    userID: string,
    username: string,
    password: string,
    newUsername: string,
    newPassword: string,
    createdAt: Date
}

export class User {
    static async registerUser(properties: Partial<UserInterface>): Promise<number> {
        const {data} = await queries
            .from("User")
            .select("Username")
            .eq("Username", properties.username);
        
        if (data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_CONFLICT;
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

    static async loginUser(properties: Partial<UserInterface>): Promise<number | string> {
        const {data} = await queries
            .from("User")
            .select(`Username, Password`)
            .eq("Username", properties.username);
        
        if (!data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
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
    static async getUser(properties: Partial<UserInterface>): Promise<object | number>
    {
        const {data} = await queries
            .from("User")
            .select("UserID, Username, CreatedAt")
            .eq("Username", properties.username)

        if (!data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
        } else {
            const userInfo = {
                userId: data?.[0].UserID,
                username: data?.[0].Username,
                createdAt: data?.[0].CreatedAt,
                questionsCreated: [{}],
            };

            const questionInfo = await queries
                .from("UGQuestion")
                .select("UGQuestionID, Question, PhaseNumber, CreatedAt, Option")
                .eq("CreatedBy", data?.[0].UserID)

            if (questionInfo.data) {
                for (let idx = 0; idx < questionInfo.data!.length; idx++) {
                    userInfo.questionsCreated[idx] = questionInfo.data?.[idx];
                }
            } else {
                userInfo.questionsCreated = []; // no questions created by a specified user found
            }

            return userInfo;

        } 
    }
    // note to self: implement updating user (username OR password) and deleting them (needs password auth obviously)
    // note to self: PUT requests either return HTTP status code of 200 (OK) or 204 (no content)
    static async updateUser(properties: Partial<UserInterface>, option: string): Promise<number> {
        const {data} = await queries
            .from("User")
            .select("Username, Password")
            .eq("Username", properties.username)
        if (!data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
        } else {
            const passwordMatch = await bcrypt.compare(properties.password, data?.[0]["Password"])
            if (!passwordMatch)
            {
                return HTTP_STATUS_CODES.HTTP_UNAUTHORISED;
            }
            switch (option.toLowerCase()) {
                case "username": {
                    const {error} = await queries
                        .from("User")
                        .update({Username:  properties.newUsername})
                        .eq("Username", properties.username)

                    if (!error) {
                        return HTTP_STATUS_CODES.HTTP_OK;
                    } else {
                        throw new Error(`${error.details}`)
                    }
                }
                case "password": {
                    const salt: string  = await bcrypt.genSalt(10);
                    const hash: string  = await bcrypt.hash(properties.newPassword, salt)

                    const {error} = await queries
                        .from("User")
                        .update({Password: hash})
                        .eq("Username", properties.username)
                    if (!error) {
                        return HTTP_STATUS_CODES.HTTP_OK;
                    } else {
                        throw new Error(`${error.message}`)
                    }
                }
                default:
                    return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;

            }

        }
    }
    static async deleteUser(properties: Partial<UserInterface>): Promise<number> {
        const {data} = await queries
            .from("User")
            .select("Username, Password")
            .eq("Username", properties.username);
    
        if (!data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
        } else {
            const password = bcrypt.compare(properties.password, data?.[0].Password);

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