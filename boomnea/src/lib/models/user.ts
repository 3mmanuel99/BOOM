// user.ts
// Libraries used: 
// Bcrypt: https://www.npmjs.com/package/bcrypt
// JSONWebToken: https://www.npmjs.com/package/jsonwebtoken

import { queries } from "../database/database.ts";
import { IDGenerators } from "../utility/idGeneration.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";
import { UserConstraints } from "../utility/userConstraints.ts";
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
    static readonly DATE: Date = new Date();
    static readonly USER_ID_GENERATION: string = IDGenerators.userIdGeneration();

    // registers a user
    static async registerUser(properties: Partial<UserInterface>): Promise<number> {
        // checking if the username or password meet the constraints
        if (!UserConstraints.user(String(properties.username)) || !UserConstraints.password(String(properties.password)))
        {
            return HTTP_STATUS_CODES.HTTP_FORBIDDEN;
        }
        const {data} = await queries
            .from("User")
            .select("Username")
            .eq("Username", properties.username);
        
        // if the user exists
        if (data?.[0]) {
            return HTTP_STATUS_CODES.HTTP_CONFLICT;
        } else {
            // generating a hash from the password
            const salt: string  = await bcrypt.genSalt(10);
            const hash: string  = await bcrypt.hash(properties.password, salt)


            const {error} = await queries
                .from("User")
                .insert({
                    UserID: this.USER_ID_GENERATION,
                    Username: properties.username,
                    Password: hash,
                    CreatedAt: this.DATE
                });
            if (!error) {
                return HTTP_STATUS_CODES.HTTP_CREATED;
            } else {
                throw {
                    message: error.message
                }
            }
        }
    }

    // allows a user to log in into their account
    static async loginUser(properties: Partial<UserInterface>): Promise<string | number> {
        const {data} = await queries
            .from("User")
            .select(`Username, Password`)
            .eq("Username", properties.username);
        
        // if the user does not exist
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
                .from("Question")
                .select("UGQuestionID, Question, PhaseNum, UserID, Answers, QnCreatedAt")
                .eq("UserID", data?.[0].UserID)

            // if the user has created a question, we loop through ALL the question they have created.
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

    // updates user information
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
                    if (!UserConstraints.password(properties.newPassword!))
                    {
                        return HTTP_STATUS_CODES.HTTP_FORBIDDEN;
                    }
                    // generating a hash for the new password
                    const salt: string  = await bcrypt.genSalt(10);
                    const hash: string  = await bcrypt.hash(properties.newPassword, salt)

                    const {error} = await queries
                        .from("User")
                        .update({Password: hash})
                        .eq("Username", properties.username)
                    if (!error) {
                        return HTTP_STATUS_CODES.HTTP_OK;
                    } else {
                        throw {
                            message: error.message
                        }
                    }
                }
                default:
                    return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;

            }

        }
    }
    
    // deletes a user from the database
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
                throw {
                    message: error.message
                };
            } else {
                return HTTP_STATUS_CODES.HTTP_OK;
            }
        }
    }

}