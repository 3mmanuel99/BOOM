import { queries } from "../database/database.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";
import { IDGenerators } from "../utility/idGeneration.ts";
import { User } from "./user.ts";


interface QuestionInterface {
    username: string,
    password: string,
    question: string,
    Question: string,
    questionID: string,
    createdByUserID: string,
    phaseNum: number,
    PhaseNum: number,
    createdAt: Date,
    options: object,
    Answers: object
}

enum NUM_OPTIONS_PHASE {
    PHASE_1 = 4,
    PHASE_2 = 5,
    PHASE_3 = 2,
    PHASE_4 = 1
}

export class Question {

    static readonly DATE: Date = new Date();
    static readonly QUESTION_ID_GENERATION: string = IDGenerators.questionIdGeneration();

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

                if (properties.options === undefined) {
                    return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;
                } 

                let trueCount: number = 0;
                for (const [_key, value] of Object.entries(properties.options)) {
                    if (typeof value !== "boolean") {
                        return HTTP_STATUS_CODES.HTTP_FORBIDDEN;
                    }
                    if (value == true)
                    {
                        trueCount++;
                        if (trueCount > 1) {
                            return HTTP_STATUS_CODES.HTTP_FORBIDDEN;
                        }
                    }
                }
                
                const {error} = await queries
                    .from("Question")
                    .insert({
                        UGQuestionID: this.QUESTION_ID_GENERATION,
                        UserID: data?.[0].UserID,
                        PhaseNum: properties.phaseNum,
                        QnCreatedAt: this.DATE,
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

    static async updateQuestion(properties: Partial<QuestionInterface>): Promise<number> {
        const login = await User.loginUser({
            username: properties.username,
            password: properties.password
        });

        switch (login)
        {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                return HTTP_STATUS_CODES.HTTP_UNAUTHORISED
            default: {

                const user = await queries
                    .from("User")
                    .select("UserID")
                    .eq("Username", properties.username)

                const {data} = await queries
                    .from("Question")
                    .select("Question, Answers, PhaseNum, UserID")
                    .eq("UGQuestionID", properties.questionID)

                if (data?.[0].UserID !== user.data?.[0].UserID) {
                    return HTTP_STATUS_CODES.HTTP_UNAUTHORISED;
                }

                if (!data) {
                    return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
                }

                // deno-lint-ignore no-explicit-any
                const updates: any = {};

                if (properties.Question) {
                    updates.Question = properties.Question;
                }
                if (properties.PhaseNum !== undefined && properties.Answers !== undefined) {
                    if (this.phaseNumConstraints(properties.PhaseNum) !== Object.keys(properties.Answers).length)
                    {
                        return HTTP_STATUS_CODES.HTTP_FORBIDDEN;
                    }
                    updates.PhaseNum = properties.PhaseNum;
                    updates.Answers = properties.Answers;
                    
                }
                if (properties.PhaseNum === undefined && properties.Answers !== undefined)
                {
                    updates.Answers = properties.Answers;
                }
                if (properties.PhaseNum !== undefined && properties.Answers === undefined)
                {
                    updates.PhaseNum = properties.PhaseNum;
                }
                if (properties.PhaseNum === undefined && properties.Answers === undefined)
                {
                    if (properties.Question === undefined)
                    {
                        return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;
                    }
                }


                if (Object.keys(updates).length == 0)
                {
                    return HTTP_STATUS_CODES.HTTP_BAD_REQUEST;
                }

                const {error} = await queries
                    .from("Question")
                    .update(updates)
                    .eq("UGQuestionID", properties.questionID)
                if (!error) {
                    return HTTP_STATUS_CODES.HTTP_OK;
                } else {
                    throw {
                        message: error.message
                    }
                }
                
            }
        }
    }

    static async deleteQuestion(properties: Partial<QuestionInterface>): Promise<number> {
        const login = await User.loginUser({
            username: properties.username,
            password: properties.password
        })

        switch (login) {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                return HTTP_STATUS_CODES.HTTP_NOT_FOUND;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                return HTTP_STATUS_CODES.HTTP_UNAUTHORISED;
            default: {
                const {data} = await queries
                    .from("User")
                    .select("UserID")
                    .eq("Username", properties.username)

                 const question = await queries
                    .from("Question")
                    .select("Question, Answers, PhaseNum, UserID")
                    .eq("UGQuestionID", properties.questionID)

                if (data?.[0].UserID !== question.data?.[0].UserID) {
                    return HTTP_STATUS_CODES.HTTP_UNAUTHORISED;
                }

                const {error} = await queries
                    .from("Question")
                    .delete()
                    .eq("UGQuestionID", properties.questionID)
                if (!error) {
                    return HTTP_STATUS_CODES.HTTP_OK;
                } else {
                    throw {
                        error: error.message
                    }
                }

                
            }
        }
    }

}