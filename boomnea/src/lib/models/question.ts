import { queries } from "../database/database.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";
import { IDGenerators } from "../utility/idGeneration.ts";
import { User } from "./user.ts";


interface QuestionInterface {
    username: string,
    password: string,
    question: string,
    newQuestion: string,
    questionID: string,
    createdByUserID: string,
    phaseNum: number,
    newPhaseNum: number,
    createdAt: Date,
    options: object
}

enum NUM_OPTIONS_PHASE {
    PHASE_1 = 4,
    PHASE_2 = 5,
    PHASE_3 = 2,
    PHASE_4 = 1
}

export class Question {

    static phaseNumConstraints(phaseNum: number): number | undefined {
        switch (phaseNum) {
            case 1:
                return NUM_OPTIONS_PHASE.PHASE_1;
            case 2:
                return NUM_OPTIONS_PHASE.PHASE_2;
            case 3:
                return NUM_OPTIONS_PHASE.PHASE_3;
            case 4:
                return NUM_OPTIONS_PHASE.PHASE_4;
            default:
                return undefined;
        }
    }
    
    static async getQuestion(properties: Partial<QuestionInterface>): Promise<object | number> {
        const {data} = await queries
            .from("Question")
            .select("UGQuestionID, UserID, PhaseNum, QnCreatedAt, Question, Answers")
            .eq("UGQuestionID", properties.questionID);  
        // ** if there is a record in the database
        if (data?.[0]) {
            const questionInfo = {
                question: data?.[0].Question,
                questionId: data?.[0].UGQuestionID,
                phaseNumber: data?.[0].PhaseNum,
                createdBy: data?.[0].UserID,
                createdAt: data?.[0].QnCreatedAt,
                options: data?.[0].Answers
            };
            return questionInfo;
        } else {
            return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
        }
    }

    static async createQuestion(properties: Partial<QuestionInterface>): Promise<number> {
        const questionIdGen = IDGenerators.questionIdGeneration();
        const date = new Date();
        const login: User = await User.loginUser({
            username: properties.username,
            password: properties.password
        });  

        switch (login) {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                return HTTP_STATUS_CODES.HTTP_UNAUTHORISED;
            default: {

                if (Object.keys(properties.options!).length !== this.phaseNumConstraints(properties.phaseNum!)) {
                    return HTTP_STATUS_CODES.HTTP_FORBIDDEN;
                }
                const {data} = await queries
                            .from("User")
                            .select(`UserID`)
                            .eq("Username", properties.username);
                
                const {error} = await queries
                    .from("Question")
                    .insert({
                        UGQuestionID: questionIdGen,
                        UserID: data?.[0].UserID,
                        PhaseNum: properties.phaseNum,
                        QnCreatedAt: date,
                        Answers: properties.options,
                        Question: properties.question
                    })
                if (!error) {
                    return HTTP_STATUS_CODES.HTTP_CREATED;
                } else {
                    throw {
                        message: error.message
                    }
                }
            }

        }       
   
    }
    /*
    static async updateQuestion(properties: Partial<QuestionInterface>): Promise<number> {
        const date = new Date();
        const login = await User.loginUser({
            username: properties.username,
            password: properties.password
        });

        if (login == HTTP_STATUS_CODES.HTTP_UNAUTHORISED || login == HTTP_STATUS_CODES.HTTP_NOT_FOUND)
        {
            return login;
        } 

        const {data, error} = await queries
            .from("Question")
            .select("UserID")
            .eq("QuestionID", properties.questionID)

        const user = await queries
            .from("User")
            .select("UserID")
            .eq("Username", properties.username)

        if (error) {
            throw {
                error: error.message
            }
        }
        if (!data) {
            return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
        } 

        if (data?.[0].UserID !== user.data?.[0].UserID)
        {
            return HTTP_STATUS_CODES.HTTP_UNAUTHORISED;
        }

        const updates: any = {};

        if (properties.newQuestion) { 
            updates.Question = properties.newQuestion;
        }
        if (properties.phaseNum) {
            updates.PhaseNum = properties.newPhaseNum;
        }
        if (properties.options && properties.options.lengt)

    }
    */

}
