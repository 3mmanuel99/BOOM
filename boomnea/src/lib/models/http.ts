// deno-lint-ignore-file no-explicit-any
import express from "express";
import bodyParser from "body-parser";
import { getQuestion, Question } from "./question.ts";
import { User } from "./user.ts";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";

const HTTP_PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// GET /
app.get("/", (_req: any, res: { send: (arg0: string) => void; }) => {
    res.send("Hello world! (I hope I can complete my coursework on time...)");
});

// GET api/question/:questionID
app.get("/api/question/:questionID", async (req: any, res: any) => {
    try {
        const questionIDParam: string = req.params["questionID"];
        const questionInterfaceProperties: Partial<Question> = {
            questionID: questionIDParam
        }
        const getQuestionQuery: object | undefined = await getQuestion(questionInterfaceProperties);
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
});

// POST /api/user/register
app.post("/api/user/register", async (req: any, res: any) => {
    try {
        const userRegistration: User = await User.registerUser({
            username: req.body.username,
            password: req.body.password
        });

        switch (userRegistration) {
            case HTTP_STATUS_CODES.HTTP_BAD_REQUEST:
                res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).send({
                    error: "User already exists."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_CREATED:
                res.status(HTTP_STATUS_CODES.HTTP_CREATED).send({
                    message: "User created successfully."
                });
                break;
        }
    } catch (error: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error}`
        });
    }
});

// POST /api/user/login
app.post("/api/user/login", async (req: any, res: any) => {
    try {
        const userLogin: User = await User.loginUser({
            username: req.body.username,
            password: req.body.password
        });

        switch (userLogin) {
            case HTTP_STATUS_CODES.HTTP_BAD_REQUEST:
                res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).send({
                    error: "User does not exist."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORISED).send({
                    error: "Incorrect password."
                });
                break;
            default:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    message: userLogin
                });
                break;
        }
    } catch (error: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error}`
        });
    }
});

// GET api/user/:userID
app.get("/api/user/:username", async (req: any, res: any) => {
    try {
        const usernameParams: string = req.params["username"];
        const getUserQuery = await User.getUser({
            username: usernameParams
        });

        if (!getUserQuery) {
            res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                error: "User not found."
            });
        }
        res.status(HTTP_STATUS_CODES.HTTP_OK).send({
            message: getUserQuery
        })
    } catch (err: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! (${err})`
        });
    }
});

// PUT api/user/update#
// ...
// DELETE api/user/delete
app.delete("/api/user/delete", async (req: any, res: any) => {
    try {
        const userDeletion = await User.deleteUser({
            username: req.body.username,
            password: req.body.password
        });

        switch (userDeletion)
        {
            case HTTP_STATUS_CODES.HTTP_BAD_REQUEST:
                res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).send({
                    error: "User does not exist"
                });
                break;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORISED).send({
                    error: "Incorrect password."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_OK:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    message: "User deleted successfully."
                });
                break;
        }
    } catch (error: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            message: `Internal Server Error! (${error})`
        });
    }
})

app.listen(HTTP_PORT, () => {
    console.log(`Now listening on port ${HTTP_PORT}!`);
});