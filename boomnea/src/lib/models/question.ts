import { queries } from "../database/database.ts";
import { IDGenerators } from "../utility/idGeneration.ts";

export interface Question {
    question: string
    questionID: string,
    createdByUserID: string,
    phaseNum: number,
    createdAt: Date,
    options: object
}

// GET api/question/:questionID
export async function getQuestion(properties: Partial<Question>): Promise<object | undefined> {
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
        return undefined;
    }
}

// POST api/question/:userID 
// todo: continue this...
// user auth?
// return type is Promise<string> btw
export async function createQuestion(properties: Partial<Question>) {
    const questionIdGen = IDGenerators.questionIdGenerator();

    const _questionInfo: Partial<Question> = {
        question: properties.question,
        questionID: properties.questionID ?? questionIdGen,
        createdByUserID: properties.createdByUserID,
        phaseNum: properties.phaseNum,
        createdAt: properties.createdAt,
        options: properties.options
    }
    const _result = await queries
        .from("UGQuestion")
        .insert("UGQuestionID, UserID, PhaseNum, QnCreatedAt, Answers, Question") 
    // ...
             
}