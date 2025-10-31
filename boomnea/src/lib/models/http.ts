// deno-lint-ignore-file no-explicit-any
import express from "express";
import { getQuestion, Question } from "./question.ts";
import { User } from "./user.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";
import { queries } from "../database/database.ts";
import bodyParser from "body-parser";

const HTTP_PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.get("/", (_req: any, res: { send: (arg0: string) => void; }) => {
    res.send("Hello world! (I hope I can complete my coursework on time...)");
});

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
            res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                error: "Question not found."
            });
        }
        res.send(getQuestionQuery);
    } catch (err: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! (${err})`
        });
    }
})

// POST /api/user/register
app.post("/api/user/register", async (req: any, res: any) => {
    try {
        const user = await User.registerUser({
            username: req.body.username,
            password: req.body.password
        });

        if (user === HTTP_STATUS_CODES.HTTP_BAD_REQUEST) {
            res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).send({
                error: "User already exists."
            });
        } else if (user === HTTP_STATUS_CODES.HTTP_CREATED) {
            res.status(HTTP_STATUS_CODES.HTTP_CREATED).send({
                message: "User created successfully."
            });
        }
    } catch (error: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error}`
        });
    }
});

app.post("api/user/login", async (req: any, res: any) => {
    try {
        const user = await queries
            .from("User")
            .select("Username")
            .eq("Username", req.body.username)
        if (!user.data?.[0]) {
            res.status(401).send({
                error: "Invalid credentials"
            });
        } 

        const passwordMatch = await queries
            .from("User")
            .select("Password")
            .eq("Password", req.body.password);

        if (!passwordMatch.data?.[0]) {
            res.status(401).send({
                error: "Invalid credentials"
            });
        }
    } catch (err: unknown) {
        res.status(500).send({
            error: `Internal Server Error: ${err}`
        })
    }
})

// GET api/user/:userID
app.get("/api/user/:userID", async (req: any, res: any) => {
    try {
        const userIDParams = req.params["userID"];
        const userInterfaceProperties: Partial<User> = {
            userID: userIDParams
        };
        const getUserQuery = await User.getUser(userInterfaceProperties);
        if (!getUserQuery) {
            res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                error: "User not found."
            });
        }
        res.send(getUserQuery);
    } catch (err: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! (${err})`
        });
    }
})

app.listen(HTTP_PORT, () => {
    console.log(`Now listening on port ${HTTP_PORT}!`);
})
