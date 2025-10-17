import { queries } from "../database/database.ts"

const result = await queries
        .from("UGQuestion")
        .select("UGQuestionID, UserID, PhaseNum, QnCreatedAt, Question, Answers")
        .eq("UGQuestionID", `69696969`)    
    // ** if there is a record in the database
        const list = {
            question: result.data?.[0]["Question"],
            questionId: result.data?.[0]["UGQuestionID"],
            phaseNumber: result.data?.[0]["PhaseNum"],
            createdBy: result.data?.[0]["UserID"],
            createdAt: result.data?.[0]["QnCreatedAt"],
            options: result.data?.[0]["Answers"]
        };
        
        console.log(list) || undefined

    