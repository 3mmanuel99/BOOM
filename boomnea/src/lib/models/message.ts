import { queries } from "../database/database.ts";
import { IDGenerators } from "../utility/idGeneration.ts";


enum ChatChannelType {
    CHAT_TYPE_GENERAL = "GENERAL",
    CHAT_TYPE_TEAM_A = "TEAM A",
    CHAT_TYPE_TEAM_B = "TEAM B"
}

interface MessageInterface {
    messageId: string,
    createdBy: string,
    createdAt: Date,
    ChatType: ChatChannelType
    msgContent: string
}

export class Message {
    // return type is Promise<string> (?)
    static async createMessage(message: Partial<MessageInterface>) {
        const {data} = await queries
                .from("Chat")
                .insert({
                    MessageID: message.messageId,
                    UserID: message.createdBy,
                    MessageCreatedAt: message.createdAt,
                    MessageContent: message.msgContent      
                })
    }
    
}