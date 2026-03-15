// http.ts

// Libraries used:
// Express: https://www.npmjs.com/package/express
// Body Parser: https://www.npmjs.com/package/body-parser

// deno-lint-ignore-file no-explicit-any
import express from "express";
import bodyParser from "body-parser";
import { Question } from "./question.ts";
import { User } from "./user.ts";
// import { Message } from "./message.ts";
// import { WebSocketServer } from "ws";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";

const HTTP_PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const _server = app.listen(HTTP_PORT, () => {
    console.log(`Now listening on port ${HTTP_PORT}!`);
});



// Websockets
/*
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("Websocket connected.")
});

wss.on("message", (data) => {
    // ...
})
*/

// every endpoint here that has a request body will pass it onto a function from a class

// GET /api/question/:questionID
app.get("/api/question/:questionID", async (req: any, res: any) => {
    try {
        const questionIDParam: string = req.params["questionID"];
        const getQuestionQuery: object | number = await Question.getQuestion({
            questionID: questionIDParam
        });
        switch (getQuestionQuery) {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                    error: "Question not found."
                });
                break;
            default:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    message: getQuestionQuery
                });
                break;
        }
    } catch (err: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! (${err})`
        });
    }
});

// POST /api/question/create
app.post("/api/question/create", async (req: any, res: any) => {
    try {
        const questionCreate: Question = await Question.createQuestion({
            username: req.body.username,
            password: req.body.password,
            question: req.body.question,
            phaseNum: req.body.phaseNum,
            options: req.body.options
        })

        switch (questionCreate) {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                    error: "User does not exist."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_BAD_REQUEST:
                res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).send({
                    error: "Bad request."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORISED).send({
                    error: "Invalid password."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_FORBIDDEN:
                res.status(HTTP_STATUS_CODES.HTTP_FORBIDDEN).send({
                    error: "Your options does not meet the phase number constraints or your answer options have at least one property which is not boolean, or one or more of them are true."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_CREATED:
                res.status(HTTP_STATUS_CODES.HTTP_CREATED).send({
                    message: "Question successfully created!"
                });

        }
    } catch (error: any) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error.message}`
        });
    }
})

// PUT /api/question/update
app.put("/api/question/update", async (req: any, res: any) => {
    try {
        const questionUpdate: Question = await Question.updateQuestion({
            username: req.body.username, 
            password: req.body.password,
            questionID: req.body.questionID,
            Question: req.body.newQuestion,
            Answers: req.body.newOptions,
            PhaseNum: req.body.newPhaseNum
        });
        switch (questionUpdate)
        {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                    error: "User or question not found."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORISED).send({
                    error: "Invalid password or nothing to update has been filled."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_FORBIDDEN:
                res.status(HTTP_STATUS_CODES.HTTP_FORBIDDEN).send({
                    error: "Your options do not meet the phase number constraints."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_BAD_REQUEST:
                res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).send({
                    error: "Bad request."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_OK:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    message: "Information updated successfully."
                });
        }
    } catch (error: any) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error.message}`
        });
    }
})

// DELETE /api/question/delete
app.delete("/api/question/delete", async (req: any, res: any) => {
    try {

        const questionDelete = await Question.deleteQuestion({
            username: req.body.username,
            password: req.body.password,
            questionID: req.body.questionID
        });

        switch (questionDelete) {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                    error: "User not found."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORISED).send({
                    error: "Invalid password or you do not own this question."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_OK:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    message: "Question deleted successfully."
                });
                break;
        }
    } catch (error: any) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error}`
        });
    }
})

// POST /api/user/register
app.post("/api/user/register", async (req: any, res: any) => {
    try {
        const userRegistration: User = await User.registerUser({
            username: req.body.username,
            password: req.body.password
        });

        switch (userRegistration) {
            case HTTP_STATUS_CODES.HTTP_CONFLICT:
                res.status(HTTP_STATUS_CODES.HTTP_CONFLICT).send({
                    error: "User already exists."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_FORBIDDEN:
                res.status(HTTP_STATUS_CODES.HTTP_FORBIDDEN).send({
                    error: {
                        error: "Your username / password does not meet the constraints.",
                        information: "Your username should be between 3 and 16 characters long, should have at least one lowercase character and should not have any special characters. Your password should be between 8 and 64 characters long, should have at least one uppercase and lowercase letter, should have at least a number and a special character."
                    }
                })
                break;
            case HTTP_STATUS_CODES.HTTP_CREATED:
                res.status(HTTP_STATUS_CODES.HTTP_CREATED).send({
                    message: "User created successfully."
                });
                break;
        }
    } catch (error: any) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error.message}`
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
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).send({
                    error: "User not found."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORISED).send({
                    error: "Incorrect password."
                });
                break;
            default:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    userLogin
                });
                break;
        }
    } catch (error: any) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error.message}`
        });
    }
});

// GET api/user/:username
app.get("/api/user/:username", async (req: any, res: any) => {
    try {
        const usernameParams: string = req.params["username"];
        const getUserQuery = await User.getUser({
            username: usernameParams
        });

        switch (getUserQuery) {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                    error: "User not found."
                });
                break;
            default:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    info: getUserQuery
                });
                break;
        }
    } catch (error: any) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! (${error.message})`
        });
    }
});

// PUT /api/user/update/:option
app.put("/api/user/update/:option", async (req: any, res: any) => {
    try {
        const option: string = req.params["option"];

        const updateUserQuery = await User.updateUser({
            username: req.body.username,
            newUsername: req.body.newUsername,
            password: req.body.password,
            newPassword: req.body.newPassword,
        }, option)

        switch (updateUserQuery) {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                    error: "User not found."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_UNAUTHORISED:
                res.status(HTTP_STATUS_CODES.HTTP_UNAUTHORISED).send({
                    error: "Incorrect password."
                });
                break;
            case HTTP_STATUS_CODES.HTTP_BAD_REQUEST:
                res.status(HTTP_STATUS_CODES.HTTP_BAD_REQUEST).send({
                    error: "Invalid option parameter."
                })
                break;
            case HTTP_STATUS_CODES.HTTP_FORBIDDEN:
                res.status(HTTP_STATUS_CODES.HTTP_FORBIDDEN).send({
                    error: {
                        error: "Your new password does not meet the constraints.",
                        information: "Your password should be between 8 and 64 characters, must have at least one uppercase and one lowercase letter and must have at least one sepcial character."
                    }
                })
                break;
            case HTTP_STATUS_CODES.HTTP_OK:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    message: "Information updated successfully."
                })
                break;
        }
    } catch (error: any) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! (${error.message})`
        })
    }
})

// DELETE api/user/delete
app.delete("/api/user/delete", async (req: any, res: any) => {
    try {
        const userDeletion = await User.deleteUser({
            username: req.body.username,
            password: req.body.password
        });

        switch (userDeletion)
        {
            case HTTP_STATUS_CODES.HTTP_NOT_FOUND:
                res.status(HTTP_STATUS_CODES.HTTP_NOT_FOUND).send({
                    error: "User not found."
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
    } catch (error: any) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            message: `Internal Server Error! (${error.message})`
        });
    }
})

// POST /api/message/create
/*
app.post("/api/message/create", async (req: any, res: any) => {
    try
    {
        const messageCreation = await Message.createMessage({
            
        })
    }
})
*/