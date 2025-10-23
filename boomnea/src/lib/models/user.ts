import { queries } from "../database/database.ts";
// import {userIdGeneration} from "../utility/idGeneration.ts";

export interface User {
    userID: string,
    username: string,
    password: string,
    createdAt: Date
}

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
            createdAt: properties.createdAt
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