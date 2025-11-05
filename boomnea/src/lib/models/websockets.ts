const wsUri = "ws://127.0.0.1/"
const ws = new WebSocket(wsUri)

ws.addEventListener("open", () => {
    console.log("Connection established.")
})
