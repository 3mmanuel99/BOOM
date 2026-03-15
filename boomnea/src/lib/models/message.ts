// message.ts

import { queries } from "../database/database.ts";
import { IDGenerators } from "../utility/idGeneration.ts";


enum ChatChannelType {
    CHAT_TYPE_GENERAL = "GENERAL",
    CHAT_TYPE_TEAM_A = "TEAM_A",
    CHAT_TYPE_TEAM_B = "TEAM_B"
}

interface MessageInterface {
    messageId: string,
    createdBy: string,
    createdAt: Date,
    ChatType: ChatChannelType
    msgContent: string
}

export class Message {
    // creates a message
    static async createMessage(message: Partial<MessageInterface>): Promise<string | undefined> {

        const messageIDGen: string = IDGenerators.messageIdGeneration();
        const {data, error} = await queries
                .from("Chat")
                .insert({
                    MessageID: message.messageId,
                    UserID: message.createdBy,
                    MessageCreatedAt: message.createdAt,
                    MessageContent: message.msgContent      
                })
        if (!error)
        {
            return message.msgContent;
        } else {
            throw new Error(`${error}`)
        }
    }
    
}