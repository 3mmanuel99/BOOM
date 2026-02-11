// TASK: finish implementing this

import { queries } from "../database/database.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";
import { IDGenerators } from "../utility/idGeneration.ts";


interface QuestionInterface {
    question: string
    questionID: string,
    createdByUserID: string,
    phaseNum: number,
    createdAt: Date,
    options: object
}

export class Question {
    static async getQuestion(properties: Partial<QuestionInterface>): Promise<object | number> {
        const {data} = await queries
            .from("UGQuestion")
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

    
    // todo: continue this...
    // UPDATE: return type is Promise<number> because now we return http status codes
    // UPDATE 2: I believe you'd need to use user.ts stuff for this to work since
    // a question needs to be created under a specific user.
    static async createQuestion(_properties: Partial<QuestionInterface>) {
        const questionIdGen = IDGenerators.questionIdGenerator();
        const date = new Date();

    
        // "UGQuestionID, UserID, PhaseNum, QnCreatedAt, Answers, Question"
        const _questionCreate = await queries
            .from("UGQuestion")
            .insert({
                UGQuestionID: questionIdGen,
                UserID: "",
                PhaseNum: "",
                QnCreatedAt: date,
                Answers: "",
                Question: ""
            }) 
            
                 
    }

}
