import { queries } from "../database/database.ts";
// import {userIdGeneration} from "../utility/idGeneration.ts";

export interface User {
    userID: string,
    username: string,
    password: string,
    userCreatedAt: Date
}

// creates a user account
/*
export async function createUser(username: string, password: string): Promise<string> {
    // todo: use hashing algorithm for passwords so they can be stored safely (WIP)
    // ...
    await queries(`
        INSERT INTO 
        "User" 
        (UserID, Username, Password, CreatedAt) 
        VALUES ($1, $2, $3, $4)`, 
        [userIdGeneration(), username, password, Date.now()]);
    return "User created successfully.";
}
*/

// fetches only one user in specific
export async function getUser(properties: Partial<User>): Promise<object | undefined>
{
    const result = await queries
        .from("User")
        .select("UserID, Username, CreatedAt");
    if (result.data?.[0]) {
        const userInfo = {
            userId: properties.userID,
            username: properties.username,
            userCreatedAt: properties.userCreatedAt
        };
        return userInfo;
    } else {
        return undefined;
    }
}

// DELETE api/question/:userID
export async function deleteUser(properties: Partial<User>): Promise<string | undefined> {
    const result = await queries
        .from("User")
        .delete()
        .eq("Password", properties.password)
}