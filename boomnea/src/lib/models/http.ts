// deno-lint-ignore-file no-explicit-any
import express from "express";
import bodyParser from "body-parser";
import { Question } from "./question.ts";
import { User } from "./user.ts";
import { Message } from "./message.ts";
// import { WebSocketServer } from "ws";
import { HTTP_STATUS_CODES } from "../utility/httpStatusCodes.ts";

const HTTP_PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const server = app.listen(HTTP_PORT, () => {
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


// GET /
// please remove this once you are done testing. thank you.
app.get("/", (_req: any, res: { send: (arg0: string) => void; }) => {
    res.send("Hello world! (I hope I can complete my coursework on time...)");
});

// GET api/question/:questionID
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
    } catch (error: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! ${error}`
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
    } catch (err: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! (${err})`
        });
    }
});

// PUT /api/user/update
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
            case HTTP_STATUS_CODES.HTTP_OK:
                res.status(HTTP_STATUS_CODES.HTTP_OK).send({
                    message: "Information updated successfully."
                })
                break;
        }
    } catch (err: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            error: `Internal Server Error! (${err})`
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
    } catch (error: unknown) {
        res.status(HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR).send({
            message: `Internal Server Error! (${error})`
        });
    }
})

// POST /api/message/create
app.post("/api/message/create", async (req: any, res: any) => {
    try
    {
        const messageCreation = await Message.createMessage({
            
        })
    }
})