import { log } from "node:console";

const wsUri = "ws://127.0.0.1/"
const ws = new WebSocket(wsUri)

ws.addEventListener("open", () => {
    log("Connection established.")
})
