import { queries } from "../database/database.ts";
// import { questionIdGenerator } from "../utility/idGeneration.ts";


export interface Question {
    question: string
    questionID: string,
    createdByUserID: string,
    phaseNum: number,
    createdAt: Date,
    options: object
}

/*
function _createQuestionFactoryFunc(data: Partial<Question>): object
{
    return {
        question: data.question,
        questionId: data.questionID ?? questionIdGenerator(),
        createdByUserID: data.createdByUserID,
        phaseNum: data.phaseNum,
        createdAt: data.createdAt,
        options: data.options
    };
}
*/

// GET api/question/:questionID
export async function getQuestion(properties: Partial<Question>): Promise<object | undefined> {
    const result = await queries
        .from("UGQuestion")
        .select("UGQuestionID, UserID, PhaseNum, QnCreatedAt, Question, Answers")
        .eq("UGQuestionID", properties.questionID);  
    // ** if there is a record in the database
    if (result.data?.[0]) {
        const questionInfo = {
            question: result.data?.[0]["Question"],
            questionId: result.data?.[0]["UGQuestionID"],
            phaseNumber: result.data?.[0]["PhaseNum"],
            createdBy: result.data?.[0]["UserID"],
            createdAt: result.data?.[0]["QnCreatedAt"],
            options: result.data?.[0]["Answers"]
        };
        return questionInfo;
    } else {
        return undefined;
    }
}

// POST api/question/:userID 
// todo: continue this...
export async function createQuestion(properties: Partial<Question>): Promise<string> {
    const result = await queries
        .from("UGQuestion")
        .insert("UGQuestionID, UserID, PhaseNum, QnCreatedAt, Answers, Question") 
             
}
/*
export async function createQUestion(attributes: Question) {
    // ** attributes.createdByUserID 
    // ** is passed twice as we 
    // ** need to check whether the 
    // ** user exists on the Users table.
    const question: object = createQuestionFactoryFunc({
        question: attributes.question,
        questionID: attributes.questionID,
        createdByUserID: attributes.createdByUserID,
        phaseNum: attributes.phaseNum,
        createdAt: attributes.createdAt,
        options: attributes.options
    })
    const _result = await queries(`
        IF EXISTS (SELECT UserID FROM Users WHERE UserID = $1) BEGIN
        INSERT INTO
        "UGQuestion"
        VALUES
        ($2, $3, $4, $5, $6, $7)
        END
        `, []
        )
    return;
}
*/
// DELETE api/question/:questionID/:userID ...
// PUT api/question/:questionID/:userID...