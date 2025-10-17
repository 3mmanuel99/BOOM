// deno-lint-ignore-file no-explicit-any
import express from "express";
import { getQuestion, Question } from "./question.ts";
import { getUser, User } from "./user.ts";

const HTTP_PORT = 3000;
const app = express();


app.get("/", (_req: any, res: { send: (arg0: string) => void; }) => {
    res.send("Hello world! (I hope I can complete my coursework on time...)");
});

// GET api/question/:questionID
app.get("/api/question/:questionID", async (req: any, res: any) => {
    try {
        const questionIDParam = req.params["questionID"];
        const questionInterfaceProperties: Partial<Question> = {
            questionID: questionIDParam
        }
        const getQuestionQuery = await getQuestion(questionInterfaceProperties);
        if (!getQuestionQuery)
        {
            res.status(404).send({
                error: "Question not found."
            });
        }
        res.send(getQuestionQuery);
    } catch (err: unknown) {
        res.status(500).send({
            error: `Internal Server Error! (${err})`
        });
    }
})
// todo: POST api/question/...
/*
app.post("api/question/:userID", async (req: any, _res: any) => {
    try {
        const userIDParam = req.params["userID"];
        const _createQuestionQUery = await createQUestion(userIDParam);
        // ...
    } catch {
        // ...
    }
})
*/
// GET /api/user/:userID
app.get("/api/user/:userID", async (req: any, res: any) => {
    try {
        const userIDParams = req.params["userID"];
        const userInterfaceProperties: Partial<User> = {
            userID: userIDParams
        };
        const getUserQuery = await getUser(userInterfaceProperties);
        if (!getUserQuery) {
            res.status(404).send({
                error: "User not found."
            });
        }
        res.send(getUserQuery);
    } catch (err: unknown) {
        res.status(500).send({
            error: `Internal Server Error! (${err})`
        });
    }
})

app.listen(HTTP_PORT, () => {
    console.log(`Now listening on port ${HTTP_PORT}!`);
})
